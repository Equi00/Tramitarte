import { useEffect, useState } from "react"
import InputFile from "../components/inputs/InputFile"
import { Box, Button, Center, Flex, IconButton, ScaleFade, Text, useDisclosure } from "@chakra-ui/react"
import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router"
import processService from "../services/ProcessService"
import ModalError from "../components/modals/ModalError"
import ModalIsLoading from "../components/modals/ModalIsLoading"
import userService from "../services/UserService"
import { useAuth0 } from "@auth0/auth0-react"

const LoadDocuments = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([])
    const { isOpen, onToggle } = useDisclosure();
    const [typeName, setTypeName] = useState([]);
    const [documentName, setDocumentName] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
    const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();
    const { isOpen: isOpenError3, onOpen: onOpenError3, onClose: onCloseError3 } = useDisclosure();
    const [ certificate, setCertificate] = useState([])
    const [count, setCount] = useState(0)
    const {user}=useAuth0()

    const handleBack = () => {
        navigate(-1);
      };

      const completeDocumentation = async ({ id, file, index }) => {
        let updatedCertificate = [...certificate]; // Copy of certificate list
        let document = { ...updatedCertificate[index] }; 
        let base64 = await fileToBase64(file);
      
        if (id === "death-certificate") {
            document = {
            name: file.name,
            file_type: "death-certificate",
            file_base64: base64,
          };
        } else if (id === "marriage-certificate") {
            document = {
            name: file.name,
            file_type: "marriage-certificate",
            file_base64: base64,
          };
        } else if (id === "birth-certificate") {
            document = {
            name: file.name,
            file_type: "birth-certificate",
            file_base64: base64,
          };
        }
      
        updatedCertificate[index] = document; 
        setCertificate(updatedCertificate);
         
        certificate.forEach((certi) => {
            if(certi.name !== ""){
                setCount(count+1)
            }
        })
        
    };

    const handleInputCertificate = async (e, index) => {
        const file = e.target.files[0];
        if(file){
            setIsLoading(true)
            console.log("file: ", file)
            
            const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
            const lastPoint = file.name.lastIndexOf(".");
            const extension = file.name.slice(lastPoint + 1);
            setIsLoading(true)
            if(extension === "pdf"){
            if(typeName[index] === "birth-certificate"){
                const verification = await processService.isItalianBirthCertificate(file);
                if(verification === false){
                    setIsLoading(false)
                    onOpenError()
                }else{
                    console.log("It is a birth certificate")
                    completeDocumentation({
                        id: "birth-certificate",
                        file: file,
                        index: index
                    });
                    setDocumentName((prevNames) => {
                        const newName = [...prevNames];
                        newName[index] = shorterName;
                        return newName;
                      });
                }
            }
    
            if(typeName[index] === "marriage-certificate"){
                const verification = await processService.isItalianMarriageCertificate(file);
                if(verification === false){
                    setIsLoading(false)
                    onOpenError()
                }else{
                    console.log("It is a marriage certificate")
                    completeDocumentation({
                        id: "marriage-certificate",
                        file: file,
                        index: index
                    });
                    setDocumentName((prevNames) => {
                        const newName = [...prevNames];
                        newName[index] = shorterName;
                        return newName;
                      });
                }
            }
    
            if(typeName[index] === "death-certificate"){
                const verification = await processService.isItalianDeathCertification(file);
                if(verification === false){
                    setIsLoading(false)
                    onOpenError()
                }else{
                    console.log("It is a death certificate")
                    completeDocumentation({
                        id: "death-certificate",
                        file: file,
                        index: index
                    });
                    setDocumentName((prevNames) => {
                        const newName = [...prevNames];
                        newName[index] = shorterName;
                        return newName;
                      });
                }
            }
            setIsLoading(false)
        }else{
            onOpenError3()
            setIsLoading(false)
        }
        }
      }

      const handleSend = async () => {        
        let names = certificate.map((document) => document.name);
        if(names.some(element => element === undefined)){
            onOpenError2()
        }else{
            let translatorId = JSON.parse(localStorage.getItem('translatorId'))
            let requesterId = JSON.parse(localStorage.getItem('requesterId'))
            let taskId = JSON.parse(localStorage.getItem('taskId'))
            let translator = userService.getById(translatorId)
            
            await userService.createDownloadRequest(requesterId, translatorId, certificate)
            await userService.deleteTranslationTask(taskId)
            await userService.sendAlert(translatorId, requesterId, "Translator "+translator.name+" has sent the translated documents")
            navigate(-1)
        }
      }

      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
    
          reader.onloadend = () => {
            resolve(reader.result);
          };
    
          reader.onerror = (error) => {
            reject(error);
          };
        });
      }

      const getProcess = async () =>{
        let process = await processService.searchProcessByUserId(JSON.parse(localStorage.getItem('requesterId')))
        let data = process.data
        let documents = data.attachments_to_translate
        let names = documents.map((docu) => docu.file_type)
        const certificates = Array(documents.length).fill({
            certificate: { name: "", file_type: "", file_base64: "" }
        })
        console.log("certificates: ", certificates)
        setCertificate(certificates);
        setDocuments(documents)
        setTypeName(names)
        setDocumentName(names)
      }

    useEffect(() => {
        getProcess()
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
                    {"Enter the translated documentation"}
                </Text>
                </Flex>
                <Center flexWrap="wrap" gap={2} w="100%" p="2%" display={"grid"}>
                    {documents.map((document, index) => (
                        <InputFile key={index} action={documentName[index] === typeName[index] ? typeName[index] + "(.pdf)" : documentName[index]} handleOnInput={(e) => handleInputCertificate(e, index)}/>
                    ))}
                </Center>
            </Flex>
            <Flex justifyContent="center" w="full" py="16">
                <Button
                onClick={handleSend}
                borderRadius="45px"
                color="white"
                w="sm"
                bg="blue.900"
                textTransform={"uppercase"}
                >
                {"Save Documentation"}
                </Button>
            </Flex>
            </ScaleFade>
            </Center>
            <ModalError
                question={"The selected file is not valid"}
                dataToConfirm={
                "Please choose the appropriate file to continue. If the file is correct, please try again with better resolution and clearer images."
                }
                isOpen={isOpenError}
                onClose={onCloseError}
            />
            <ModalError
                question={"The form is incomplete"}
                dataToConfirm={
                "Please enter all requested documents."
                }
                isOpen={isOpenError2}
                onClose={onCloseError2}
            />
            <ModalError
                question={"The file extension is not valid"}
                dataToConfirm={
                "Please choose a file with the extension ¨.pdf¨."
                }
                isOpen={isOpenError3}
                onClose={onCloseError3}
            />
            <ModalIsLoading
                message={"Please wait while we save the documentation ;)"}
                isOpen={isLoading}
            />
        </Box>
        
    )
}

export default LoadDocuments