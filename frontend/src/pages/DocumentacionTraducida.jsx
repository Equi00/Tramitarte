import { useAuth0 } from "@auth0/auth0-react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import tramiteService from "../services/TramiteService";
import usuarioService from "../services/UsuarioService";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { ArrowBack } from "@mui/icons-material";
import { ScaleFade } from "@chakra-ui/transition";
import InputFile from "../components/documentacionSolicitante/InputFile";
import ModalError from "../components/ModalError";
import ModalIsLoading from "../components/ModalIsLoading";

const DocumentacionTraducida = () => {
    const navigate = useNavigate();
    const [documentos, setDocumentos] = useState([])
    const { isOpen, onToggle } = useDisclosure();
    const [nombreTipo, setNombreTipo] = useState([]);
    const [nombreDocumento, setNombreDocumento] = useState([])
    const [estaCargando, setEstaCargando] = useState(false);
    const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
    const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();
    const { isOpen: isOpenError3, onOpen: onOpenError3, onClose: onCloseError3 } = useDisclosure();
    const [ certificado, setCertificados] = useState([])
    const [cantidad, setCantidad] = useState(0)
    const { idUsuario } = useParams();

    const handleBack = () => {
        navigate(-1);
      };

      const completarDocumentacion = async ({ id, archivo, index }) => {
        let certificadoActualizado = [...certificado]; // Copia de la lista de certificados
        let ascendente = { ...certificadoActualizado[index] }; // Copia del descendente específico
        let archivoBase64 = await fileToBase64(archivo);
      
        if (id === "certificado-defuncion") {
          ascendente = {
            tipo: "certificado-defuncion",
            nombre: archivo.name,
            archivoBase64: archivoBase64,
          };
        } else if (id === "certificado-matrimonio") {
          ascendente = {
            tipo: "certificado-matrimonio",
            nombre: archivo.name,
            archivoBase64: archivoBase64,
          };
        } else if (id === "certificado-nacimiento") {
          ascendente = {
            tipo: "certificado-nacimiento",
            nombre: archivo.name,
            archivoBase64: archivoBase64,
          };
        }
      
        certificadoActualizado[index] = ascendente; // Actualiza solo el descendente específico
        setCertificados(certificadoActualizado); // Actualiza la lista de certificados
        setCantidad(cantidad+1)
    };

    const handleInputCertificado = async (e, index) => {
        const archivo = e.target.files[0];
        if(archivo){
            setEstaCargando(true)
            console.log("archivo: ", archivo)
            
            const nombreRecortado = archivo.name.length > 20 ? archivo.name.substring(0, 30) + '...' : archivo.name;
            const ultimoPunto = archivo.name.lastIndexOf(".");
            const extension = archivo.name.slice(ultimoPunto + 1);
            setEstaCargando(true)
            if(extension === "pdf"){
            if(nombreTipo[index] === "certificado-nacimiento"){
                const verificacion = await tramiteService.esCertificadoNacimientoItaliano(archivo);
                if(verificacion === false){
                    setEstaCargando(false)
                    onOpenError()
                }else{
                    console.log("es un certificado de nacimiento")
                    completarDocumentacion({
                        id: "certificado-nacimiento",
                        archivo: archivo,
                        index: index
                    });
                    setNombreDocumento((prevNombres) => {
                        const nuevosNombres = [...prevNombres];
                        nuevosNombres[index] = nombreRecortado;
                        return nuevosNombres;
                      });
                }
            }
    
            if(nombreTipo[index] === "certificado-matrimonio"){
                const verificacion = await tramiteService.esCertificadoMatrimonioItaliano(archivo);
                if(verificacion === false){
                    setEstaCargando(false)
                    onOpenError()
                }else{
                    console.log("es un certificado de matrimonio")
                    completarDocumentacion({
                        id: "certificado-matrimonio",
                        archivo: archivo,
                        index: index
                    });
                    setNombreDocumento((prevNombres) => {
                        const nuevosNombres = [...prevNombres];
                        nuevosNombres[index] = nombreRecortado;
                        return nuevosNombres;
                      });
                }
            }
    
            if(nombreTipo[index] === "certificado-defuncion"){
                const verificacion = await tramiteService.esCertificadoDefuncionItaliano(archivo);
                if(verificacion === false){
                    setEstaCargando(false)
                    onOpenError()
                }else{
                    console.log("es un certificado de defuncion")
                    completarDocumentacion({
                        id: "certificado-defuncion",
                        archivo: archivo,
                        index: index
                    });
                    setNombreDocumento((prevNombres) => {
                        const nuevosNombres = [...prevNombres];
                        nuevosNombres[index] = nombreRecortado;
                        return nuevosNombres;
                      });
                }
            }
            setEstaCargando(false)
        }else{
            onOpenError3()
            setEstaCargando(false)
        }
        }
      }

      const handleEnviar = async () => {
        console.log("documentacion: ", certificado)
        
        let nombres = certificado.map((documento) => documento.nombre);
        console.log("nombres", nombres)
        if(documentos.length !== cantidad){
            onOpenError2()
        }else{
            let respuesta = await tramiteService.cargarDocumentacionTraducida(certificado ,idUsuario)
            console.log("respuesta: ", respuesta.data)
            navigate(-1)
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

      const traerTramite = async () =>{
        let tramite = await tramiteService.buscarPorUsuario(idUsuario)
        let data = tramite.data
        let documentos = data.adjuntosATraducir
        let nombres = documentos.map((docu) => docu.tipo)
        const certificados = Array(documentos.length).fill({
            certificado: { tipo: "", nombre: "", archivoBase64: "" }
        })
        console.log("certificados: ", certificados)
        setCertificados(certificados);
        setDocumentos(documentos)
        setNombreTipo(nombres)
        setNombreDocumento(nombres)
      }

    useEffect(() => {
        traerTramite()
    }, [])

    return (
        <Box minH="100%" h="auto" bg="teal.200" >
            <Flex w="100%" p=".8rem" justify="space-between">
                <IconButton
                onClick={() => handleBack()}
                color="blue.900"
                bg="white"
                boxShadow={"0px 4px 10px 3px rgba(26, 54, 93, .5)"}
                borderRadius="50%"
                size="lg"
                icon={<ArrowBack />}
                />
            </Flex>
            <Center minH="100%" h="auto" bg="teal.200"  flexWrap={"wrap"} marginTop={"5rem"}>
                <ScaleFade style={{width: "100%", minWidth: "sm"}} in={!isOpen} initialScale={1}>
            <Flex
                textAlign="center"
                pb="2%"
                w={"full"}
                flexWrap="wrap"
            >
                <Flex w="100%" justifyContent="center">
                <Text
                    w="85%"
                    alignSelf="center"
                    borderTopRadius="15px"
                    bg="teal.200"
                    color="white"
                    borderColor="teal.300"
                    borderWidth="1px"
                    as={"h2"}
                    fontSize={"2xl"}
                    fontWeight={300}
                >
                    {"Ingrese la documentación traducida"}
                </Text>
                </Flex>
                <Center flexWrap="wrap" gap={2} w="100%" p="2%">
                    {documentos.map((documento, index) => (
                        <InputFile key={index} accion={nombreDocumento[index] === nombreTipo[index] ? nombreTipo[index] + "(.pdf)" : nombreDocumento[index]} handleOnInput={(e) => handleInputCertificado(e, index)}/>
                    ))}
                </Center>
            </Flex>
            <Flex justifyContent="center" w="full" py="16">
                <Button
                onClick={handleEnviar}
                borderRadius="45px"
                color="white"
                w="sm"
                bg="blue.900"
                textTransform={"uppercase"}
                >
                {"Guardar documentación"}
                </Button>
            </Flex>
            </ScaleFade>
            </Center>
            <ModalError
                pregunta={"El archivo seleccionado no es valido"}
                datoAConfirmar={
                "Por favor elija el archivo correspondiente para continuar. En caso de que el archivo sea el correcto, vuelva a intentarlo con imagenes en mejor resolucion y mas claras."
                }
                isOpen={isOpenError}
                onClose={onCloseError}
            />
            <ModalError
                pregunta={"El formulario está incompleto"}
                datoAConfirmar={
                "Por favor ingrese todos los documentos pedidos."
                }
                isOpen={isOpenError2}
                onClose={onCloseError2}
            />
            <ModalError
                pregunta={"La extension del archivo no es valida"}
                datoAConfirmar={
                "Por favor elija un archivo de extension ¨.pdf¨."
                }
                isOpen={isOpenError3}
                onClose={onCloseError3}
            />
            <ModalIsLoading
                mensaje={"Esperanos mientras guardamos la documentación ;)"}
                isOpen={estaCargando}
            />
        </Box>
        
    )
}

export default DocumentacionTraducida