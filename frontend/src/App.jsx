import { ChakraProvider } from "@chakra-ui/react";
import { RouterApp } from "./router/routes";
import { createContext, useState } from "react";

export const ProcessContext = createContext();
export const LoggedUserContext = createContext();

function App() {
  const [process, setProcess] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  return (
    <LoggedUserContext.Provider value={loggedUser}>
      <ProcessContext.Provider value={process}>
        <ChakraProvider>
          <RouterApp setProcessContext={setProcess} setLoggedUserContext={setLoggedUser} />
        </ChakraProvider>
      </ProcessContext.Provider>
    </LoggedUserContext.Provider>
  );
}

export default App;
