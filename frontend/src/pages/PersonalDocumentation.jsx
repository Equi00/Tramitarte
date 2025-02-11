import {
  Box,
  Center,
  Text,
  Flex,
  IconButton,
  Button,
  useDisclosure,
  ScaleFade,
} from "@chakra-ui/react";
import { ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router";
import RequesterDocumentation from "../components/requesterDocumentation/RequesterDocumentation";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ModalIsLoading from "../components/modals/ModalIsLoading";
import processService from "../services/ProcessService";
import ModalError from "../components/modals/ModalError";

function PersonalDocumentation() {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const [requesterDocumentation, setRequesterDocumentation] = useState({
    dniFront: { name: "", file_type: "", file_base64: "" },
    dniBack: { name: "", file_type: "", file_base64: "" },
    birthCertificate: { name: "", file_type: "", file_base64: "" },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const openModal = () => {
    if(requesterDocumentation.dniFront.name === "" || requesterDocumentation.dniBack.name === "" || requesterDocumentation.birthCertificate.name === ""){
      onOpenError()
    }else{
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const completeRequesterDocumentation = async ({ id, file }) => {
      if (id === "dni-front") {
        let base64 = await fileToBase64(file);
        setRequesterDocumentation({
          dniFront: {
            name: file.name,
            file_type: "dni-front",
            file_base64: base64,
          },
          dniBack: {
            name: requesterDocumentation.dniBack.name,
            file_type: requesterDocumentation.dniBack.file_type,
            file_base64: requesterDocumentation.dniBack.file_base64,
          },
          birthCertificate: {
            name: requesterDocumentation.birthCertificate.name,
            file_type: requesterDocumentation.birthCertificate.file_type,
            file_base64:
            requesterDocumentation.birthCertificate.file_base64,
          },
        });
      }
      if (id === "dni-back") {
        let base64 = await fileToBase64(file);
        setRequesterDocumentation({
          dniFront: {
            name: requesterDocumentation.dniFront.name,
            file_type: requesterDocumentation.dniFront.file_type,
            file_base64: requesterDocumentation.dniFront.file_base64,
          },
          dniBack: {
            name: file.name,
            file_type: "dni-back",
            file_base64: base64,
          },
          birthCertificate: {
            name: requesterDocumentation.birthCertificate.name,
            file_type: requesterDocumentation.birthCertificate.file_type,
            file_base64:
            requesterDocumentation.birthCertificate.file_base64,
          },
        });
      }
      if (id === "birth-certificate") {
        let base64 = await fileToBase64(file);
        setRequesterDocumentation({
          dniFront: {
            name: requesterDocumentation.dniFront.name,
            file_type: requesterDocumentation.dniFront.file_type,
            file_base64: requesterDocumentation.dniFront.file_base64,
          },
          dniBack: {
            name: requesterDocumentation.dniBack.name,
            file_type: requesterDocumentation.dniBack.file_type,
            file_base64: requesterDocumentation.dniBack.file_base64,
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
        requesterDocumentation.dniFront,
        requesterDocumentation.dniBack,
        requesterDocumentation.birthCertificate,
      ]);
      let process = JSON.parse(window.localStorage.getItem("process"));
      try {
        let response = await processService.uploadPersonalDocumentation(
          [
            requesterDocumentation.dniFront,
            requesterDocumentation.dniBack,
            requesterDocumentation.birthCertificate,
          ],
          Number(process.id)
        );
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

      <Center flexWrap="wrap" p={{ base: '8', md: '16'}}>
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
                {"Personal Documentation"}
              </Text>
            </Flex>
            <RequesterDocumentation
              addRequesterDocumentation={
                completeRequesterDocumentation
              }
            />
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
              {"Keep personal documentation"}
            </Button>
          </Flex>
        </ScaleFade>
      </Center>
      <ConfirmationModal
        id="modal-confirmation"
        question={"Are you sure you want to save this documentation?"}
        dataToConfirm={
          "You can modify it from the menu, in any case ;)"
        }
        isOpen={isModalOpen}
        handleConfirmacion={handleConfirmacion}
        onClose={closeModal}
      />
      <ModalError
        question={"One or more files are missing"}
        dataToConfirm={
          "Please enter all necessary files to complete this step."
        }
        isOpen={isOpenError}
        onClose={onCloseError}
      />
      <ModalIsLoading
        mensaje={"Please wait while we save the documentation ;)"}
        isOpen={isCharging}
      />
    </Box>
  );
}

export default PersonalDocumentation;
