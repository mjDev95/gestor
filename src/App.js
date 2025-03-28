import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from './context/AuthContext';
import Router from "./router";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router/>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
