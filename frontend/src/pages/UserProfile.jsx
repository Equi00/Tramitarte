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
import { AccountCircle, Close, Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import usuarioService from "../services/UsuarioService";

function UserProfile() {
  const [edit,setEdit]= useState(false)
  const [editNickname,setEditNickname]= useState("")
  const [editNombre, setEditNombre]=useState("")
  const [editApellido, setEditApellido]=useState("")
  const [userData, setUserData] = useState()
  const { idUsuario } = useParams();
  
  const {user}=useAuth0()
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = async () => {
      let body={
        "username":editNickname,
        "apellido":editApellido,
        "nombre":editNombre
      }
      if(body.username === ""){
        body.username = userData.username
      }
      if(body.apellido === ""){
        body.apellido = userData.apellido
      }
      if(body.nombre === ""){
        body.nombre = userData.nombre
      }
      let usuarioActualizado = await usuarioService.actualizarDataUsuario(idUsuario,body)
      setEditNickname(usuarioActualizado.username);
      setEditNombre(usuarioActualizado.nombre);
      setEditApellido(usuarioActualizado.apellido)
      setUserData(usuarioActualizado)
      setEdit(false);
};

  const handleCancel = () => {
    setEdit(false);
  };
 
  const fetchDataUser = async () => {
    try{ 
         let datosUsuario=await usuarioService.traerPorId(idUsuario);
         console.log(datosUsuario)
          setUserData(datosUsuario)
          setEditApellido(datosUsuario.apellido)
          setEditNickname(datosUsuario.username)
          setEditNombre(datosUsuario.nombre)
  } catch (error) {
      console.error('Error al obtener datos del Usuario:', error);
    }
}

useEffect(() => {
  fetchDataUser();
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
              src={userData?.fotoPerfil}
            />
            <Center>
             <Heading size="xl"  style={{ fontSize:'14px' }}>
               {edit? (
                <input 
                   type="text"
                   value={editNickname}
                   placeholder="ingrese su nuevo Nickname"
                   onChange={(e) => setEditNickname(e.target.value)}
                   style={{
                    background: 'transparent',
                    borderRadius:"5px",
                    color: 'white',
                    minWidth:'195px'
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
              <Heading size="xl"  style={{ fontSize:'14px' }}>
               {edit? (
                <input 
                   type="text"
                   value={editNombre}
                   placeholder="ingrese su nombre"
                   onChange={(e) => setEditNombre(e.target.value)}
                   style={{
                    background: 'transparent',
                    borderRadius:"5px",
                    color: 'white',
                    minWidth:'195px'
                  }}
                 />
                  ) : (
                    <Heading size="md">{userData?.nombre} </Heading>
               )}
              </Heading>
              <Heading size="xl"  style={{ fontSize:'14px' }}>
               {edit? (
                <input 
                   type="text"
                   value={editApellido}
                   placeholder="ingrese su apellido"
                   onChange={(e) => setEditApellido(e.target.value)}
                   style={{
                    background: 'transparent',
                    borderRadius:"5px",
                    color: 'white',
                    minWidth:'195px'
                  }}
                 />
                  ) : (
                    <Heading size="md">{userData?.apellido} </Heading>
               )}
              </Heading>
            </WrapItem>
            <WrapItem p="2.4rem" w="sm">
              <Box justifyContent="center" marginRight="2.4rem">
                <CalendarIcon />
              </Box>
              <Heading size="md">{userData?.fechaDeNacimiento}</Heading>
            </WrapItem>
          </Wrap>
                    {edit? ( <><Flex  w="90%" justifyContent="space-around" >
                      <Button
            onClick={() => handleSave()}
            borderRadius="45px"
            color="white"
            w="40%"
            bg="blue.900"
            py="2%"
          >
            {"Guardar"}
          </Button>
             <Button
             onClick={() => handleCancel()}
             borderRadius="45px"
             color="white"
             w="40%"
             bg="teal.500"
                       >
             {"Cancelar"}
           </Button></Flex></>):<></>}
        </VStack>
      </Flex>
      {/* <Circle zIndex="-1" size="40px" bg="teal.200" /> */}
    </Box>
  );
}

export default UserProfile;
