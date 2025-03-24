import { ThemeProvider } from "./theme/ThemeProvider";
import Router from "./router";

const App = () => {
  return (
    <ThemeProvider>
      <Router/>
    </ThemeProvider>
  );
};

export default App;
