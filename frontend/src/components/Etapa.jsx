import {
  CircularProgress,
  CircularProgressLabel,
  Card,
  CardBody,
  CardHeader,
  Heading,
  CardFooter,
  Button,
  IconButton,
  HStack,
  Box,
  useDisclosure,
  Text,
  Flex,
  Input,
} from "@chakra-ui/react";

import { Delete } from "@mui/icons-material";
import banderaItailiana from "../assets/baneraItaliana.png";
import { useNavigate, useParams } from "react-router";
import tramiteService from "../services/TramiteService";
import { useState, useCallback, useEffect } from "react";
import ModalConfirmacion from "./ConfirmationModal";
import ModalIsLoading from "./ModalIsLoading";
import CardAviso from "./CardAviso";
import usuarioService from "../services/UsuarioService";
import { saveAs } from "file-saver";
import JSZip from "jszip";
var zip = require("jszip")()

const BanderaItaliana = ({ height }) => (
  <Box zIndex={-1} position="" left={0} bottom={1} h={height}>
    <Box
      display="inline-block"
      borderRadius="10px 0 0 10px"
      w="33%"
      h="100%"
      bg="green.200"
    />
    <Box display="inline-block" w="33%" h="100%" bg="white" />
    <Box
      display="inline-block"
      borderRadius="0 10px 10px 0"
      w="33%"
      h="100%"
      bg="red.300"
    />
  </Box>
);

function Etapa({ tramite }) {
  const navigate = useNavigate();
  const { idUsuario } = useParams();
  const [estaCargando, setEstaCargando] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pedidos, setPedidos] = useState([])
  const [pedidoGuardado, setPedidoGuardado] = useState()
  const [estaEliminarAbierto, setEstaEliminarAbierto] = useState(false);
  const [estaAceptarAbierto, setEstaAceptarAbierto] = useState(false);
  const [estaDescargaAbierto, setEstaDescargaAbierto] = useState(false);

  const abrirModalDescarga = () => {
    setEstaDescargaAbierto(true);
  };

  const cerrarModalDescarga = () => {
    setEstaDescargaAbierto(false);
  };

  const abrirModalEnviar = (pedidoEnganchado) => {
    let pedido = pedidoEnganchado
    setPedidoGuardado(pedido)
    console.log("pedido enganchado: ",pedidoEnganchado)
    setEstaAceptarAbierto(true);
  };

  const cerrarModalEnviar = () => {
    setEstaAceptarAbierto(false);
  };

