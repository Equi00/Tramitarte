import { CalendarIcon } from "@chakra-ui/icons";
import tramiteService from "../services/TramiteService";
import {
  Box,
  Flex,
  VStack,
  Avatar,
  IconButton,
  Center,
  Heading,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { AccountCircle, Close, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {useState,useEffect} from "react"


function AvoProfile() {
  const navigate = useNavigate();
  const [avoData, setAvoData] = useState() 
  const [avatar, setAvatar]=useState()

  const handleBack = () => navigate(-1);
    const fetchData = async () => {
      try{ 
          const avoData=await tramiteService.getAVOData(JSON.parse(window.localStorage.getItem('loggedUser')).id);
          setAvoData(avoData)
          if(avoData.gender === "Male"){setAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTujnrocNopBoCYAhK3G50mc6qYWSV4c8h6Gg&usqp=CAU")}
          else{setAvatar("https://img.freepik.com/vector-gratis/plantilla-etiqueta-cara-icono-emoji-anciana_1308-58444.jpg?w=2000")}
    } catch (error) {
        console.error('Error getting data from avo:', error);
      }
  }

  useEffect(() => {
    fetchData();
  }, []); 
  
  return (
    <Box minH="100%" h="100%" p="3%" bg="blue.800">
      <Flex minH="100%" bg="whiteAlpha.700" borderRadius="20px">
        <VStack w="100%">
          <Flex w="100%" p=".8rem" justify="space-between">
            <IconButton
              onClick={() => handleBack()}
              color="white"
              bg="blue.900"
              borderRadius="50%"
              size="lg"
              icon={<Close />}
            />
         
          </Flex>
          <Flex py="2%" w="90%" justifyContent="space-around">
            <Avatar
              size="2xl"
              name="Segun Adebayo"
              src={avatar}
            />
            <Center>
              <Heading color="blue.900" as="h1" size="xl" paddingLeft={"15px"}>
                {avoData?.first_name} {avoData?.last_name} 
              </Heading>
            </Center>
          </Flex>
          <Wrap py="5%" color="blue.900" justifyContent="center">
            <WrapItem p="2.4rem" w="sm">
              <Box justifyContent="center" marginRight="2.4rem">
                <AccountCircle size="lg" />
              </Box>
              <Heading size="md"> {avoData?.gender}  </Heading>
            </WrapItem>
            <WrapItem p="2.4rem" w="sm">
              <Box justifyContent="center" marginRight="2.4rem">
                <CalendarIcon />
              </Box>
              <Heading size="md">{avoData?.birth_date}</Heading>
            </WrapItem>
          </Wrap>
          
        </VStack>
      </Flex>
      {/* <Circle zIndex="-1" size="40px" bg="teal.200" /> */}
    </Box>
  );
}

export default AvoProfile;
