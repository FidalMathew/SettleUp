import Provider from "@/components/Provider";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {PrivyProvider} from "@privy-io/react-auth";
import ContractFunctionContextProvider from "@/Context/ContractContext";
import AIContextProvider from "@/Context/AIContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function App({Component, pageProps}: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          createOnLogin: "off",
        },
      }}
      onSuccess={() => router.push("/dashboard")}
    >
      <AIContextProvider>
        <ContractFunctionContextProvider>
          <Provider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Component {...pageProps} />
          </Provider>
        </ContractFunctionContextProvider>
      </AIContextProvider>
    </PrivyProvider>
  );
}
