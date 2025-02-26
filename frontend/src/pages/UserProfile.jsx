import { useAuth0 } from "@auth0/auth0-react";
import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Button,
  VStack,
  Avatar,
  IconButton,
  Center,
  Heading,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { AccountCircle, ArrowBack, Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import userService from "../services/UserService";

function UserProfile() {
  const [edit,setEdit]= useState(false)
  const [editNickname,setEditNickname]= useState("")
  const [editName, setEditName]=useState("")
  const [editSurname, setEditSurname]=useState("")
  const [userData, setUserData] = useState()
  const { userId } = useParams();
  
  const {user}=useAuth0()
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = async () => {
      let body={
        "username":editNickname,
        "surname":editSurname,
        "name":editName
      }
      if(body.username === ""){
        body.username = userData.username
      }
      if(body.surname === ""){
        body.surname = userData.surname
      }
      if(body.name === ""){
        body.name = userData.name
      }
      let updatedUser = await userService.updateUserData(userId, body)
      setEditNickname(updatedUser.username);
      setEditName(updatedUser.name);
      setEditSurname(updatedUser.surname)
      setUserData(updatedUser)
      setEdit(false);
};

  const handleCancel = () => {
    setEdit(false);
  };
 
  const fetchDataUser = async () => {
    try{ 
         let userData=await userService.getById(userId);
         console.log(userData)
          setUserData(userData)
          setEditSurname(userData.surname)
          setEditNickname(userData.username)
          setEditName(userData.name)
  } catch (error) {
      console.error('Error getting user data:', error);
    }
}

useEffect(() => {
  fetchDataUser();
}, []); 


  return (
    <Box minH="100%" h="100%" p="3%" bg="teal.200">
      <Flex minH="100%" bg="whiteAlpha.700" borderRadius="20px">
        <VStack w="100%">
          <Flex w="100%" p=".8rem" justify="space-between">
            <IconButton
              onClick={() => handleBack()}
              color="black"
              bg="white"
              borderRadius="50%"
              size="lg"
              icon={<ArrowBack />}
            />
            <IconButton
              onClick={() => handleEdit() }
              color="blue.900"
              borderRadius="50%"
              size="lg"
              icon={<Edit />}
            />
          </Flex>
          <Flex py="2%" w="90%" justifyContent="space-evenly" flexWrap="wrap">
            <Avatar
              size="2xl"
              name="Segun Adebayo"
              src={userData?.photo}
            />
            <Center>
             <Heading size="xl"  style={{ fontSize:'14px' }} padding={"1rem"} color="blue.900">
              <Heading size="md">Username:</Heading>
               {edit? (
                <input 
                   type="text"
                   value={editNickname}
                   placeholder="Enter your new nickname"
                   onChange={(e) => setEditNickname(e.target.value)}
                   style={{
                    background: 'white',
                    borderRadius:"5px",
                    minHeight: "100%",
                    minWidth: "100%",
                    color: 'black',
                    fontSize: "14px"
                  }}
                 />
                  ) : (
                    <Heading size="md">{userData?.username} </Heading>
               )}
              </Heading>
            </Center>
          </Flex>
          <Wrap py="5%" color="blue.900" justifyContent="center">
            <WrapItem p="2.4rem" w="sm" display={"grid"}>
              <Box justifyContent="center" marginRight="2.4rem">
                <AccountCircle size="lg" />
              </Box>
              <Heading size="xl"  style={{ fontSize:'14px' }} padding={"1rem"}>
                <Heading size="md">Name:</Heading>
               {edit? (
                <input 
                   type="text"
                   value={editName}
                   placeholder="Enter your name"
                   onChange={(e) => setEditName(e.target.value)}
                   style={{
                    background: 'white',
                    borderRadius:"5px",
                    minHeight: "100%",
                    minWidth: "100%",
                    color: 'black',
                    fontSize: "14px"
                  }}
                 />
                  ) : (
                    <Heading size="md">{userData?.name} </Heading>
               )}
              </Heading>
              <Heading size="xl"  style={{ fontSize:'14px' }} padding={"1rem"}>
                <Heading size="md">Surname:</Heading>
               {edit? (
                <input 
                   type="text"
                   value={editSurname}
                   placeholder="Enter your surname"
                   onChange={(e) => setEditSurname(e.target.value)}
                   style={{
                    background: 'white',
                    borderRadius:"5px",
                    minHeight: "100%",
                    minWidth: "100%",
                    color: 'black',
                    fontSize: "14px"
                  }}
                 />
                  ) : (
                    <Heading size="md">{userData?.surname} </Heading>
               )}
              </Heading>
            </WrapItem>
              <WrapItem p="2.4rem" w="sm" flexDir={"column"}>
                <Heading size="md">Birthdate:</Heading>
                <Box>
                  <Box justifyContent="center" marginRight="2.4rem">
                    <CalendarIcon />
                  </Box>
                  <Heading size="md">{userData?.birthdate}</Heading>
                </Box>
              </WrapItem>
          </Wrap>
          {edit? ( <><Flex  w="90%" justifyContent="space-around" >
            <Button
              onClick={() => handleSave()}
              borderRadius="45px"
              color="white"
              w="40%"
              bg="blue.900"
            >
              {"Save"}
            </Button>
              <Button
              onClick={() => handleCancel()}
              borderRadius="45px"
              color="white"
              w="40%"
              bg="teal.500"
                        >
              {"Cancel"}
            </Button></Flex></>):<></>}
        </VStack>
      </Flex>
    </Box>
  );
}

export default UserProfile;
