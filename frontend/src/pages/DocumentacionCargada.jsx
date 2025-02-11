import {
  Box,
  Flex,
  IconButton,
  Text,
  Wrap,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Center,
  useDisclosure,
  Grid,
} from "@chakra-ui/react";
import { ArrowBack, SaveAs } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {  Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import usuarioService from "../services/UsuarioService";
import CardAviso from "../components/CardAviso";
import InputFile from "../components/documentacionSolicitante/InputFile";
import InputEdit from "../components/documentacionSolicitante/InputEdit";
import tramiteService from "../services/TramiteService";
import ModalIsLoading from "../components/ModalIsLoading";
import ModalError from "../components/ModalError";
import { DownloadIcon } from "@chakra-ui/icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ModalConfirmacion from "../components/ModalConfirmacion";


function DocumentacionCargada() {
  const navigate = useNavigate();
  const [documentosCargados, setDocumentosCargados]=useState([])
  const [estaCargando, setEstaCargando] = useState(false);
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();
  const { isOpen: isOpenError3, onOpen: onOpenError3, onClose: onCloseError3 } = useDisclosure();
  const [estaAceptarAbierto, setEstaAceptarAbierto] = useState(false);
  
  const abrirModalEnviar = () => {
    if(documentosCargados.length > 0){
      setEstaAceptarAbierto(true);
    }else{
      onOpenError3()
    }
  };

  const cerrarModalEnviar = () => {
    setEstaAceptarAbierto(false);
  };

  const cargarDocumentacion = async() => {
    if(JSON.parse(window.localStorage.getItem('tramite')).id){
      const documentacion= await usuarioService.traerDocumentacionCargada(JSON.parse(window.localStorage.getItem('tramite')).id)
      setDocumentosCargados(documentacion)
    }
  };

  const handleInputCertificado = async (e, index) => {
    const archivo = e.target.files[0];
    setEstaCargando(true)
    if(archivo){
        let archivoBase64 = await fileToBase64(archivo);
        console.log("archivo: ", archivo)
        let idArchivo = documentosCargados[index].id
        console.log("Documento cambiado",documentosCargados[index])
        const ultimoPunto = archivo.name.lastIndexOf(".");
        const extension = archivo.name.slice(ultimoPunto + 1);
        if(extension === "pdf"){
          let verificacionNacimiento = await tramiteService.esCertificadoNacimiento(archivo)
          let verificacionNacimientoItaliano = await tramiteService.esCertificadoNacimientoItaliano(archivo)
          let verificacionMatrimonio = await tramiteService.esCertificadoMatrimonio(archivo)
          let verificacionMatrimonioItaliano= await tramiteService.esCertificadoMatrimonioItaliano(archivo)
          let verificacionDefuncion = await tramiteService.esCertificadoDefuncion(archivo)
          let verificacionDefuncionItaliano = await tramiteService.esCertificadoDefuncionItaliano(archivo)

          if(verificacionDefuncion || verificacionDefuncionItaliano){
            tramiteService.modificarArchivo(idArchivo
              , {
                tipo: "certificado-defuncion",
                nombre: archivo.name,
                archivoBase64: archivoBase64
              })
          }else if(verificacionMatrimonio || verificacionMatrimonioItaliano){
            tramiteService.modificarArchivo(idArchivo
              , {
                tipo: "certificado-matrimonio",
                nombre: archivo.name,
                archivoBase64: archivoBase64
              })
          }else if(verificacionNacimiento || verificacionNacimientoItaliano){
            tramiteService.modificarArchivo(idArchivo
              , {
                tipo: "certificado-nacimiento",
                nombre: archivo.name,
                archivoBase64: archivoBase64
              })
          }else{
            onOpenError2()
            setEstaCargando(false)
          }
          setEstaCargando(false)
        }else if(extension === "jpg"){
          let verificacionDniFrente = await tramiteService.esDniFrente(archivo)
          let verificacionDniDorso = await tramiteService.esDniDorso(archivo)
          if(verificacionDniDorso){
            tramiteService.modificarArchivo(idArchivo
              , {
                tipo: "dni-dorso",
                nombre: archivo.name,
                archivoBase64: archivoBase64
              })
          }else if(verificacionDniFrente){
            tramiteService.modificarArchivo(idArchivo
              , {
                tipo: "dni-frente",
                nombre: archivo.name,
                archivoBase64: archivoBase64
              })
          }else{
            onOpenError2()
            setEstaCargando(false)
          }
          
          setEstaCargando(false)
        }else{
          onOpenError()
          setEstaCargando(false)
        }
    }
  }
  
  function fileToBase64(archivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const descargarArchivos = async () => {
    const arrayArchivos = documentosCargados;
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

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    cargarDocumentacion();
  }, [documentosCargados]); 

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
        <IconButton
          onClick={() => abrirModalEnviar()}
          borderRadius="45px"
          color="blue.900"
          bg="white"
          icon={<DownloadIcon />}
        />
      </Flex>
      <Wrap
        spacing={"1.2rem"}
        bg="teal.200"
        p="1.4rem"
        justifyContent={"center"}
      >
        {documentosCargados.length === 0 ? <CardAviso text={"No hay certificados cargados aún"}/> :documentosCargados.map((documento, index) => (
          <Flex py="1.2rem" justifyContent="center" alignItems={"center"} alignContent={"center"} display={"flex"}>
            <Card
              borderRadius="45px"
              bg="rgba(255, 255, 255, 0.8)"
              align="center"
              p="1.6rem"
              w={"25rem"}
              h={"18rem"}
              key={index}
            >           
              <CardHeader>
                <Heading textAlign="center" size="md">
                  {documento.nombre}
                </Heading>
              </CardHeader>
              <CardBody align="center">
                <Text>{documento.tipo}</Text>
              </CardBody>
              <CardFooter w="100%">
                <Text color="white" w="100%" bg="red.900" borderRadius={"45px"}>
                  <Center>{documento.id}</Center>
                </Text>
              </CardFooter >
              <InputEdit handleOnInput={(e) => handleInputCertificado(e, index)}/>
            </Card>
          </Flex>
        ))}
      </Wrap>
      <ModalConfirmacion
              id="modal-confirmacion"
              pregunta={"¿Estás seguro de descargar los documentos?"}
              isOpen={estaAceptarAbierto}
              handleConfirmacion={descargarArchivos}
              onClose={cerrarModalEnviar}
      />
      <ModalError
                pregunta={"La extension del archivo no es valida"}
                datoAConfirmar={
                "Por favor elija un archivo de extension ¨.pdf¨ o ¨.jpg¨."
                }
                isOpen={isOpenError}
                onClose={onCloseError}
            />
      <ModalError
                pregunta={"El archivo seleccionado no es valido"}
                datoAConfirmar={
                "Por favor elija el archivo correspondiente para continuar. En caso de que el archivo sea el correcto, vuelva a intentarlo con imagenes en mejor resolucion y mas claras."
                }
                isOpen={isOpenError2}
                onClose={onCloseError2}
            />
      <ModalError
                pregunta={"No hay archivos cargados"}
                datoAConfirmar={
                "Por favor ingrese archivos en la aplicacion para poder descargar."
                }
                isOpen={isOpenError3}
                onClose={onCloseError3}
            />
      <ModalIsLoading
                mensaje={"Esperanos mientras guardamos la documentación ;)"}
                isOpen={estaCargando}
            />
    </Box>
  );
}

export default DocumentacionCargada;
