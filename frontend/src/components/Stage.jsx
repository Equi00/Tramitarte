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
} from "@chakra-ui/react";

import { Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import processService from "../services/ProcessService";
import { useState, useCallback, useEffect } from "react";
import ConfirmationModal from "./modals/ConfirmationModal";
import ModalIsLoading from "./modals/ModalIsLoading";
import userService from "../services/UserService";
import { saveAs } from "file-saver";
import JSZip from "jszip";

function Stage({ process }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState([])
  const [savedRequest, setSavedRequest] = useState()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const openDownloadModal = () => {
    setIsDownloadOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadOpen(false);
  };

  const openSendModal = (requestHooked) => {
    let request = requestHooked
    setSavedRequest(request)
    console.log("hooked request: ",requestHooked)
    setIsAcceptOpen(true);
  };

  const closeSendModal = () => {
    setIsAcceptOpen(false);
  };

const openCancelModal = (requestHooked) => {
    let request = requestHooked
    setSavedRequest(request)
    console.log("hooked request: ",requestHooked)
    setIsDeleteOpen(true);
  };

  const closeCancelModal = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmation = useCallback(() => {
    setIsLoading(true);
    return processService
      .delete(process.id)
      .then((response) => {
        setIsLoading(false);
        navigate(`/home/requester/${userId}`, { replace: true });
        window.location.replace('')
        return response;
      })
      .catch((error) => navigate("/network-error"));
  }, []);

  const getDownloadRequest = async () => {
    let downloadRequest = await userService.searchDownloadRequestByRequesterId(userId)
    setRequests(downloadRequest)
  }

  const deleteRequest = async () => {
    await userService.deleteDownloadRequest(savedRequest.id)
    closeCancelModal()
  }

  const downloadFiles = async () => {
    const arrayFiles = savedRequest.documentation;
    console.log(arrayFiles)
    const zip = new JSZip();
  
    // Iterate over the files in Base64 format and add them to the ZIP
    arrayFiles.forEach((file, index) => { // add an index
      const filename = `${file.name.replace(/\s/g, '_')}_${index}.pdf`; // add index
      const base64 = file.file_base64;
  
      // Decode Base64 into a Blob
      const blobFile = base64ToBlob(base64);
  
      // Add the file to the ZIP
      zip.file(filename, blobFile);
    });
  
    // Generate zip file
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Translated-documentation.zip");
    });
    await userService.deleteDownloadRequest(savedRequest.id)
    closeSendModal();
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

  const downloadAllRequester = async () => {
    setIsLoading(true)
    let process = await processService.searchProcessByUserId(userId)
    const allDocumentation = process.data.documentations;
    const arrayFiles = allDocumentation;
    console.log(arrayFiles)
    const zip = new JSZip();
  
    // Iterate over the files in Base64 format and add them to the ZIP
    arrayFiles.forEach((file, index) => { // add index
      let lastPoint = file.name.lastIndexOf(".");
      let extension = file.name.slice(lastPoint + 1);
      let filename = ""
      if(extension === "jpg"){
        filename = `${file.name.replace(/\s/g, '_')}_${index}.jpg`; 
      }else if (extension === "png"){
        filename = `${file.name.replace(/\s/g, '_')}_${index}.png`; 
      }else{
        filename = `${file.name.replace(/\s/g, '_')}_${index}.pdf`; 
      }
      const base64Data = file.file_base64;
  
      const blobFile = base64ToBlob(base64Data);
  
      zip.file(filename, blobFile);
    });
  
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Process-documentation.zip");
    });
    closeDownloadModal();
    setIsLoading(false)
  }

  useEffect(() => {
    getDownloadRequest()
  }, [requests])

  function chooseRoute(stageDescription) {
    let basePath = `/home/requester/${userId}`;
    let completePath;
    switch (stageDescription.toUpperCase()) {
      case "UPLOAD AVO":
        completePath = `${basePath}/avo-request`;
        break;
      case "LOAD USER DOCUMENTATION":
        completePath = `${basePath}/personal-documentation`;
        break;
      case "LOAD AVO DOCUMENTATION":
        completePath = `${basePath}/avo-documentation`;
        break;
      case "LOAD ANCESTORS DOCUMENTATION":
        completePath = `${basePath}/ancestors-documentation`;
        break;
      case "LOAD TRANSLATED DOCUMENTATION":
        completePath = `${basePath}/translated-documentation`;
        break;
    }
    return completePath;
  }

  function calculatePercentage(stageDescription) {
    let percentage;
    switch (stageDescription.toUpperCase()) {
      case "UPLOAD AVO":
        percentage = "1";
        break;
      case "LOAD USER DOCUMENTATION":
        percentage = "20";
        break;
      case "LOAD AVO DOCUMENTATION":
        percentage = "55";
        break;
      case "LOAD ANCESTORS DOCUMENTATION":
        percentage = "70";
        break;
      case "LOAD TRANSLATED DOCUMENTATION":
        percentage = "90";
        break;
      case "PROCESS COMPLETED, CLICK TO DOWNLOAD FILES":
        percentage = "100";
        break;
    }
    return percentage;
  }

  return (
    <Box >
      <Card borderRadius="45px" bg="rgba(255, 255, 255, 0.8)" align="center">
        <CardHeader>
          <HStack spacing="2%">
            <Heading size="md">{process.code}</Heading>
            <IconButton
              aria-label="Delete process"
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
            value={calculatePercentage(process.stage.description)}
            color="blue.900"
            thickness="10%"
          >
            <CircularProgressLabel>
              {calculatePercentage(process.stage.description)}%
            </CircularProgressLabel>
          </CircularProgress>
        </CardBody>
        <CardFooter w="100%">
          <Button
            onClick={() => {process.stage.description === "Process completed, click to download files" ? openDownloadModal() :
              navigate(chooseRoute(process.stage.description));
            }}
            textTransform="uppercase"
            borderRadius="45px"
            w={{ base: "100%", md: "md"}}
            color="white"
            bg="red.900"
            whiteSpace={'normal'}
          >
            {process.stage.description}
          </Button>
        </CardFooter>

        <ConfirmationModal
          isOpen={isOpen}
          handleConfirmation={() => handleConfirmation()}
          question={"Are you sure you want to delete the process?"}
          dataToConfirm={"By deleting it, you will not be able to recover your data."}
          onClose={onClose}
        />
        <ModalIsLoading isOpen={isLoading} />
      </Card>
      {requests.length === 0 ? <div></div> :
        requests.map((request, index) => (
      <Card
          borderRadius="45px"
          bg="rgba(255, 255, 255, 0.8)"
          align="center"
          key={index}
          h={"10rem"}
          marginTop={"1rem"}
        >
          <CardHeader>
            <Heading textAlign="center" size="md">{"Documents ready to download"}</Heading>
          </CardHeader>
          <CardFooter w="20rem" justifyContent={"space-around"}>
          <Button
            borderRadius="45px"
            color="white"
            w="6rem"
            bg="green.400"
            onClick={() => openSendModal(request)}
          >
            {"Download"}
            
          </Button>
            <Button
              borderRadius="45px"
              color="white"
              w="6rem"
              bg="red.900"
              onClick={() => openCancelModal(request)}
            >
              {"Delete"}
            </Button>
          </CardFooter>
        </Card>
        ))}
        <ConfirmationModal
              id="modal-confirmation"
              question={"Are you sure you want to delete document delivery?"}
              isOpen={isDeleteOpen}
              handleConfirmation={deleteRequest}
              onClose={closeCancelModal}
      />
      <ConfirmationModal
              id="modal-confirmation"
              question={"Are you sure you want to download the documents?"}
              isOpen={isAcceptOpen}
              handleConfirmation={downloadFiles} 
              onClose={closeSendModal}
      />
      <ConfirmationModal
              id="modal-confirmation"
              question={"Are you sure you want to download the documents?"}
              isOpen={isDownloadOpen}
              handleConfirmation={downloadAllRequester} 
              onClose={closeDownloadModal}
      />
    </Box>
  );
}

export default Stage;
