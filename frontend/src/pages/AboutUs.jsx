import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Timeline, Security, Diversity2, PriceCheck } from "@mui/icons-material";

const Feature = ({ text, icon, iconBg }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

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
        d="M239.184 439.443c-55.13-5.419-110.230-21.365-151.074-58.707C42.307 338.722-7.478 282.100.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default function AboutUs() {
  return (
    <Container id="about-us" maxW={"full"} py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Flex p="2%">
          <Image
            rounded={"md"}
            alt={"feature image"}
            src={
              "https://images.unsplash.com/photo-1573497161079-f3fd25cc6b90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            }
            objectFit={"cover"}
          />
        </Flex>
        <Stack spacing={4}>
          <Heading textAlign="center" color={useColorModeValue('teal.600', 'white')}>{`Self-management of your citizenship process`}</Heading>
          <Text pb={4} color={"gray.500"} fontSize={"lg"}>
            {`We want you to have the necessary tools to manage your citizenship
              and to be able to count on us for all the questions you have in the process. Each case is a world, and we want to be part of
              that world. You have many benefits of joining the community, among them: `}
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("teal.100", "whiteAlpha.700")}
              />
            }
          >
            <Feature
              icon={<Icon as={Timeline} color={useColorModeValue('teal.100', 'whiteAlpha.200')} w={5} h={5} />}
              iconBg={useColorModeValue("teal.600", "white")}
              text={"Time reduction by 30%"}
            />
            <Feature
              icon={
                <Icon as={PriceCheck} color={"green.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("green.100", "green.900")}
              text={"Free of charge"}
            />
            <Feature
              icon={<Icon as={Security} color={"teal.200"} w={5} h={5} />}
              iconBg={useColorModeValue("teal.600", "white")}
              text={"Security in self-management"}
            />
            <Feature
              icon={<Icon as={Diversity2} color={"whiteAlpha.800"} w={5} h={5} />}
              iconBg={useColorModeValue("blue.900", "blue.500")}
              text={"Constant accompaniment"}
            />
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
