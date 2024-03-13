

import Head from 'next/head';
import '../../styles/globals.css'
import '../scss/style.scss'
import { AuthProvider } from 'src/components/auth/JwtContext';
import { SettingsProvider } from 'src/components/settings';
import { Provider } from 'react-redux';
import store from 'src/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const App = (props) => {
  const { Component, pageProps, head_data = {}, host, host_data } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const [headData, setHeadData] = useState({});
  useEffect(() => {
    if (Object.keys(head_data).length > 0) {
      setHeadData(head_data)
    }
  }, [])
  return (
    <>
      <Head>
        <title>{head_data?.name || headData?.name}</title>
        <meta
          name='description'
          content={head_data?.og_description || headData?.og_description}
        />
        <link rel='shortcut icon' href={head_data?.favicon_img || headData?.favicon_img} />
        <link rel="apple-touch-icon" sizes="180x180" href={head_data?.favicon_img || headData?.favicon_img} />
        <meta name='keywords' content={head_data?.name || headData?.name} />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={head_data?.name || headData?.name} />
        <meta property="og:image" content={head_data?.og_img || headData?.og_img} />
        <meta property="og:url" content={'https://' + head_data?.dns || headData?.dns} />
        <meta property="og:description" content={head_data?.og_description || headData?.og_description} />
        <meta name="author" content="purplevery" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={head_data?.name || headData?.name} />
        <meta name="theme-color" content={head_data?.theme_css?.main_color || headData?.theme_css?.main_color} />
      </Head>
      <Provider store={store}>
        <AuthProvider>
          <SettingsProvider>
            {getLayout(<Component {...pageProps} />)}
          </SettingsProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}
App.getInitialProps = async (context) => {
  const { ctx } = context;
  try {
    let head_data = {}
    let host = '';
    host = ctx?.req?.headers.host.split(':')[0];
    const url = `${process.env.HOST_API_KEY}/api/domain?dns=${process.env.FRONT_URL || host}`;
    const res = await fetch(url);
    head_data = await res.json();
    return {
      head_data: head_data?.data,
    }
  } catch (err) {
    return {
      head_data: {},
    }
  }
};
export default App
