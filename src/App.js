import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalState';
import { BrowserRouter } from "react-router-dom";
import { MonthProvider } from "./context/monthContext";
import { ModalProvider } from "./context/ModalContext";
import GlobalModal from "./components/modals/GlobalModal";
import { PerfilProvider } from "./context/PerfilContext";
import Configuracion from "./components/configuracion";
import ErrorBoundary from "./components/ErrorBoundary";

import Router from "./router";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MonthProvider>
            <PerfilProvider>
              <GlobalProvider>
                <BrowserRouter>
                  <ModalProvider>
                    <Router />
                    <GlobalModal />
                    <Configuracion />
                  </ModalProvider>
                </BrowserRouter>
              </GlobalProvider>
            </PerfilProvider>
          </MonthProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
