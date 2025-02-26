import {
  Box,
  Center,
  Flex,
  IconButton,
  Text,
  Wrap,
  WrapItem,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import userService from "../services/UserService";
import WarningCard from "../components/cards/WarningCard";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

function TranslationRequests() {
  const navigate = useNavigate();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [savedRequest, setSavedRequest] = useState()
  const [requests, setRequests] = useState([]) 
  const { userId } = useParams();
  const [requesterNames, setRequesterNames] = useState({});

  const handleBack = () => {
    navigate(-1);
  };

  const openConfirmationModal = (requesterHooked) => {
    setSavedRequest(requesterHooked)
    setIsConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
  };

  const openCancelModal = (requesterHooked) => {
    setSavedRequest(requesterHooked)
    setIsCancelOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelOpen(false);
  };

  const soli = async () =>{
    let requests = await userService.searchTranslateRequests(userId)
    setRequests(requests)
  }

  const sendAcceptNotification = async () => {
    let user = await userService.getById(userId)
    await userService.createTranslationTask(savedRequest.requester_id, userId)
    await userService.sendAlert(userId, savedRequest.requester_id, "Translator "+user.name+" has accepted your request")
    await userService.deleteTranslationRequest(savedRequest.id)
    closeConfirmationModal()
  }

  const sendCancelNotification = async () => {
    let user = await userService.getById(userId)
    await userService.deleteTranslationRequest(savedRequest.id)
    await userService.sendAlert(userId, savedRequest.requester_id, "Translator "+user.name+" has rejected your request")
    closeCancelModal()
  }

  useEffect(() => {
    const fetchRequesterNames = async () => {
      let names = {};
      for (let request of requests) {
        let user = await userService.getById(request.requester_id);
        console.log(user.data)
        names[request.requester_id] = user.data.name;
      }
      setRequesterNames(names);
    };
  
    if (requests.length > 0) {
      fetchRequesterNames();
    }
  }, [requests]);
  

  useEffect(() => {
    soli()
  }, [requests])

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
      </Flex>
      <Wrap
        spacing={"1.2rem"}
        bg="teal.200"
        p="1.4rem"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {requests.length === 0 ? <Box h='calc(80vh)' alignContent={"center"}><WarningCard text={"There are no translation requests"}/></Box> :
        requests.map((request, index) => (
          <WrapItem
            w="sm"
            borderRadius="45px"
            bg="whiteAlpha.800"
            key={index}
            border="2px solid"
            borderColor="blue.900"
          >
            <Flex justifyContent="flex-end" h="100%" w="20%" flexBasis="30%">
              <IconButton
                color="white"
                bg="teal.400"
                h="100%"
                w="100%"
                borderLeftRadius="43px"
                borderRightRadius="0"
                onClick={() => openConfirmationModal(request)}
                icon={<CheckIcon />}
              />
            </Flex>
            <Center h="100%" flexBasis="50%">
              <VStack alignItems="center" justifyContent="center">
                <Heading textAlign="center" fontSize={15}>{requesterNames[request.requester_id] || "Loading..."}</Heading>
                <Text>{"Ask for your services"}</Text>
              </VStack>
            </Center>
            <Flex justifyContent="flex-end" h="100%" w="20%" flexBasis="30%">
              <IconButton
                color="white"
                bg="red.500"
                h="100%"
                w="100%"
                borderRightRadius="43px"
                borderLeftRadius="0"
                onClick={() => openCancelModal(request)}
                icon={<CloseIcon />}
              />
            </Flex>
          </WrapItem>
        ))}
      </Wrap>
      <ConfirmationModal
              id="modal-confirmation"
              question={savedRequest && "Are you sure you want to accept the order "+requesterNames[savedRequest.requester_id]+"?"}
              isOpen={isConfirmationOpen}
              handleConfirmation={sendAcceptNotification}
              onClose={closeConfirmationModal}
      />
      <ConfirmationModal
              id="modal-confirmation"
              question={savedRequest && "Are you sure you want to reject the request of "+requesterNames[savedRequest.requester_id]+"?"}
              isOpen={isCancelOpen}
              handleConfirmation={sendCancelNotification}
              onClose={closeCancelModal}
      />
            
    </Box>
  );
}

export default TranslationRequests;
