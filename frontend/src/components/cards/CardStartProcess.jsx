import {
  Card,
  Text,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";

import ConfirmationModal from "../modals/ConfirmationModal";
import processService from "../../services/ProcessService";
import { useNavigate, useParams } from "react-router";
import { useState, useCallback } from "react";
import ModalIsLoading from "../modals/ModalIsLoading";

function CardStartProcess() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmation = useCallback(() => {
    setIsLoading(true);
    return processService.saveProcess(userId)
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        onClose();
        navigate(0);
        navigate(`/home/requester/${userId}`, { replace: true });
        return response;
      })
      .catch((error) => navigate("/network-error"));
  }, []);

  return (
    <Flex py="1.2rem" justifyContent="center">
      <Card
        borderRadius="45px"
        bg="rgba(255, 255, 255, 0.8)"
        align="center"
        p="1.6rem"
      >
        <CardHeader>
          <Heading textAlign="center" size="md">{"You have not started your process yet"}</Heading>
        </CardHeader>
        <CardBody align="center">
          <Text>{"Start here and get your citizenship!"}</Text>
        </CardBody>
        <CardFooter w="100%">
          <Button
            onClick={onOpen}
            borderRadius="45px"
            color="white"
            w="100%"
            bg="red.900"
          >
            {"Start Process"}
          </Button>
        </CardFooter>
      </Card>
      <ConfirmationModal
        question={'Are you sure you want to start the process?'}
        dataToConfirm={'You can unsubscribe at any time after it has started.'}
        isOpen={isOpen}
        handleConfirmation={handleConfirmation}
        onClose={onClose}
      />
      <ModalIsLoading
        message={"Wait for us while we start your process ;)"}
        isOpen={isLoading}
      />
    </Flex>
  );
}

export default CardStartProcess;
