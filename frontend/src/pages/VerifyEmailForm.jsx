import { useAuth0 } from "@auth0/auth0-react";
import { Center, Heading } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import userService from "../services/UserService";

export default function VerifyEmailForm({ setLoggedUserContext }) {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  console.log(JSON.stringify(user));

  const navigateToHome = () => {
    !isLoading &&
    userService
        .getUserByEmail(user.email)
        .then((response) => {
          let { data } = response;
          let user = data;
          setLoggedUserContext(user);
          navigate(`/home/${user.rol.toLowerCase()}/${user.id}`, {
            replace: true,
          });
        })
        .catch((error) => navigate("/role-election", { replace: true }));
  };

  const goNavigate = () => {
    console.log(isLoading);
    !isLoading && navigateToHome();
  };

  useEffect(() => {
    goNavigate();
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
          Verify your email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          We sent you the verification to your email! Accept to continue ;)
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
            I already checked it ;)
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
