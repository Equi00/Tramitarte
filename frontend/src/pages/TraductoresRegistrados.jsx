import {
  Box,
  Center,
  Image,
  Flex,
  IconButton,
  Text,
  Wrap,
  WrapItem,
  VStack,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBack, Send } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import usuarioService from "../services/UsuarioService";
import CardAviso from "../components/CardAviso";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { useAuth0 } from "@auth0/auth0-react";
import ModalError from "../components/ModalError";
import ModalAdvertencia from "../components/ModalAdvertencia";
import tramiteService from "../services/TramiteService";

function TraductoresRegistrados() {
  const navigate = useNavigate();
  const [estaModalAbierto, setEstaModalAbierto] = useState(false);
  const [traductorGuardado, setTraductorGuardado] = useState()
  const [traductores, setTraductores] = useState([]) 
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();
  const { isOpen: isOpenWarning, onOpen: onOpenWarning, onClose: onCloseWarning } = useDisclosure();
  const { idUsuario } = useParams();
  const {user}=useAuth0()

  const handleBack = () => {
    navigate(-1);
  };

  const abrirModal = async (traductorEnganchado) => {
    // Almacena temporalmente el traductor guardado.
    const traductorTemp = traductorEnganchado;
    setTraductorGuardado(traductorTemp);
    try {
      let tramite = await tramiteService.buscarPorUsuario(idUsuario)
      console.log(tramite)
      const solicitudes = await usuarioService.buscarSolicitudTraduccionSolicitante(idUsuario, traductorTemp.id);
      const solicitudDeSolicitante = await usuarioService.buscarSolicitudPorSolicitante(idUsuario)
      if(tramite.data !== ""){
        if(tramite && (tramite.data.etapa.descripcion === "Cargar documentación traducida" || tramite.data.etapa.descripcion === "Ha terminado el tramite, haga click para descargar los archivos")){
          if (solicitudes && solicitudes.length > 0) {
            onOpenError();
          } else if(solicitudDeSolicitante) {
            onOpenWarning(true);
          }else{
            setEstaModalAbierto(true);
          }
        }else{
          onOpenError2()
        }
      }else{
        onOpenError2()
      }
    } catch (error) {
      navigate("/network-error");
    }
  };


  const cerrarModal = () => {
    setEstaModalAbierto(false);
  };

  const traduct = async () =>{
    try{
      let traductoresRegistrados = await usuarioService.traerTraductores()
      setTraductores(traductoresRegistrados)
    }catch(e){
      navigate("/network-error");
    }
  }

  const eliminarAnteriorSolicitud = async () => {
    await usuarioService.eliminarSolicitudTraduccionPorSolicitante(idUsuario)
    enviarNotificacionTraductor()
    onCloseWarning()
  }

  const enviarNotificacionTraductor = async () => {
    try {
      console.log(idUsuario)
      console.log(traductorGuardado.id)
      let usuario = await usuarioService.traerPorId(idUsuario)
      console.log(usuario)
      await usuarioService.enviarNotificacion(idUsuario, traductorGuardado.id, "El usuario " + usuario.nombre + " requiere de sus servicios");
    } catch (e) {
      console.log(e)
      navigate("/network-error");
    }
    cerrarModal();
  };

  const traductoresBuscados = async (mail) =>{
    try{
      let traductoresRegistrados = await usuarioService.buscarTraductores(mail)
      setTraductores(traductoresRegistrados)
    }catch(e){
      navigate("/network-error");
    }
  }

  useEffect(() => {
    traduct()
  }, [])

  return (
    <Box minH="100%" bg="teal.200">
      <Flex
        p=".8rem"
        justifyContent="space-between"
        alignItems="center"
        gap="2%"
      >
        <IconButton
          onClick={() => handleBack()}
          borderRadius="45px"
          color="blue.900"
          bg="white"
          icon={<ArrowBack />}
        />
        <SearchBar funcion={traductoresBuscados}/>
      </Flex>
      <Wrap
        spacing={"1.2rem"}
        bg="teal.200"
        p="1.4rem"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {traductores.length === 0 ? <CardAviso text={"No hay Traductores disponibles"}/> :
        traductores.map((traductor, index) => (
          <WrapItem
            w="sm"
            borderRadius="45px"
            bg="whiteAlpha.800"
            key={index}
            border="2px solid"
            borderColor="blue.900"
          >
            <Center flexBasis="30%">
              <Image
                borderLeftRadius="43px"
                boxSize="40%"
                w="100%"
                objectFit={"contain"}
                src={traductor.fotoPerfil}
              />
            </Center>
            <Center h="100%" flexBasis="50%">
              <VStack alignItems="center" justifyContent="center">
                <Text textAlign="center" fontSize={12.5} fontWeight={700}>{traductor.nombre}</Text>
                <Text fontWeight={700}>{traductor.apellido}</Text>
              </VStack>
            </Center>
            <Flex justifyContent="flex-end" h="100%" w="20%" flexBasis="30%">
              <IconButton
                color="white"
                bg="teal.400"
                h="100%"
                w="100%"
                borderRightRadius="43px"
                borderLeftRadius="0"
                onClick={() => abrirModal(traductor)}
                icon={<Send />}
              />
            </Flex>
          </WrapItem>
        ))}
      </Wrap>
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={traductorGuardado && "¿Estás seguro de pedir los servicios del traductor "+traductorGuardado.nombre+"?"}
              isOpen={estaModalAbierto}
              handleConfirmacion={enviarNotificacionTraductor}
              onClose={cerrarModal}
            />
      <ModalError
        pregunta={traductorGuardado && "Ya envio una solicitud al traductor "+traductorGuardado.nombre}
        datoAConfirmar={
          "Por favor espere a que la solicitud sea aceptada o puede pedir el servicio a otro traductor"
        }
        isOpen={isOpenError}
        onClose={onCloseError}
      />
      <ModalError
        pregunta={"Todavía no tiene permitido pedir un servicio de traducción"}
        datoAConfirmar={
          "Por favor cargue todos los certificados antes de enviar una solicitud de traducción"
        }
        isOpen={isOpenError2}
        onClose={onCloseError2}
      />
      <ModalAdvertencia
        id="modal-confirmacion"
        pregunta={"¡ATENCIÓN!"}
        datoAConfirmar={traductorGuardado && 
          "Usted ya envio una solicitud de traducción a otro traductor ¿Está seguro de enviar una solicitud a "+traductorGuardado.nombre+"?"}
        segundoParrafo={"En caso de aceptar, su anterior solicitud se eliminara"}
        isOpen={isOpenWarning}
        handleConfirmacion={eliminarAnteriorSolicitud}
        onClose={onCloseWarning}
      />
      
    </Box>
  );
}

export default TraductoresRegistrados;
