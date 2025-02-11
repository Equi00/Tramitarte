import { useAuth0 } from "@auth0/auth0-react";
import { Center, Heading } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import usuarioService from "../services/UsuarioService";
import { UsuarioLogueadoContext } from "../App";

export default function VerifyEmailForm({ setUsuarioLogueadoContext }) {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  console.log(JSON.stringify(user));

  const navegarToHome = () => {
    !isLoading &&
      usuarioService
        .traerUsuarioXMail(user.email)
        .then((response) => {
          let { data } = response;
          let usuario = data;
          setUsuarioLogueadoContext(usuario);
          navigate(`/home/${usuario.rol.toLowerCase()}/${usuario.id}`, {
            replace: true,
          });
        })
        .catch((error) => navigate("/eleccion-rol", { replace: true }));
  };

  const navegar = () => {
    console.log(isLoading);
    !isLoading && navegarToHome();
  };

  useEffect(() => {
    navegar();
  }, [user]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"sm"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Verifica tu Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          Te enviamos la verificacion a tu email! Aceptá para poder continuar ;)
        </Center>
        <FormControl></FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={loginWithRedirect}
          >
            Ya lo verifiqué ;)
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
