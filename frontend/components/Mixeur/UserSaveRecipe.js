import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useApolloClient } from '@apollo/client';
import { signIn } from 'next-auth/client';
import { Button } from '@chakra-ui/button';
import Swal from 'sweetalert2';
import { BobbleMixContext } from '../hooks/BobbleMixContext';
import { NicoContext } from '../hooks/NicoContext';
import {
    MUTATION_INSERT_ONE_RECIPE,
    QUERY_FINGERPRINT,
    MUTATION_ADD_USER_RECIPE,
    QUERY_ALL_RECIPES,
} from '../gql/graphql';
import { useUser } from '../hooks/useUser';
import { ContextRecipeName } from '../lib/RecipeNames';
import sumMol from '../lib/SumMol';
import { encodeb64 } from '../lib/base64';
import { saveur_molecule } from '../lib/saveur_molecule';
import { molecule_risk } from '../lib/molecule_risk';
import { ConfimThis } from '../styles/AlertAndToast';

const UserSaveRecipe = () => {
    const router = useRouter();
    const { bobbleMix, setBobbleMix } = useContext(BobbleMixContext);
    const { nicoMix, setNicoMix } = useContext(NicoContext);
    const [posting, setPosting] = useState(false);
    const { user, session } = useUser();
    const uid = session && session.id ? parseInt(session.id) : null;
    const now = Date.now();
    const client = useApolloClient();

    const Reset = () => {
        setNicoMix([]);
        setBobbleMix([]);
        setPosting(false);
        console.log('context cleaned');
    };

    // TODO better update cache with update and not refetchQueries
    const [addRecipe] = useMutation(MUTATION_INSERT_ONE_RECIPE, {
        onCompleted: Reset,
        refetchQueries: [{ query: QUERY_ALL_RECIPES }],
    });
    const [fixRecipe] = useMutation(MUTATION_ADD_USER_RECIPE, { onCompleted: Reset });

    // ? be able to save the recipe only if inpute of recipe are valide
    const recipeIsValide = nicoMix.length !== 0 && nicoMix[1];

    // ? Find all molecules of flavors inside Juice
    const mixMolecules = saveur_molecule.filter(({ Saveur_ID }) => bobbleMix.map((s) => s.id).includes(Saveur_ID));

    // ? Find all Risk of molecules inside juice
    const mixRisks = molecule_risk.filter(({ Molecule_ID }) =>
        mixMolecules.map((m) => m.Molecule_ID).includes(Molecule_ID)
    );

    // ? attache the recipe to the user
    const attacheRecipe = async (recipeID, rfinger) => {
        console.log(`[${now}] [${uid}] TRYING TO attache the recipe ${rfinger}`);
        try {
            await fixRecipe({ variables: { rid: recipeID, uid: uid } });
            console.log(`[${now}] SUCCESS user ${uid} attached the recipe ${rfinger}`);
            ConfimThis.fire({
                title: 'Recette ajuté à votre profile',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('CONFIRMED: voir la recette', rfinger);
                    router.push({
                        pathname: '/recipe',
                        query: { fingerprint: rfinger },
                    });
                }
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log('TIMED: voir la recette');
                    router.push({
                        pathname: '/recipe',
                        query: { fingerprint: rfinger },
                    });
                }
                if (result.isDenied) {
                    console.log('DENIED: rester sur mixeur');
                }
            });
        } catch (err) {
            ConfimThis.fire({
                title: 'vous avez déjà cette recette!',
            }).then((result) => {
                console.log(`[${now}] NOPE user ${uid} already have the recipe ${rfinger}`);
                Reset();
                if (result.isConfirmed) {
                    console.log('CONFIRMED: voir la recette', rfinger);
                    router.push({
                        pathname: '/recipe',
                        query: { fingerprint: rfinger },
                    });
                }
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log('TIMED: voir la recette');
                    router.push({
                        pathname: '/recipe',
                        query: { fingerprint: rfinger },
                    });
                }
                if (result.isDenied) {
                    console.log('DENIED: rester sur mixeur');
                }
            });
        }
    };

    // ? create a new recipe then attache the recipe to the user
    const writeRecipe = async (rfinger) => {
        console.log(`1/4 [${now}] [${uid}] writing the recipe ${rfinger}`);
        // ? build the list of all aromas
        const allAaromas = bobbleMix.map((i, k) => {
            // save the item category path
            const ic = i.item_categories;
            // get volumes info from nicoMix
            const finder = nicoMix[0].find((x) => x.id === i.id);
            return {
                id: i.id,
                name: i.name,
                image: i.image,
                ml: finder.volume,
                percent: finder.percent,
                categories: ic.map((j, q) => {
                    return { name: j.category.name };
                }),
            };
        });
        // ? write new recipe mutation
        const variables = {
            fingerprint: rfinger,
            name: ContextRecipeName(nicoMix, 'n'),
            nicotine: 0,
            volume: await nicoMix[0].map((x) => x.volume).reduce((acc, item) => acc + item, 0),
            aromes: await allAaromas,
            molecules: mixMolecules,
            risks: mixRisks,
            molsum: sumMol(mixMolecules),
        };
        // console.log('variables for the mutation', variables);
        let rid = '';
        await addRecipe({
            update: (proxy, mutationResult) => {
                rid = mutationResult.data.insert_recipes_one.id;
            },
            variables,
        });
        console.log(`2/4 [${now}] [${uid}] writed the recipe ${rfinger}`);
        // ? attache the recipe to the user
        await fixRecipe({ variables: { rid: rid, uid: uid } });
        console.log(`3/4 [${now}] [${uid}] attached the recipe ${rfinger}`);
        console.log(`4/4 SUCCESS user ${uid} recipe ${rid}`);
        // ? redirect the user
        ConfimThis.fire({
            title: 'Recette ajuté à votre profile',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('CONFIRMED: voir la recette', rfinger);
                router.push({
                    pathname: '/recipe',
                    query: { fingerprint: encodeURIComponent(rfinger) },
                });
            }
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('TIMED: voir la recette');
                router.push({
                    pathname: '/recipe',
                    query: { fingerprint: encodeURIComponent(rfinger) },
                });
            }
            if (result.isDenied) {
                console.log('DENIED: rester sur mixeur');
            }
        });
    };

    return (
        <>
            {!user ? (
                <Button
                    size="md"
                    colorScheme="red"
                    style={{ boxShadow: 'none' }}
                    variant="solid"
                    onClick={() => signIn()}
                >
                    connectez-vous pour enregister votre recette
                </Button>
            ) : (
                <Button
                    size="md"
                    bg={!recipeIsValide ? 'darkgray' : 'orange'}
                    color={'white'}
                    variant="solid"
                    style={{ boxShadow: 'none' }}
                    isLoading={posting}
                    loadingText="ENREGISTREMENT..."
                    isDisabled={!recipeIsValide}
                    onClick={async () => {
                        setPosting(true);
                        // ? if It's a new recipe!
                        const { data } = await client.query({
                            query: QUERY_FINGERPRINT,
                            variables: { fingerprint: encodeb64(ContextRecipeName(nicoMix, 'p')) },
                        });
                        // ? if recipe already existe
                        data.recipes.length > 0 &&
                            attacheRecipe(data.recipes[0].id, encodeb64(ContextRecipeName(nicoMix, 'p')));
                        // ? if it's a new recipe write it
                        data.recipes.length === 0 && writeRecipe(encodeb64(ContextRecipeName(nicoMix, 'p')));
                    }}
                >
                    SAUVEGARDER
                </Button>
            )}
        </>
    );
};
export default UserSaveRecipe;
