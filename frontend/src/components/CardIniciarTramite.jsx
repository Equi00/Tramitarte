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

import ModalConfirmacion from "./ConfirmationModal";
import tramiteService from "../services/TramiteService";
import { useNavigate, useParams } from "react-router";
import { useState, useCallback } from "react";
import ModalIsLoading from "./ModalIsLoading";

function CardIniciarTramite() {
  const navigate = useNavigate();
  const { idUsuario } = useParams();
  const [estaCargando, setEstaCargando] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmacion = useCallback(() => {
    setEstaCargando(true);
    return tramiteService.guardarTramite(idUsuario)
      .then((response) => {
        setEstaCargando(false);
        console.log(response);
        onClose();
        navigate(0);
        navigate(`/home/solicitante/${idUsuario}`, { replace: true });
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
          <Heading textAlign="center" size="md">{"Aún no iniciaste tu trámite"}</Heading>
        </CardHeader>
        <CardBody align="center">
          <Text>{"¡Inicialo acá y conseguí tu ciudadanía!"}</Text>
        </CardBody>
        <CardFooter w="100%">
          <Button
            onClick={onOpen}
            borderRadius="45px"
            color="white"
            w="100%"
            bg="red.900"
          >
            {"Iniciar trámite"}
          </Button>
        </CardFooter>
      </Card>
      <ModalConfirmacion
        pregunta={'¿Estás seguro de iniciar el trámite?'}
        datoAConfirmar={'Podés darlo de baja en cualquier momento luego de iniciado.'}
        isOpen={isOpen}
        handleConfirmacion={handleConfirmacion}
        onClose={onClose}
      />
      <ModalIsLoading
        mensaje={"Esperanos mientras iniciamos tu trámite ;)"}
        isOpen={estaCargando}
      />
    </Flex>
  );
}

export default CardIniciarTramite;
