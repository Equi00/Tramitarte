import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";

export default function ModalIsLoading({ message, isOpen, onClose }) {
  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {message}
        </ModalHeader>
        <ModalBody>
          <Spinner
            thickness="4px"
            speed="0.5s"
            emptyColor="gray.200"
            color="teal.200"
            size="xl"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
