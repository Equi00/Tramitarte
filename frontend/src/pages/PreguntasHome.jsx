import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

export default function PreguntasHome() {
  return (
    <Accordion
      bg="white"
      id="preguntas-frecuentes"
      allowMultiple
      w="full"
      maxW="100%"
      pb={8}
    >
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          bg="white"
          color="teal.600"
          borderColor="teal.200"
          justifyContent="space-between"
          p={4}
          w="full"
          _hover={{ bg: "teal.50" }}
        >
          <Text as={"b"} fontSize="xl">
            {"¿Cómo funciona?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`
              Al iniciar sesión en la aplicación, se te indicará cómo iniciar tu trámite de ciudadanía italiana. 
              Al iniciarlo, te vamos a ir indicando qué buscar y subir a la aplicación, para avanzar con el trámite y llegar a tener tu carpeta a presentar al Apostillado de la Haya y al Consulado más cercano que tengas.
              ¡En tiempo récord vas a ser ciudadano italiano!
              `}
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          bg="white"
          color="teal.600"
          borderColor="teal.200"
          _hover={{ bg: "teal.50" }}
          alignItems="center"
          justifyContent="space-between"
          p={4}
        >
          <Text as={"b"} fontSize="xl">
            {"¿Cuánto tiempo tarda?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {`Según qué tan disponible tengas la documentación requerida, es que te llevará más o menos tiempo el trámite.
        El promedio de finalización de dossier (la carpeta con toda la documentación necesaria), es de 3 meses. En cualquier caso, el mejor beneficio que te ofrecemos
        es tener todo lo que necesitás y vas juntando en un lugar centralizado al cual vos tengas acceso.`}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="white"
          color="teal.600"
          borderColor="teal.200"
          _hover={{ bg: "teal.50" }}
          p={4}
        >
          <Text as="b" fontSize="xl">
            {"¿Qué necesito para empezar?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`Si sos nuevo en este proceso, no te preocupes, te iremos indicando cómo aprender sobre los trámites de
            ciudadanía. De antemano, te informamos que como principal vas a necesitar contar con información de tu AVO 
            (antepasado que emigró) para ingresar los datos que necesitás y verificar que sos un descenciente. `}
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="white"
          color="teal.600"
          p={4}
          _hover={{ bg: "teal.50" }}
        >
          <Text as="b" fontSize="xl">
            {"¿Por qué elegir Tramitarte?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`Desde nuestrado lado, tenemos basta experiencia acompañando a
             nuestros clientes en el proceso de trámite de ciudadaní.
            ¡Contá con nosotros por cualquier consulta que tengas ;).`}
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
