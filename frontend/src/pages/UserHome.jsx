import { Box, Flex } from "@chakra-ui/react";
import UserNavbar from "../components/UserNavbar";
import { Outlet } from "react-router";
import { UsuarioLogueadoContext } from "../App";
import { useContext } from "react";

function UserHome() {
  const usuarioLogueadoContext = useContext(UsuarioLogueadoContext);
  return (
    <Box minH="100%" bg="teal.200">
      <UserNavbar usuarioLogueado={usuarioLogueadoContext} />
      <Flex bg="teal.200" p={{ base: "0.8rem", md: "1.4rem"}} justifyContent={"center"}>
        <Outlet />
      </Flex>
    </Box>
  );
}

export default UserHome;
