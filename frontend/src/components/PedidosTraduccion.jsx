import { Container } from "@chakra-ui/react"

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
} from "@chakra-ui/react";
import { ArrowBack, Send } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import usuarioService from "../services/UsuarioService";
import CardAviso from "../components/CardAviso";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth0 } from "@auth0/auth0-react";

function PedidosTraduccion() {
  const navigate = useNavigate();
  const [estaConfirmacionAbierto, setEstaConfirmacionAbierto] = useState(false);
  const [estaCancelarAbierto, setEstaCancelarAbierto] = useState(false);
  const [solicitudGuardada, setSolicitudGuardada] = useState()
  const [solicitudes, setSolicitudes] = useState([]) 
  const { idUsuario } = useParams();
  const {user}=useAuth0()

  const handleBack = () => {
    navigate(-1);
  };

  const abrirModalConfirmacion = (solicitanteEnganchado) => {
    setSolicitudGuardada(solicitanteEnganchado)
    setEstaConfirmacionAbierto(true);
  };

  const cerrarModalConfirmacion = () => {
    setEstaConfirmacionAbierto(false);
  };

  const abrirModalCancelar = (solicitanteEnganchado) => {
    setSolicitudGuardada(solicitanteEnganchado)
    setEstaCancelarAbierto(true);
  };

  const cerrarModalCancelar = () => {
    setEstaCancelarAbierto(false);
  };

  const soli = async () =>{
    let solicitudEntrante = await usuarioService.buscarSolicitudTraduccion(idUsuario)
    setSolicitudes(solicitudEntrante)
  }

  const enviarNotificacionAceptar = async () => {
    let usuario = await usuarioService.traerPorId(idUsuario)
    await usuarioService.crearPedidoTraduccion(solicitudGuardada.solicitante.id, idUsuario)
    await usuarioService.enviarAlerta(idUsuario, solicitudGuardada.solicitante.id, "El traductor "+usuario.nombre+" ha aceptado su solicitud")
    await usuarioService.eliminarSolicitudTraduccion(solicitudGuardada.id)
    cerrarModalConfirmacion()
  }

  const enviarNotificacionCancelar = async () => {
    let usuario = await usuarioService.traerPorId(idUsuario)
    await usuarioService.eliminarSolicitudTraduccion(solicitudGuardada.id)
    await usuarioService.enviarAlerta(idUsuario, solicitudGuardada.solicitante.id, "El traductor "+usuario.nombre+" ha rechazado su solicitud")
    cerrarModalCancelar()
  }

  useEffect(() => {
    soli()
  }, [solicitudes])

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
      </Flex>
      <Wrap
        spacing={"1.2rem"}
        bg="teal.200"
        p="1.4rem"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {solicitudes.length === 0 ? <CardAviso text={"No hay solicitudes de traducción"}/> :
        solicitudes.map((solicitud, index) => (
          <WrapItem
            w="sm"
            borderRadius="45px"
            bg="whiteAlpha.800"
            key={index}
            border="2px solid"
            borderColor="blue.900"
          >
            <Flex justifyContent="flex-end" h="100%" w="20%" flexBasis="30%">
              <IconButton
                color="white"
                bg="teal.400"
                h="100%"
                w="100%"
                borderLeftRadius="43px"
                borderRightRadius="0"
                onClick={() => abrirModalConfirmacion(solicitud)}
                icon={<CheckIcon />}
              />
            </Flex>
            <Center h="100%" flexBasis="50%">
              <VStack alignItems="center" justifyContent="center">
                <Heading textAlign="center" fontSize={15}>{solicitud.solicitante.nombre}</Heading>
                <Text>{"Pide sus servicios"}</Text>
              </VStack>
            </Center>
            <Flex justifyContent="flex-end" h="100%" w="20%" flexBasis="30%">
              <IconButton
                color="white"
                bg="red.500"
                h="100%"
                w="100%"
                borderRightRadius="43px"
                borderLeftRadius="0"
                onClick={() => abrirModalCancelar(solicitud)}
                icon={<CloseIcon />}
              />
            </Flex>
          </WrapItem>
        ))}
      </Wrap>
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={solicitudGuardada && "¿Estás seguro de aceptar el pedido de "+solicitudGuardada.solicitante.nombre+"?"}
              isOpen={estaConfirmacionAbierto}
              handleConfirmacion={enviarNotificacionAceptar}
              onClose={cerrarModalConfirmacion}
      />
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={solicitudGuardada && "¿Estás seguro de rechazar el pedido de "+solicitudGuardada.solicitante.nombre+"?"}
              isOpen={estaCancelarAbierto}
              handleConfirmacion={enviarNotificacionCancelar}
              onClose={cerrarModalCancelar}
      />
            
    </Box>
  );
}

export default PedidosTraduccion;
