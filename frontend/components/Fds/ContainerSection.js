import { useEffect, useState } from 'react';
import _ from 'lodash';
import { VStack } from '@chakra-ui/react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import Section8 from './Section8';
import Section9 from './Section9';
import Section10 from './Section10';
import Section11 from './Section11';
import Section12 from './Section12';
import Section13 from './Section13';
import Section14 from './Section14';

const ContainerSection = (props) => {
    const { mixRisk, sanitizeList, company, name } = props;

    const [isH317, setIsH317] = useState({ arr: [], sum: null, b: false });
    const [isH317_1, setIsH317_1] = useState({ arr: '', sum: null, b: false });
    const [isH317_1A, setIsH317_1A] = useState({ arr: '', sum: null, b: false });
    const [isH317_1B, setIsH317_1B] = useState({ arr: '', sum: null, b: false });
    const [isH410, setIsH410] = useState({ arr: '', sum: null, b: false });
    const [isH411, setIsH411] = useState({ arr: '', sum: null, b: false });
    const [isH412, setIsH412] = useState({ arr: '', sum: null, sum2: null, b: false });
    const [isH413, setIsH413] = useState({ arr: '', sum: null, b: false });
    const [isH226, setIsH226] = useState({ arr: '', sum: null, b: false });
    const [isH319, setIsH319] = useState({ arr: '', sum: null, b: false });
    const [isEUH208A, setIsEUH208A] = useState({ arr: '', sum: null, b: false });
    const [isEUH208B, setIsEUH208B] = useState({ arr: '', sum: null, b: false });
    const [isEUH208C, setIsEUH208C] = useState({ arr: '', sum: null, b: false });

    // function to filter by risks the mol of the recipe
    const FilterByMolRisk = (risk) => {
        let newArr = [];
        //  Filter specifique risks
        const fsr = _.filter(mixRisk, function (i, k) {
            return i.Clas_ID === risk;
        });
        //  add the molecule mod_retenuAdd
        fsr.map((i, k) => {
            const mm = _.filter(sanitizeList, { Molecule_ID: i.Molecule_ID });
            newArr = [mm[0], ...newArr];
            return mm;
        });
        return newArr;
    };

    // function that return the data when ready for futur use
    const findRisk = async (risk) => {
        // console.log(`get the risks ${risk}`);
        const [allmol, sum] = await Promise.all([
            // get the risks
            FilterByMolRisk(risk),
            // sorting them
            FilterByMolRisk(risk).reduce((acc, curr) => acc + curr.mod_retenuAdd, 0),
        ]);
        return { allmol, sum };
    };

    //  ! FIND ALL RISKS OF MOLECULES MUST BE SYNC WITH CONTAINLABEL OF LABEL FOLDER
    useEffect(() => {
        findRisk('H317-1A').then(
            (result) => {
                setIsH317_1A({
                    arr: result.allmol,
                    b: result.sum >= 0.1,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H317-1').then(
            (result) => {
                setIsH317_1({
                    arr: result.allmol,
                    b: result.sum >= 1,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H317-1B').then(
            (result) => {
                setIsH317_1B({
                    arr: result.allmol,
                    b: result.sum >= 1,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H410').then(
            (result) => {
                setIsH410({
                    arr: result.allmol,
                    b: false,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H411').then(
            (result) => {
                setIsH411({
                    arr: result.allmol,
                    b: false,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H412').then(
            (result) => {
                setIsH412({
                    arr: result.allmol,
                    b: false,
                    sum: result.sum,
                    sum2: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H413').then(
            (result) => {
                setIsH413({
                    arr: result.allmol,
                    b: false,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H226').then(
            (result) => {
                setIsH226({
                    arr: result.allmol,
                    b: false,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );

        findRisk('H319').then(
            (result) => {
                setIsH319({
                    arr: result.allmol,
                    b: false,
                    sum: result.sum,
                });
            },
            (error) => {
                console.log({ error });
            }
        );
    }, []);

    // ! ALL FINAL CHECK IF GROUPS GOT HAZARDS MUST BE SYNC WITH CONTAINLABEL OF LABEL FOLDER

    useEffect(() => {
        isH317_1A.b >= 0.01 &&
            setIsEUH208A({
                arr: isH317_1A.arr,
                b: true,
                sum: isH317_1A,
            });
    }, [isH317_1A]);

    useEffect(() => {
        isH317_1B.b >= 0.1 &&
            setIsEUH208B({
                arr: isH317_1B.arr,
                b: true,
                sum: isH317_1B,
            });
    }, [isH317_1B]);

    useEffect(() => {
        isH317_1.b >= 0.1 &&
            setIsEUH208C({
                arr: isH317_1.arr,
                b: true,
                sum: isH317_1,
            });
    }, [isH317_1]);

    // * final check for is H317
    useEffect(() => {
        //  condion H317 si une molecule H317_1A a une retenu sup a 0.1%  (0.001)
        const mergedArr = [...new Set([isH317_1A.arr, isH317_1.arr].flat())];
        const h3171A = mergedArr.map((i, k) => (i.mod_retenuAdd > 0.1 ? true : false)).includes(true);
        //  condion H317 si une molecule H317_1B et H317_1 a une retenu sup a 1% (0.01)
        // H317_1B and H317_1 have same condition so merged the arr
        const mergedArrs = [...new Set([isH317_1B.arr, isH317_1.arr].flat())];
        const h317_1B_h317_1 = mergedArrs.map((i, k) => (i.mod_retenuAdd > 1 ? true : false)).includes(true);

        // console.log('ARR H317 1A', isH317_1A.arr);
        // console.log('ARR H317 1B et 1', mergedArrs);
        // console.log('h317 1A', h3171A);
        // console.log('h317 1B or 1', h317_1B_h317_1);

        h3171A === true || h317_1B_h317_1 === true
            ? setIsH317({
                  arr: null,
                  b: true,
                  sum: null,
              })
            : setIsH317({
                  arr: null,
                  b: false,
                  sum: null,
              });
        // (isH317_1A.b === true || isH317_1B.b === true || isH317_1.b === true) &&
        //     setIsH317({
        //         arr: null,
        //         b: true,
        //         sum: null,
        //     });
    }, [isH317_1A, isH317_1B, isH317_1]);

    //  * final check for is H412
    useEffect(async () => {
        const res = (await isH410.sum) * 100 + (await isH411.sum) * 10 + (await isH412.sum);
        // console.log(` SUM H412: ${await isH410.sum}*100 + ${await isH411.sum}*10 + ${await isH412.sum}`);
        setIsH412({ ...isH412, arr: isH412.arr, b: (await res) >= 25, sum: await res });
    }, [isH411, isH410]);

    // * final check for is H413
    useEffect(async () => {
        if (isH412.b === false) {
            // const sumh411 = (await isH410.sum) * 10 + (await isH411.sum);
            const res = (await isH410.sum) + (await isH411.sum) + (await isH412.sum2) + (await isH413.sum);
            // console.log(
            //     ` SUM H413: ${await isH410.sum} + ${await isH411.sum} + ${await isH412.sum2} + ${await isH413.sum}`
            // );
            setIsH413({
                arr: isH413.arr,
                b: (await res) >= 25,
                sum: await res,
            });
        }
    }, [isH412.sum]);

    // console.log('MIX is H412', isH412);
    // console.log('MIX is H413', isH413);
    // console.log('H317 1A', isH317_1A);
    // console.log('EUH208', isEUH208A, isEUH208B, isEUH208C);

    return (
        <VStack paddingTop="40px" spacing="2" alignItems="flex-start">
            <Section1 name={name} company={company} />
            <Section2
                isH317={isH317}
                isH317_1={isH317_1}
                isH317_1A={isH317_1A}
                isH317_1B={isH317_1B}
                isH412={isH412}
                isH413={isH413}
                isH226={isH226}
                isEUH208A={isEUH208A}
                isEUH208B={isEUH208B}
                isEUH208C={isEUH208C}
            />
            <Section3 sanitizeList={sanitizeList} mixRisk={mixRisk} />
            <Section4 isH317={isH317} />
            <Section5 />
            <Section6 />
            <Section7 />
            <Section8 />
            <Section9 />
            <Section10 />
            <Section11 isH317={isH317} />
            <Section12 isH412={isH412} isH413={isH413} />
            <Section13 />
            <Section14 sanitizeList={sanitizeList} mixRisk={mixRisk} isH319={isH319} />
        </VStack>
    );
};
export default ContainerSection;
