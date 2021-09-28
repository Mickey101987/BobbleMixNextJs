import Head from 'next/head';

const BobbleMixHead = (props) => {
    return (
        <Head>
            <title>{props.title || 'Bobble Mix - Fabricant de eliquide - bar à saveurs'}</title>
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png"></link>
            <link rel="manifest" href="/manifest.json"></link>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content={props.description || process.env.DESCRIPTION} />
            <meta name="twitter:site" content={props.url || process.env.DOMAIN_NAME} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={props.ogImage || ''} />
            <meta property="og:url" content={props.url || process.env.DOMAIN_NAME} />
            <meta property="og:title" content={props.title || ''} />
            <meta property="og:description" content={props.description || process.env.DESCRIPTION} />
            <meta property="og:image" content={props.ogImage || ''} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="google-site-verification" content="2q8vyCQU6A_jfatOUJpbW0nX00L1OHAYp76SeTMyHDg" />
            <link
                href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,700;0,800;1,300&display=optional"
                rel="stylesheet"
            />
        </Head>
    );
};

export default BobbleMixHead;
