import { ReactNode } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";

const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }) => {
  return (
    <Heading color="teal.600" as={"h3"} fontSize={"xl"}>
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("blue.700", "white")}
      fontSize={"sm"}
    >
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({ src, name, title }) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text color={useColorModeValue("blue.700", "white")} fontWeight={600}>
          {name}
        </Text>
        <Text fontSize={"sm"} color={useColorModeValue("blue.700", "white")}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function Testimonnials() {
  return (
    <Box id="testimonials" bg={useColorModeValue("white", "gray.700")}>
      <Container maxW={"8xl"} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={"center"}>
          <Heading color="teal.600">{`¿Qué dicen nuestros clientes?`}</Heading>
          <Text>
            {
              "¡Fijate sus comentarios! Todos nuestros clientes terminan muy contentos con nuestro trabajo."
            }
          </Text>
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>
                {'"Respuestas en el acto"'}
              </TestimonialHeading>
              <TestimonialText>
                {`
                Yo empecé a usar la aplicación sin saber nada sobre mis ancestros y el trámite. Lo terminé en tiempo récord 
                y con mucha contención del lado de la aplicación ;)"
                `}
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://plus.unsplash.com/premium_photo-1675034393500-dc5fe64b527a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              }
              name={"Roberta Fritzenbalden"}
              title={"San Miguel de Tucumán, Tucumán"}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>
                {'"Me ahorró mucha plata"'}
              </TestimonialHeading>
              <TestimonialText>
                {`"Venía intentando con varias consultoras, y con varias de ellas tuve que dejar el trámite, por falta de respuesta.
                Que me faltaban docs, que no podían asesorarme más... Con la aplicación llegué a centralizar todo, y lo mejor, contactar a un traductor
                directamente, alquien que yo hubiera evaluado y autorizado a ver mis documentos personales. ¡De 10!"`}
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              }
              name={"Carolina López"}
              title={"San Martín, Buenos Aires"}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>"¡Todo ordenado!"</TestimonialHeading>
              <TestimonialText>
                {`"Empecé a usar la app después de varias veces de intentar con otras consultoras. A pesar de que el trámite lo finalicé con una consultora, usé la aplicación como backup de
                toda la documentación que necesitaba. Quería manejar mis documentos y no dejarlos en manos de cualquiera, ¡y eso lo hice con la app!"`}
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://plus.unsplash.com/premium_photo-1687294575611-e510edf7f5ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              }
              name={"Estéban Echeverría"}
              title={"Rawson, Chubut"}
            />
          </Testimonial>
        </Stack>
      </Container>
    </Box>
  );
}
