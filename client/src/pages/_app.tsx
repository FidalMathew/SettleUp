import Provider from "@/components/Provider";
import "@/styles/globals.css";
import type {AppProps} from "next/app";

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </Provider>
  );
}
