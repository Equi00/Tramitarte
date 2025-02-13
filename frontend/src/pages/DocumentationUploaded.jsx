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
  useDisclosure
} from "@chakra-ui/react";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import userService from "../services/UserService";
import WarningCard from "../components/cards/WarningCard";
import InputEdit from "../components/inputs/InputEdit";
import processService from "../services/ProcessService";
import ModalIsLoading from "../components/modals/ModalIsLoading";
import ModalError from "../components/modals/ModalError";
import { DownloadIcon } from "@chakra-ui/icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ConfirmationModal from "../components/modals/ConfirmationModal";


function DocumentationUploaded() {
  const navigate = useNavigate();
  const [uploadedDocumentation, setUploadedDocumentation]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();
  const { isOpen: isOpenError3, onOpen: onOpenError3, onClose: onCloseError3 } = useDisclosure();
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  
  const openModalSubmit = () => {
    if(uploadedDocumentation.length > 0){
      setIsAcceptOpen(true);
    }else{
      onOpenError3()
    }
  };

  const closeModalSubmit = () => {
    setIsAcceptOpen(false);
  };

  const uploadDocumentation = async() => {
    if(JSON.parse(window.localStorage.getItem('process')).id){
      const documentation= await userService.getDocumentationUploaded(JSON.parse(window.localStorage.getItem('process')).id)
      setUploadedDocumentation(documentation)
    }
  };

  const handleInputCertificate = async (e, index) => {
    const file = e.target.files[0];
    setIsLoading(true)
    if(file){
        let base64 = await fileToBase64(file);
        console.log("file: ", file)
        let file_id = uploadedDocumentation[index].id
        console.log("Document changed",uploadedDocumentation[index])
        const lastPoint = file.name.lastIndexOf(".");
        const extension = file.name.slice(lastPoint + 1);
        let isCertificate = await processService.isCertificate(file)
        if(extension === "pdf" && isCertificate){
          let birthVerification = await processService.isBirthCertificate(file)
          let italianBirthCertification = await processService.isItalianBirthCertificate(file)
          let marriageCertificate = await processService.isMarriageCertificate(file)
          let italianMarriageCertificate= await processService.isItalianMarriageCertificate(file)
          let deathCertificate = await processService.isDeathCertificate(file)
          let italianDeathCertificate = await processService.isItalianDeathCertification(file)

          if(deathCertificate || italianDeathCertificate){
            processService.modifyFile(file_id
              , {
                name: file.name,
                file_type: "death-certificate",
                file_base64: base64
              })
          }else if(marriageCertificate || italianMarriageCertificate){
            processService.modifyFile(file_id
              , {
                name: file.name,
                file_type: "marriage-certificate",
                file_base64: base64
              })
          }else if(birthVerification || italianBirthCertification){
            processService.modifyFile(file_id
              , {
                name: file.name,
                file_type: "birth-certificate",
                file_base64: base64
              })
          }else{
            onOpenError2()
            setIsLoading(false)
          }
          setIsLoading(false)
        }else if(extension === "jpg" || extension === "png"){
          let dniFrontVerification = await processService.isDNIFront(file)
          let dniBackVerification = await processService.isDNIBack(file)
          if(dniBackVerification){
            processService.modifyFile(file_id
              , {
                name: file.name,
                file_type: "dni-back",
                file_base64: base64
              })
          }else if(dniFrontVerification){
            processService.modifyFile(file_id
              , {
                tname: file.name,
                file_type: "dni-front",
                file_base64: base64
              })
          }else{
            onOpenError2()
            setIsLoading(false)
          }
          
          setIsLoading(false)
        }else{
          onOpenError()
          setIsLoading(false)
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

  const downloadFiles = async () => {
    const arrayFiles = uploadedDocumentation;
    console.log(arrayFiles)
    const zip = new JSZip();
  
    // Iterate over the files in Base64 format and add them to the ZIP
    arrayFiles.forEach((file, index) => { // Add an index
      let lastPoint = file.name.lastIndexOf(".");
      let extension = file.name.slice(lastPoint + 1);
      let filename = ""
      if(extension === "jpg"){
        filename = `${file.name.replace(/\s/g, '_')}_${index}.jpg`; // Add the extension to the filename
      }else if(extension === "png"){
        filename = `${file.name.replace(/\s/g, '_')}_${index}.png`;
      }else{
        filename = `${file.name.replace(/\s/g, '_')}_${index}.pdf`;
      }
      const base64Data = file.file_base64;
  
      // Decode Base64 into a Blob
      const fileBlob = base64ToBlob(base64Data);
  
      // Add the file to the ZIP
      zip.file(filename, fileBlob);
    });
  
    // Generate ZIP file
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Process-documentation.zip");
    });
    closeModalSubmit();
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
    uploadDocumentation();
  }, [uploadedDocumentation]); 

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
          onClick={() => openModalSubmit()}
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
        {uploadedDocumentation.length === 0 ? <WarningCard text={"There are no certificates uploaded yet"}/> :uploadedDocumentation.map((document, index) => (
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
                  {document.name}
                </Heading>
              </CardHeader>
              <CardBody align="center">
                <Text>{document.file_type}</Text>
              </CardBody>
              <CardFooter w="100%">
                <Text color="white" w="100%" bg="red.900" borderRadius={"45px"}>
                  <Center>{document.id}</Center>
                </Text>
              </CardFooter >
              <InputEdit handleOnInput={(e) => handleInputCertificate(e, index)}/>
            </Card>
          </Flex>
        ))}
      </Wrap>
      <ConfirmationModal
              id="modal-confirmation"
              question={"Are you sure you want to download the documents?"}
              isOpen={isAcceptOpen}
              handleConfirmation={downloadFiles}
              onClose={closeModalSubmit}
      />
      <ModalError
                question={"The file extension is not valid"}
                dataToConfirm={
                "Please choose a file with the extension ¨.pdf¨ or ¨.jpg¨ or ¨.png¨"
                }
                isOpen={isOpenError}
                onClose={onCloseError}
            />
      <ModalError
                question={"The file extension is not valid"}
                dataToConfirm={
                "Please choose the appropriate file to continue. If the file is correct, please try again with better resolution and clearer images."
                }
                isOpen={isOpenError2}
                onClose={onCloseError2}
            />
      <ModalError
                question={"No files uploaded"}
                dataToConfirm={
                "Please upload files to the application to download."
                }
                isOpen={isOpenError3}
                onClose={onCloseError3}
            />
      <ModalIsLoading
                message={"Please wait while we save the documentation ;)"}
                isOpen={isLoading}
            />
    </Box>
  );
}

export default DocumentationUploaded;
