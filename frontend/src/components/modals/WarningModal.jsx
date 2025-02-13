import { WarningIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  IconButton,
} from "@chakra-ui/react";
import { Check, Close } from "@mui/icons-material";

export default function WarningModal({
  isOpen,
  handleConfirmation,
  onClose,
  question,
  dataToConfirm,
  secondParagraph
}) {
  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent={"center"} display={"flex"}>
        <IconButton
            color={"orange.400"}
            bg={"white"}
            borderRadius={"30px"}
            icon={<WarningIcon w={"2rem"} h={"2rem"}/>}
          />
        </ModalHeader>
        <ModalHeader justifyContent={"center"} display={"flex"}>
          {question}
        </ModalHeader>
        <ModalBody textAlign={"center"}>
          {dataToConfirm}
        </ModalBody>
        <ModalBody fontWeight={700} textAlign={"center"}>
          {secondParagraph}
        </ModalBody>
        <ModalFooter justifyContent="space-evenly">
          <IconButton
            onClick={onClose}
            color={"white"}
            bg={"red.300"}
            icon={<Close />}
          />
          <IconButton
            onClick={() => handleConfirmation()}
            bg={"teal.200"}
            icon={<Check />}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}