const abrirModalCancelar = (pedidoEnganchado) => {
    let pedido = pedidoEnganchado
    setPedidoGuardado(pedido)
    console.log("pedido enganchado: ",pedidoEnganchado)
    setEstaEliminarAbierto(true);
  };

  const cerrarModalCancelar = () => {
    setEstaEliminarAbierto(false);
  };

  const handleConfirmacion = useCallback(() => {
    setEstaCargando(true);
    return tramiteService
      .eliminar(tramite.id)
      .then((response) => {
        setEstaCargando(false);
        navigate(`/home/solicitante/${idUsuario}`, { replace: true });
        window.location.replace('')
        return response;
      })
      .catch((error) => navigate("/network-error"));
  }, []);

  const traerSolicitudDescarga = async () => {
    let solicitudDescarga = await usuarioService.buscarSolicitudDescargaPorSolicitante(idUsuario)
    setPedidos(solicitudDescarga)
  }

  const eliminarSolicitud = async () => {
    await usuarioService.eliminarSolicitudDescarga(pedidoGuardado.id)
    cerrarModalCancelar()
  }

  const descargarArchivos = async () => {
    const arrayArchivos = pedidoGuardado.documentacion;
    console.log(arrayArchivos)
    const zip = new JSZip();
  
    // Itera sobre los archivos en formato Base64 y agrégalos al ZIP
    arrayArchivos.forEach((archivo, index) => { // Agrega un índice
      const nombreArchivo = `${archivo.nombre.replace(/\s/g, '_')}_${index}.pdf`; // Añade el índice al nombre
      const base64Data = archivo.archivoBase64;
  
      // Decodifica el Base64 en un Blob
      const archivoBlob = base64ToBlob(base64Data);
  
      // Agrega el archivo al ZIP
      zip.file(nombreArchivo, archivoBlob);
    });
  
    // Genera el archivo ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Documentación-traducida.zip");
    });
    await usuarioService.eliminarSolicitudDescarga(pedidoGuardado.id)
    cerrarModalEnviar();
  };

  function base64ToBlob(base64Data) {
    const splitData = base64Data.split(",");
    const contentType = splitData[0].match(/:(.*?);/)[1];
    const byteCharacters = atob(splitData[1]);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  const descargarTodoSolicitante = async () => {
    setEstaCargando(true)
    let tramite = await tramiteService.buscarPorUsuario(idUsuario)
    const todasLasListas = tramite.data.documentacionUsuario.concat(
      tramite.data.documentacionAVO,
      tramite.data.documentacionDescendientes,
      tramite.data.documentacionTraducida
    );
    const arrayArchivos = todasLasListas;
    console.log(arrayArchivos)
    const zip = new JSZip();
  
    // Itera sobre los archivos en formato Base64 y agrégalos al ZIP
    arrayArchivos.forEach((archivo, index) => { // Agrega un índice
      let ultimoPunto = archivo.nombre.lastIndexOf(".");
      let extension = archivo.nombre.slice(ultimoPunto + 1);
      let nombreArchivo = ""
      if(extension === "jpg"){
        nombreArchivo = `${archivo.nombre.replace(/\s/g, '_')}_${index}.jpg`; // Añade el índice al nombre
      }else{
        nombreArchivo = `${archivo.nombre.replace(/\s/g, '_')}_${index}.pdf`; // Añade el índice al nombre
      }
      const base64Data = archivo.archivoBase64;
  
      // Decodifica el Base64 en un Blob
      const archivoBlob = base64ToBlob(base64Data);
  
      // Agrega el archivo al ZIP
      zip.file(nombreArchivo, archivoBlob);
    });
  
    // Genera el archivo ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Documentación-tramite.zip");
    });
    cerrarModalDescarga();
    setEstaCargando(false)
  }

  useEffect(() => {
    traerSolicitudDescarga()
  }, [pedidos])

  function elegirRuta(descripcionEtapa) {
    let basePath = `/home/solicitante/${idUsuario}`;
    let completePath;
    switch (descripcionEtapa.toUpperCase()) {
      case "CARGAR AVO":
        completePath = `${basePath}/solicitud-avo`;
        break;
      case "CARGAR DOCUMENTACION DE USUARIO":
        completePath = `${basePath}/documentacion-personal`;
        break;
      case "CARGAR DOCUMENTACIÓN DE AVO":
        completePath = `${basePath}/documentacion-avo`;
        break;
      case "CARGAR DOCUMENTACIÓN DE DESCENDIENTES":
        completePath = `${basePath}/documentacion-ascendentes`;
        break;
      case "CARGAR DOCUMENTACIÓN TRADUCIDA":
        completePath = `${basePath}/documentacion-traducida`;
        break;
    }
    return completePath;
  }

  function calcularPorcentaje(descripcionEtapa) {
    let porcentaje;
    switch (descripcionEtapa.toUpperCase()) {
      case "CARGAR AVO":
        porcentaje = "1";
        break;
      case "CARGAR DOCUMENTACION DE USUARIO":
        porcentaje = "20";
        break;
      case "CARGAR DOCUMENTACIÓN DE AVO":
        porcentaje = "55";
        break;
      case "CARGAR DOCUMENTACIÓN DE DESCENDIENTES":
        porcentaje = "70";
        break;
      case "CARGAR DOCUMENTACIÓN TRADUCIDA":
        porcentaje = "90";
        break;
      case "HA TERMINADO EL TRAMITE, HAGA CLICK PARA DESCARGAR LOS ARCHIVOS":
        porcentaje = "100";
        break;
    }
    return porcentaje;
  }

  return (
    <Box >
      <Card borderRadius="45px" bg="rgba(255, 255, 255, 0.8)" align="center">
        <CardHeader>
          <HStack spacing="2%">
            <Heading size="md">{tramite.codigo}</Heading>
            <IconButton
              aria-label="Borrar trámite"
              color="red.500"
              size="lg"
              icon={<Delete fontSize="large" />}
              onClick={onOpen}
            ></IconButton>
          </HStack>
        </CardHeader>
        <CardBody align="center">
          <CircularProgress
            capIsRound
            trackColor="blue.100"
            size="300px"
            value={calcularPorcentaje(tramite.etapa.descripcion)}
            color="blue.900"
            thickness="10%"
          >
            <CircularProgressLabel>
              {calcularPorcentaje(tramite.etapa.descripcion)}%
            </CircularProgressLabel>
          </CircularProgress>
        </CardBody>
        <CardFooter w="100%">
          <Button
            onClick={() => {tramite.etapa.descripcion === "Ha terminado el tramite, haga click para descargar los archivos" ? abrirModalDescarga() :
              navigate(elegirRuta(tramite.etapa.descripcion));
            }}
            textTransform="uppercase"
            borderRadius="45px"
            w={{ base: "100%", md: "md"}}
            color="white"
            bg="red.900"
            whiteSpace={'normal'}
          >
            {tramite.etapa.descripcion}
          </Button>
        </CardFooter>

        <ModalConfirmacion
          isOpen={isOpen}
          handleConfirmacion={() => handleConfirmacion()}
          pregunta={"¿Estás seguro de eliminar el trámite?"}
          datoAConfirmar={"Al borrarlo, no podrás recuperar sus datos"}
          onClose={onClose}
        />
        <ModalIsLoading estaCargando={estaCargando} />
      </Card>
      {pedidos.length === 0 ? <div></div> :
        pedidos.map((pedido, index) => (
      <Card
          borderRadius="45px"
          bg="rgba(255, 255, 255, 0.8)"
          align="center"
          key={index}
          h={"10rem"}
          marginTop={"1rem"}
        >
          <CardHeader>
            <Heading textAlign="center" size="md">{"Documentos listos para descargar"}</Heading>
          </CardHeader>
          <CardFooter w="20rem" justifyContent={"space-around"}>
          <Button
            borderRadius="45px"
            color="white"
            w="6rem"
            bg="green.400"
            onClick={() => abrirModalEnviar(pedido)}
          >
            {"Descargar"}
            
          </Button>
            <Button
              borderRadius="45px"
              color="white"
              w="6rem"
              bg="red.900"
              onClick={() => abrirModalCancelar(pedido)}
            >
              {"Eliminar"}
            </Button>
          </CardFooter>
        </Card>
        ))}
        <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={"¿Estás seguro de eliminar la entrega de documentos?"}
              isOpen={estaEliminarAbierto}
              handleConfirmacion={eliminarSolicitud}
              onClose={cerrarModalCancelar}
      />
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={"¿Estás seguro de descargar los documentos?"}
              isOpen={estaAceptarAbierto}
              handleConfirmacion={descargarArchivos} 
              onClose={cerrarModalEnviar}
      />
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={"¿Estás seguro de descargar los documentos?"}
              isOpen={estaDescargaAbierto}
              handleConfirmacion={descargarTodoSolicitante} 
              onClose={cerrarModalDescarga}
      />
    </Box>
  );
}

export default Etapa;
