import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  IconButton,
  Text,
  Input,
  ScaleFade,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router";
import AncestorsDocumentFile from "../components/requesterDocumentation/AncestorsDocumentFile";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ModalError from "../components/modals/ModalError";
import ModalIsLoading from "../components/modals/ModalIsLoading";
import ProcessService from "../services/ProcessService";

function AncestorsDocumentation() {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [ancestorCount, setAncestorCount] = useState(0);
  const [people, setPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ancestorDocumentation, setAncestorDocumentation] = useState([]);
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const [verified1, setVerified1] = useState([])
  const [verified2, setVerified2] = useState([])

  const handleBack = () => {
    navigate(-1);
  };

  const handleOnInput = (e) => {
    const ancestorsCount = Number(e.target.value);
    setAncestorCount(ancestorsCount);
  
    const ancestors = Array(ancestorsCount).fill({
      deathCertificate: { name: "", file_type: "", file_base64: "" },
      marriageCertificate: { name: "", file_type: "", file_base64: "" },
      birthCertificate: { name: "", file_type: "", file_base64: "" },
    });
  
    setPeople(ancestors);
    setAncestorDocumentation(ancestors);
  };

  const openModal = () => {
    if(ancestorDocumentation.some((element, index) => {
      return (
        (element.deathCertificate.name === "" && verified1[index]) ||
        (element.marriageCertificate.name === "" && verified2[index]) || 
        (element.birthCertificate.name === "")
      );
    }))
    {
      onOpenError()
    }else{
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const completeAncestorDocumentation = async ({ id, file, index }) => {
    const updatedDocumentation = [...ancestorDocumentation]; // Copy of ancestors list
    const ancestor = { ...updatedDocumentation[index] }; // Copy of specific ancestor
    let base64 = await fileToBase64(file);
  
    if (id === "death-certificate") {
      ancestor.deathCertificate = {
        name: file.name,
        file_type: "death-certificate",
        file_base64: base64,
      };
    } else if (id === "marriage-certificate") {
      ancestor.marriageCertificate = {
        name: file.name,
        file_type: "marriage-certificate",
        file_base64: base64,
      };
    } else if (id === "birth-certificate") {
      ancestor.birthCertificate = {
        name: file.name,
        file_type: "birth-certificate",
        file_base64: base64,
      };
    }
  
    updatedDocumentation[index] = ancestor; // update only the selected ancestor
    setAncestorDocumentation(updatedDocumentation);
  };

  const deleteDocuments = ({id, index}) => {
    const updatedDocumentation = [...ancestorDocumentation];
    const ancestor = { ...updatedDocumentation[index] }; 

    if (id === "death-certificate"){
      ancestor.deathCertificate = {
        name: "",
        file_type: "",
        file_base64: "",
      };
    }else if (id === "marriage-certificate"){
      ancestor.marriageCertificate = {
        name: "",
        file_type: "",
        file_base64: "",
      };
    }

    updatedDocumentation[index] = ancestor;
    setAncestorDocumentation(updatedDocumentation);
  }
  
  const handleConfirmation = async () => {
    closeModal();
    setIsLoading(true);
    console.log("acá", ancestorDocumentation);
    let process = JSON.parse(window.localStorage.getItem("process"));
    let documents = []

    try {
      ancestorDocumentation.forEach((person) => {
        if (person?.deathCertificate?.name) {
          documents.push(person.deathCertificate);
        }
        if (person?.marriageCertificate?.name) {
          documents.push(person.marriageCertificate);
        }
        if (person?.birthCertificate?.name) {
          documents.push(person.birthCertificate);
        }
      });

      let json_documents = {
        count: ancestorCount,
        documentation: documents
      };

      console.log(json_documents)

      let response = await ProcessService.uploadAncestorsDocumentation(json_documents, Number(process.id));
      console.log(documents)
      console.log(response);
      let names = documents.map((docu) => docu.name)
      console.log("document names ", names)
      setIsLoading(false);
      navigate(
        `/home/requester/${
          JSON.parse(window.localStorage.getItem("loggedUser")).id
        }`
      );
    } catch (error) {
      console.log(error);
      navigate("/network-error");
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

  useEffect(() => {
    console.log(ancestorDocumentation)
  }, [ancestorDocumentation])

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
      <Center w="full">
        <Center textAlign="center" flexWrap="wrap">
          <Collapse unmountOnExit={true} in={!isOpen}>
            <Flex
              w={{ base: "full", md: "sm" }}
              justifyContent={"center"}
              flexDirection="column"
              p="2%"
            >
              <Text
                as={"h2"}
                fontSize={"3xl"}
              >{`How many ancestors do you have until your AVO?`}</Text>
              <Text as="i">{"*not including your AVO"}</Text>
              <Box
                color="white"
                bg="teal.500"
                rounded="40px"
                shadow="md"
                pb="2%"
              >
                <Flex py="2%" px="0.8rem">
                  <Text>{"Ancestors count"}</Text>
                  <Input
                    type="number"
                    min={0}
                    value={ancestorCount}
                    onInput={handleOnInput}
                    rounded="45px"
                    _focus={{ bg: "teal.300" }}
                  ></Input>
                </Flex>
                <Center>
                  <Button
                    borderRadius="45px"
                    color="white"
                    bg="teal.300"
                    w="90%"
                    isDisabled={ancestorCount <= 0}
                    onClick={onToggle}
                    textTransform={"uppercase"}
                  >
                    {"Load number of ancestors"}
                    <ArrowForward />
                  </Button>
                </Center>
              </Box>
            </Flex>
          </Collapse>
        </Center>
      </Center>
      <Center display={isOpen ? "flex" : "none"} flexWrap="wrap" p="2%">
        <ScaleFade in={isOpen} initialScale={1}>
          <Flex
            textAlign="center"
            flexDirection="column"
            justifyContent="center"
            pb="2%"
            w={"full"}
          >
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
              {"Ancestors Documentation"}
            </Text>
            <AncestorsDocumentFile
              ancestorCount={ancestorCount}
              persons={people}
              setAncestorsDocumentation={completeAncestorDocumentation}
              deleteDocuments={deleteDocuments}
              setCheck1={setVerified1}
              setCheck2={setVerified2}
            />
          </Flex>
          <Flex w="full" py="4">
            <Button
              onClick={openModal}
              borderRadius="45px"
              color="white"
              w="100%"
              bg="blue.900"
              textTransform={"uppercase"}
            >
              {"Save documentation"}
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
        handleConfirmation={handleConfirmation}
        onClose={closeModal}
      />
      <ModalError
        question={"One or more files are missing."}
        dataToConfirm={
          "Please enter all necessary files to complete this step."
        }
        isOpen={isOpenError}
        onClose={onCloseError}
      />
      <ModalIsLoading
        message={"Please wait while we save the documentation ;)"}
        isOpen={isLoading}
      />
    </Box>
  );
}

export default AncestorsDocumentation;
