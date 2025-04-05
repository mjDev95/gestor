import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';

import Router from "./router";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalProvider>
          <Router/>
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
