import { ArrowBack } from "@mui/icons-material";
import Faq from "../components/Faq";
import { Box, Center, Flex, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router";
function PreguntasFrecuentes() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  return (
    <Box minH="100%" bg="teal.200">
      <Flex w="100%" p=".8rem" justify="space-between">
        <IconButton
          onClick={() => handleBack()}
          color="white"
          bg="teal.600"
          borderRadius="50%"
          size="lg"
          icon={<ArrowBack />}
        />
      </Flex>
      <Center p="8%">
        <Faq />
      </Center>
    </Box>
  );
}

export default PreguntasFrecuentes;
