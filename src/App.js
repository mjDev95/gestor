import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalState';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Router from "./router";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
