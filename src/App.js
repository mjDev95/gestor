import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalState';
import { BrowserRouter } from "react-router-dom";
import { MonthProvider } from "./context/monthContext";

import Router from "./router";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MonthProvider>
          <GlobalProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </GlobalProvider>
        </MonthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
