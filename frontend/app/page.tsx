import App from "@/components/App";
import { GeneralContextProvider } from "@/context/GeneralContext";
export default function Home() {
  return (
    <GeneralContextProvider>
      <App />
    </GeneralContextProvider>
  );
}
