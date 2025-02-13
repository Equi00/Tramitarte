import {
  Box,
  chakra,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  ForwardToInbox,
  Instagram,
  Twitter,
  YouTube,
} from "@mui/icons-material";
import logo from "../assets/logo.png";

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function LargeWithNewsletter() {
  return (
    <Box
      bg={useColorModeValue("teal.50", "whiteAlpha.100")}
      color={useColorModeValue("teal.600", "whiteAlpha.100")}
    >
      <Container as={Stack} maxW={"full"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Image
                alt={"logo"}
                borderRadius="full"
                objectFit={"cover"}
                boxSize="50%"
                align={"center"}
                w={"20%"}
                h={"100%"}
                src={logo}
              />
            </Box>
            <Text fontSize={"sm"}>
              © 2023 Tramitarte. All rights reserved.
            </Text>
            <Stack direction={"row"} spacing={6}>
              <SocialButton label={"Twitter"} href={"#"}>
                <Twitter />
              </SocialButton>
              <SocialButton label={"YouTube"} href={"#"}>
                <YouTube />
              </SocialButton>
              <SocialButton label={"Instagram"} href={"#"}>
                <Instagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Stay up to date!</ListHeader>
            <Stack direction={"row"}>
              <Input
                placeholder={"Your email..."}
                bg={useColorModeValue("blue.100", "whiteAlpha.100")}
                border={0}
                _focus={{
                  bg: "whiteAlpha.300",
                }}
              />
              <IconButton
                bg={useColorModeValue("green.400", "green.800")}
                color={useColorModeValue("white", "gray.800")}
                _hover={{
                  bg: "green.600",
                }}
                aria-label="Subscribe"
                icon={<ForwardToInbox />}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
