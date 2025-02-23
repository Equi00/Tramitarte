import {
  Box,
  Center,
  Image,
  Flex,
  IconButton,
  Text,
  Wrap,
  WrapItem,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBack, Send } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import userService from "../services/UserService";
import WarningCard from "../components/cards/WarningCard";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import ModalError from "../components/modals/ModalError";
import WarningModal from "../components/modals/WarningModal";
import processService from "../services/ProcessService";

function RegisteredTranslators() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedTranslator, setSavedTranslator] = useState()
  const [translators, setTranslators] = useState([]) 
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();
  const { isOpen: isOpenWarning, onOpen: onOpenWarning, onClose: onCloseWarning } = useDisclosure();
  const { userId } = useParams();

  const handleBack = () => {
    navigate(-1);
  };

  const openModal = async (translatorHooked) => {
    // Temporarily stores the saved translator.
    const translatorTemp = translatorHooked;
    setSavedTranslator(translatorTemp);
    try {
      let process = await processService.searchProcessByUserId(userId)
      console.log(process)
      const requests = await userService.searchRequestByRequesterAndTranslator(userId, translatorTemp.id);
      const requesterRequest = await userService.searchRequestByRequester(userId)
      if(process.data !== ""){
        if(process && (process.data.stage.descripcion === "Load Translated Documentation" || process.data.stage.descripcion === "Process Completed, click to download files")){
          if (requests && requests.length > 0) {
            onOpenError();
          } else if(requesterRequest) {
            onOpenWarning(true);
          }else{
            setIsModalOpen(true);
          }
        }else{
          onOpenError2()
        }
      }else{
        onOpenError2()
      }
    } catch (error) {
      navigate("/network-error");
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const traduct = async () =>{
    try{
      let registeredTranslators = await userService.getTranslators()
      setTranslators(registeredTranslators)
    }catch(e){
      navigate("/network-error");
    }
  }

  const deletePreviousRequest = async () => {
    await userService.deleteTranslationRequestByRequester(userId)
    sendNotificationTranslator()
    onCloseWarning()
  }

  const sendNotificationTranslator = async () => {
    try {
      console.log(userId)
      console.log(savedTranslator.id)
      let user = await userService.getById(userId)
      console.log(user)
      await userService.sendNotification(userId, savedTranslator.id, "El usuario " + user.name + " requiere de sus servicios");
    } catch (e) {
      console.log(e)
      navigate("/network-error");
    }
    closeModal();
  };

  const translatorsSearched = async (mail) =>{
    try{
      let translators = await userService.searchTranslatorByEmail(mail)
      setTranslators(translators)
    }catch(e){
      navigate("/network-error");
    }
  }

  useEffect(() => {
    traduct()
  }, [])

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
        <SearchBar funcion={translatorsSearched}/>
      </Flex>
      <Wrap
        spacing={"1.2rem"}
        bg="teal.200"
        p="1.4rem"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {translators.length === 0 ? <Box h='calc(85vh)' alignContent={"center"}><WarningCard text={"No Translators Available"}/></Box> :
        translators.map((translator, index) => (
          <WrapItem
            w="sm"
            borderRadius="45px"
            bg="whiteAlpha.800"
            key={index}
            border="2px solid"
            borderColor="blue.900"
          >
            <Center flexBasis="30%">
              <Image
                borderLeftRadius="43px"
                boxSize="40%"
                w="100%"
                objectFit={"contain"}
                src={translator.photo}
              />
            </Center>
            <Center h="100%" flexBasis="50%">
              <VStack alignItems="center" justifyContent="center">
                <Text textAlign="center" fontSize={12.5} fontWeight={700}>{translator.name}</Text>
                <Text fontWeight={700}>{translator.surname}</Text>
              </VStack>
            </Center>
            <Flex justifyContent="flex-end" h="100%" w="20%" flexBasis="30%">
              <IconButton
                color="white"
                bg="teal.400"
                h="100%"
                w="100%"
                borderRightRadius="43px"
                borderLeftRadius="0"
                onClick={() => openModal(translator)}
                icon={<Send />}
              />
            </Flex>
          </WrapItem>
        ))}
      </Wrap>
      <ConfirmationModal
              id="modal-confirmation"
              question={savedTranslator && "Are you sure you want to order the services of the translator "+savedTranslator.name+"?"}
              isOpen={isModalOpen}
              handleConfirmation={sendNotificationTranslator}
              onClose={closeModal}
            />
      <ModalError
        question={savedTranslator && "Already sent a request to the translator "+savedTranslator.nombre}
        dataToConfirm={
          "Please wait for the request to be accepted or you can ask another translator for the service."
        }
        isOpen={isOpenError}
        onClose={onCloseError}
      />
      <ModalError
        question={"You are not yet allowed to request a translation service"}
        dataToConfirm={
          "Please upload all certificates before submitting a translation request"
        }
        isOpen={isOpenError2}
        onClose={onCloseError2}
      />
      <WarningModal
        id="modal-confirmation"
        question={"¡WARNING!"}
        dataToConfirm={savedTranslator && 
          "You have already sent a translation request to another translator. Are you sure you want to send a request to "+savedTranslator.nombre+"?"}
        secondParagraph={"If you accept, your previous request will be deleted."}
        isOpen={isOpenWarning}
        handleConfirmation={deletePreviousRequest}
        onClose={onCloseWarning}
      />
      
    </Box>
  );
}

export default RegisteredTranslators;
