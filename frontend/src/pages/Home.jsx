import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import AnimatedLogo from "../components/AnimatedLogo/AnimatedLogo";
import AboutUs from "./AboutUs";
import Testimonials from "./Testimonials";
import { HashLink } from "react-router-hash-link";
import HomeFooter from "../components/HomeFooter";
import { useAuth0 } from "@auth0/auth0-react";
import QuestionsHome from "../components/QuestionsHome";

export const Blob = (props) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

function Home() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Container maxW={"5x1"}>
      <Navbar></Navbar>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        px={{ md: 28 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              color={useColorModeValue("blue.900", "blue.200")}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: useColorModeValue("teal.500", "teal.700"),
                zIndex: -1,
              }}
            >
              Apply for your citizenship!
            </Text>
            <br />
            <Text as={"span"} color={"teal.400"}>
              Online
            </Text>
          </Heading>
          <Text color={"gray.500"}>
          Citizenship procedures require several steps and
          verifications to be completed. Resolve it with us in record time!
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              onClick={()=>loginWithRedirect()}
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"red"}
              bg={"teal.400"}
              _hover={{ bg: "green.500" }}
            >
              Start my process
            </Button>
            <HashLink to="#frequently-asked-questions" smooth>
              <Button
                w="100%"
                rounded={"full"}
                size={"lg"}
                fontWeight={"normal"}
                px={6}
              >
                How does it work?
              </Button>
            </HashLink>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Blob
            w={"100%"}
            h={"150%"}
            position={"absolute"}
            top={"-20%"}
            left={0}
            zIndex={-1}
            color={useColorModeValue("teal.50", "green.400")}
          />
          <Box position={"relative"} height={"300px"} overflow={"hidden"}>
            <AnimatedLogo />
          </Box>
        </Flex>
      </Stack>
      <AboutUs />
      <Testimonials />
      <Flex justifyContent={"center"} py="8">
        <Heading color={useColorModeValue('teal.600', 'white')} as="h2" size="2xl">
        How can we help you?
        </Heading>
      </Flex>
      <Box py="2%">
        <QuestionsHome />
      </Box>
      <HomeFooter />
    </Container>
  );
}

export default Home;
