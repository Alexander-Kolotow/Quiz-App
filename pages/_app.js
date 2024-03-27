import GlobalStyle from "../styles.ts";
import { SWRConfig } from 'swr'

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig  value={{
      fallback: {
        '/api/quizzes': { name: 'Loading...' } 
      }
    }}
    >
      <GlobalStyle />
      <Component {...pageProps} />
    </SWRConfig>
  );
}
