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
          <Heading color="teal.600">{`What do our customers say?`}</Heading>
          <Text>
            {
              "Check out their comments! All of our clients are very happy with our work."
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
              {'"Answers on the spot"'}
              </TestimonialHeading>
              <TestimonialText>
              {`
              I started using the app without knowing anything about my ancestors and the process. I finished it in record time
              and with a lot of support from the app side ;)"
              `}
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://plus.unsplash.com/premium_photo-1675034393500-dc5fe64b527a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              }
              name={"Roberta Fritzenbalden"}
              title={"San Miguel of Tucumán, Tucumán"}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>
              {'"It saved me a lot of money"'}
              </TestimonialHeading>
              <TestimonialText>
              {`I had been trying with several consulting firms, and with several of them I had to abandon the process, due to lack of response.
              I was missing documents, they could not advise me further... With the application I was able to centralize everything, and best of all, contact a translator
              directly, someone I had evaluated and authorized to see my personal documents. 10/10!`}
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
              <TestimonialHeading>"All in order!"</TestimonialHeading>
              <TestimonialText>
                {`I started using the app after trying several times with other consulting firms. Even though I completed the process with a consulting firm, I used the app as a backup for
                all the documentation I needed. I wanted to manage my documents and not leave them in the hands of just anyone, and I did that with the app!`}
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
