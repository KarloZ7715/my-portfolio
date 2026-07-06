import { HashRouter, Route, Routes } from "react-router";
import { LangProvider } from "./os/i18n";
import { OSProvider } from "./os/OSContext";
import { ThemeProvider } from "./os/ThemeContext";
import { MusicProvider } from "./notifications/MusicContext";
import { Desktop } from "./desktop/Desktop";

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <MusicProvider>
          <OSProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Desktop />} />
                <Route path="/app/:appId" element={<Desktop />} />
                <Route path="*" element={<Desktop />} />
              </Routes>
            </HashRouter>
          </OSProvider>
        </MusicProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
