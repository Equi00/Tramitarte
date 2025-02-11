import { ChakraProvider } from "@chakra-ui/react";
import { RouterApp } from "./router/routes";
import { createContext, useState } from "react";

export const TramiteContext = createContext();
export const UsuarioLogueadoContext = createContext();

function App() {
  const [tramite, setTramite] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  return (
    <UsuarioLogueadoContext.Provider value={usuarioLogueado}>
      <TramiteContext.Provider value={tramite}>
        <ChakraProvider>
          <RouterApp setTramiteContext={setTramite} setUsuarioLogueadoContext={setUsuarioLogueado} />
        </ChakraProvider>
      </TramiteContext.Provider>
    </UsuarioLogueadoContext.Provider>
  );
}

export default App;
