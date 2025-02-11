import { InfoOutlineIcon, WarningIcon } from "@chakra-ui/icons";
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

export default function ModalAdvertencia({
  isOpen,
  handleConfirmacion,
  onClose,
  pregunta,
  datoAConfirmar,
  segundoParrafo
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
          {pregunta}
        </ModalHeader>
        <ModalBody textAlign={"center"}>
          {datoAConfirmar}
        </ModalBody>
        <ModalBody fontWeight={700} textAlign={"center"}>
          {segundoParrafo}
        </ModalBody>
        <ModalFooter justifyContent="space-evenly">
          <IconButton
            onClick={onClose}
            color={"white"}
            bg={"red.300"}
            icon={<Close />}
          />
          <IconButton
            onClick={() => handleConfirmacion()}
            bg={"teal.200"}
            icon={<Check />}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}