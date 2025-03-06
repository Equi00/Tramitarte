import { Box, Center, Button, useDisclosure } from "@chakra-ui/react";
import AnimatedLogo from "../components/AnimatedLogo/AnimatedLogo";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ModalIsLoading from "../components/modals/ModalIsLoading";
import { useNavigate } from "react-router";
import { useState, useCallback } from "react";
import userService from "../services/UserService";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function RoleElection({ setLoggedUserContext }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { user, isAuthenticated } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false);

  const handleClick = (e) => {
    console.log(e.target.innerText);
    setRole(e.target.innerText);
    onOpen();
  };

  const handleConfirmation = useCallback(async (chosenRole) => {
    setIsLoading(true);
    console.log(chosenRole);
    let newUser = {
      username: user.nickname || "Sin username",
      name: user.name || "Sin nombre",
      surname: user.family_name || "Sin apellido",
      role: chosenRole,
      email: user.email,
      birthdate: user.birthdate 
      ? new Date(user.birthdate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
      need_traduction: true,
      photo: user.picture,
    };
    try {
      const response = await userService
        .saveUser(newUser);
        setIsLoading(false);
      let { data: data_2 } = response;
      let persistedUser = data_2;
      setLoggedUserContext(persistedUser);
      window.localStorage.setItem('loggedUser', JSON.stringify(persistedUser));
      navigate(`/home/${chosenRole.toLowerCase()}/${persistedUser.id}`, {
        replace: true,
      });
      return response;
    } catch (error) {
      return navigate("/network-error");
    }
  }, []);

  useEffect(() => {
    userService
      .getUserByEmail(user.email)
      .then((response) => {
        if (response) {
          let { data: data_2 } = response;
          let persistedUser = data_2;
          setLoggedUserContext(persistedUser);
          window.localStorage.setItem("loggedUser", JSON.stringify(persistedUser));
          navigate(`/home/${persistedUser.role.toLowerCase()}/${persistedUser.id}`, {
            replace: true,
          });
        } else {
          setShow(true);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("User not found:", error.response.data.detail);
          setShow(true);
        } else {
          console.error("User not found:", error);
        }
      });
  }, []);
  

  return (
    <>
      {show ? (
        <Box minH="100%" bg="teal.200">
        <Center
          gap="2.4rem"
          flexWrap="wrap"
          justifyContent="space-around"
          alignItems="center"
          spacing="3.6rem"
          bg="teal.200"
          p="2.4rem"
        >
          <Box w="sm">
            <Button
              onClick={(e) => handleClick(e)}
              borderRadius="45px"
              color="white"
              w="100%"
              bg="blue.900"
            >
              {"REQUESTER"}
            </Button>
          </Box>
          <Box w="sm">
            <Button
              onClick={(e) => handleClick(e)}
              borderRadius="45px"
              color="white"
              w="100%"
              bg="teal.500"
            >
              {"TRANSLATOR"}
            </Button>
          </Box>
        </Center>
        <Center>
          <Box maxW="sm">
            <AnimatedLogo />
          </Box>
        </Center>
        <ConfirmationModal
          question={`Are you sure you want to register as ${role}?`}
          dataToConfirm={""}
          isOpen={isOpen}
          handleConfirmation={() => handleConfirmation(role)}
          onClose={onClose}
        />
        <ModalIsLoading
          message={"Please wait while we save your data... ;)"}
          isOpen={isLoading}
        />
      </Box>
      ):(
        <ModalIsLoading/>
      )}
    </>
  );
}

export default RoleElection;
