import {
  Flex,
  Box,
  IconButton,
  Center,
  ScaleFade,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ModalIsLoading from "../components/modals/ModalIsLoading";
import AVODocumentation from "../components/requesterDocumentation/AVODocumentation";
import processService from "../services/ProcessService";
import ModalError from "../components/modals/ModalError";
function AvoDocuments() {
  const navigate = useNavigate();
  const { isOpen } = useDisclosure();
  const [isCharging, setIsCharging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isOpenNoObligatory1, onToggle: onToggle1 } = useDisclosure();
  const { isOpen: isOpenNoObligatory2, onToggle: onToggle2 } = useDisclosure();
  const [AVOdocumentation, setAVOdocumentation] = useState({
    birthCertificate: { name: "", file_type: "", file_base64: "" },
    marriageCertificate: { name: "", file_type: "", file_base64: "" },
    deathCertificate: { name: "", file_type: "", file_base64: "" },
  });
  const handleBack = () => navigate(-1);

  const openModal = () => {
    if(AVOdocumentation.birthCertificate.name === "" || (isOpenNoObligatory1 === true && AVOdocumentation.deathCertificate.name === "") 
    || (isOpenNoObligatory2 === true && AVOdocumentation.marriageCertificate.name === "")){
      onOpenError()
    }else{
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const completeAVOdocumentation = async ({ id, file }) => {
    if (id === "death-certificate") {
      let base64 = await fileToBase64(file);
      setAVOdocumentation({
        deathCertificate: {
          name: file.name,
          file_type: "death-certificate",
          file_base64: base64,
        },
        marriageCertificate: AVOdocumentation.marriageCertificate ?? {
          name: AVOdocumentation.marriageCertificate.name,
          file_type: AVOdocumentation.marriageCertificate.file_type,
          file_base64: AVOdocumentation.marriageCertificate.file_base64,
        },
        birthCertificate: {
          name: AVOdocumentation.birthCertificate.name,
          file_type: AVOdocumentation.birthCertificate.file_type,
          file_base64: AVOdocumentation.birthCertificate.file_base64,
        },
      });
    }
    if (id === "marriage-certificate") {
      let base64 = await fileToBase64(file);
      setAVOdocumentation({
        deathCertificate: AVOdocumentation.deathCertificate && {
          name: AVOdocumentation.deathCertificate.name,
          file_type: AVOdocumentation.deathCertificate.file_type,
          file_base64: AVOdocumentation.deathCertificate.file_base64,
        },
        marriageCertificate: {
          name: file.name,
          file_type: "marriage-certificate",
          file_base64: base64,
        },
        birthCertificate: {
          name: AVOdocumentation.birthCertificate.name,
          file_type: AVOdocumentation.birthCertificate.file_type,
          file_base64: AVOdocumentation.birthCertificate.file_base64,
        },
      });
    }
    if (id === "birth-certificate") {
      let base64 = await fileToBase64(file);
      setAVOdocumentation({
        deathCertificate: AVOdocumentation.deathCertificate && {
          name: AVOdocumentation.deathCertificate.name,
          file_type: AVOdocumentation.deathCertificate.file_type,
          file_base64: AVOdocumentation.deathCertificate.file_base64,
        },
        marriageCertificate: AVOdocumentation.marriageCertificate && {
          name: AVOdocumentation.marriageCertificate.name,
          file_type: AVOdocumentation.marriageCertificate.file_type,
          file_base64: AVOdocumentation.marriageCertificate.file_base64,
        },
        birthCertificate: {
          name: file.name,
          file_type: "birth-certificate",
          file_base64: base64,
        },
      });
    }
  };

  const handleConfirmacion = async () => {
    closeModal();
    setIsCharging(true);
    console.log("acá", [
      AVOdocumentation.deathCertificate,
      AVOdocumentation.marriageCertificate,
      AVOdocumentation.birthCertificate,
    ]);
    let documents = []
    let process = JSON.parse(window.localStorage.getItem("process"));
    try {
      const AVOdocuments = [
        AVOdocumentation.deathCertificate,
        AVOdocumentation.marriageCertificate,
        AVOdocumentation.birthCertificate,
      ];
  
      const filesWithName = AVOdocuments.filter((file) => file.name !== "");
  
      documents.push(...filesWithName);

      let response = await processService.uploadAVODocumentation(
        documents,
        Number(process.id)
      );
      console.log(documents)
      console.log(response);
      setIsCharging(false);
      navigate(
        `/home/requester/${
          JSON.parse(window.localStorage.getItem("loggedUser")).id
        }`
      );
    } catch (error) {
      navigate("/network-error");
    }
  };

  useEffect(() => {
    if(isOpenNoObligatory1 === false){
      setAVOdocumentation({
        deathCertificate: {
          name: "",
          file_type: "",
          file_base64: "",
        },
        marriageCertificate: AVOdocumentation.marriageCertificate ?? {
          name: AVOdocumentation.marriageCertificate.name,
          file_type: AVOdocumentation.marriageCertificate.file_type,
          file_base64: AVOdocumentation.marriageCertificate.file_base64,
        },
        birthCertificate: {
          name: AVOdocumentation.birthCertificate.name,
          file_type: AVOdocumentation.birthCertificate.file_type,
          file_base64: AVOdocumentation.birthCertificate.file_base64,
        },
      });
    }
  }, [isOpenNoObligatory1])

  useEffect(() => {
    if(isOpenNoObligatory2 === false){
      setAVOdocumentation({
        deathCertificate: AVOdocumentation.deathCertificate && {
          name: AVOdocumentation.deathCertificate.name,
          file_type: AVOdocumentation.deathCertificate.file_type,
          file_base64: AVOdocumentation.deathCertificate.file_base64,
        },
        marriageCertificate: {
          name: "",
          file_type: "",
          file_base64: "",
        },
        birthCertificate: {
          name: AVOdocumentation.birthCertificate.name,
          file_type: AVOdocumentation.birthCertificate.file_type,
          file_base64: AVOdocumentation.birthCertificate.file_base64,
        },
      });
    }
  }, [isOpenNoObligatory2])

  return (
    <Box minH="100%" h="auto" bg="teal.200">
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
      <Center p="1rem">
        <Center
          w="sm"
          borderRadius="45px"
          py=".8rem"
          bg="blue.900"
          color="white"
          fontWeight={"700"}
        >
          {JSON.parse(window.localStorage.getItem("process")).code}
        </Center>
      </Center>
      <Center flexWrap="wrap" p={{ base: "8", md: "16" }}>
        <ScaleFade
          style={{ width: "100%", minWidth: "sm" }}
          in={!isOpen}
          initialScale={1}
        >
          <Flex textAlign="center" pb="2%" w={"full"} flexWrap="wrap">
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
                {"AVO documentation"}
              </Text>
            </Flex>
            <AVODocumentation addAVODocuments={completeAVOdocumentation} isOpenNO1={isOpenNoObligatory1} onToggle1={onToggle1} isOpenNO2={isOpenNoObligatory2} onToggle2={onToggle2} />
          </Flex>
          <Flex justifyContent="center" w="full" py="16">
            <Button
              onClick={openModal}
              borderRadius="45px"
              color="white"
              w="sm"
              bg="blue.900"
              textTransform={"uppercase"}
            >
              {"Upload AVO documents"}
            </Button>
          </Flex>
        </ScaleFade>
      </Center>
      <ConfirmationModal
        id="modal-confirmation"
        question={"¿Are you sure to keep this documentation?"}
        dataToConfirm={
          "You can modify it from the menu, in any case ;)"
        }
        isOpen={isModalOpen}
        handleConfirmacion={handleConfirmacion}
        onClose={closeModal}
      />
      <ModalError
        question={"One of more files are missing"}
        dataToConfirm={
          "Please enter all necessary files to complete this step."
        }
        isOpen={isOpenError}
        onClose={onCloseError}
      />
      <ModalIsLoading
        message={"Please wait while we save the documentation ;)"}
        isOpen={isCharging}
      />
    </Box>
  );
}

export default AvoDocuments;
