import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import Layout from '../components/Layout/Layout';
import { GlobalStyle } from '../components/Styles/Global';
import defaultTheme from '../modules/theme/default';
import { config } from '@fortawesome/fontawesome-svg-core';
import '../styles/fonts.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

function App({ Component, pageProps }: AppProps) {
   return (
      <>
         <ThemeProvider theme={defaultTheme}>
            <GlobalStyle />
            <Layout>
               <Component {...pageProps} />
            </Layout>
         </ThemeProvider>
      </>
   );
}

export default App;
