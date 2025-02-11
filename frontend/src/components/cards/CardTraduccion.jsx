import {
    Card,
    Text,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Button,
    Flex,
    useDisclosure,
    Grid,
    HStack,
    IconButton,
    Input,
  } from "@chakra-ui/react";
  
  import ModalConfirmacion from "./ModalConfirmacion";
  import tramiteService from "../services/TramiteService";
  import { useNavigate, useParams } from "react-router";
  import { useState, useCallback, useEffect } from "react";
  import ModalIsLoading from "./ModalIsLoading";
import CardAviso from "./CardAviso";
import { Close, Delete } from "@mui/icons-material";
import usuarioService from "../services/UsuarioService";
import { useAuth0 } from "@auth0/auth0-react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
var zip = require("jszip")()
  
  function CardTraduccion() {
    const { idUsuario } = useParams();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([])
    const [pedidoGuardado, setPedidoGuardado] = useState()
    const [estaEliminarAbierto, setEstaEliminarAbierto] = useState(false);
    const [estaDescargarAbierto, setEstaDescargarAbierto] = useState(false);
    const {user}=useAuth0()
    const [files, setFiles] = useState([])
    
      const cerrarModalDescargar = () => {
        setEstaDescargarAbierto(false);
      };

      const abrirModalDescargar = (pedidoEnganchado) => {
        let pedido = pedidoEnganchado
        setPedidoGuardado(pedido)
        console.log("pedido enganchado: ",pedidoEnganchado.tramite.usuario.nombre)
        setEstaDescargarAbierto(true);
      };
    
    const abrirModalCancelar = (pedidoEnganchado) => {
        let pedido = pedidoEnganchado
        setPedidoGuardado(pedido)
        console.log("pedido enganchado: ",pedidoEnganchado.tramite.usuario.nombre)
        setEstaEliminarAbierto(true);
      };
    
      const cerrarModalCancelar = () => {
        setEstaEliminarAbierto(false);
      };

    const traerPedidos = async () => {
        try{
            let pedidosTraduccion = await usuarioService.buscarPedidoTraduccion(idUsuario)
            setPedidos(pedidosTraduccion)
        }catch(e){
            navigate("network-error")
        }
    }

    const enviarNotificacionCancelar = async () => {
        await usuarioService.eliminarPedidoTraduccion(pedidoGuardado.id)
        await usuarioService.enviarAlerta(idUsuario, pedidoGuardado.tramite.usuario.id, "El traductor "+user.name+" ha rechazado su pedido de traducción")
        cerrarModalCancelar()
      }

    const descargarArchivos = async () => {
      const arrayArchivos = pedidoGuardado.tramite.adjuntosATraducir;
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
        saveAs(content, "Documentación.zip");
      });
    
      cerrarModalDescargar();
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

    const cargarDocumento = (pedido) => {
      localStorage.setItem('idTraductor', JSON.stringify(idUsuario));
      localStorage.setItem('idSolicitante', JSON.stringify(pedido.tramite.usuario.id));
      localStorage.setItem('idPedido', JSON.stringify(pedido.id));
      navigate(`/carga`)
    }

    useEffect(() => {
        traerPedidos()
    }, [pedidos])
  
    return (
      <Grid py="1.2rem" justifyContent="center">
        {pedidos.length === 0 ? <CardAviso text={"No hay trabajos para traducción"}/> :
        pedidos.map((pedido, index) => (
        <Card
          key={index}
          borderRadius="45px"
          bg="rgba(255, 255, 255, 0.8)"
          align="center"
          p={"1rem"}
          w={"20rem"}
          marginBottom={"0.5rem"}
        >
            <HStack spacing="2%" justifyContent={"right"} width={"100%"}>
                <IconButton
                    aria-label="Borrar trámite"
                    color="red.500"
                    size="lg"
                    onClick={() => abrirModalCancelar(pedido)}
                    icon={<Delete fontSize="large" />}
                    
            ></IconButton>
            </HStack>
          <CardHeader>
            <Heading textAlign="center" size="md">{"Solicitud de traducción"}</Heading>
          </CardHeader>
          <CardBody align="center">
            <Text>{"Correo del solicitante: "}<Text fontWeight={700}>{pedido.tramite.usuario.nombre}</Text></Text>
            <Text>{"Adjuntos a traducir: "+pedido.tramite.adjuntosATraducir.length}</Text>
          </CardBody>
          <CardFooter w="20rem" justifyContent={"center"}>
            <Button
              borderRadius="45px"
              color="white"
              w="6rem"
              bg="green.400"
              onClick={() => cargarDocumento(pedido)}
            >
              {"Cargar"}
            </Button>
            <Button
              borderRadius="45px"
              color="white"
              w="6rem"
              bg="red.900"
              marginLeft={"10px"}
              onClick={() => abrirModalDescargar(pedido)}
            >
              {"Descargar"}
            </Button>
          </CardFooter>
        </Card>
        ))}
        <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={pedidoGuardado && "¿Estás seguro de rechazar el pedido de "+pedidoGuardado.tramite.usuario.nombre+"?"}
              isOpen={estaEliminarAbierto}
              handleConfirmacion={enviarNotificacionCancelar}
              onClose={cerrarModalCancelar}
      />
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={pedidoGuardado && "¿Estás seguro de descargar los documentos de "+pedidoGuardado.tramite.usuario.nombre+"?"}
              isOpen={estaDescargarAbierto}
              handleConfirmacion={descargarArchivos}
              onClose={cerrarModalDescargar}
      />
      </Grid>
    );
  }
  
  export default CardTraduccion;