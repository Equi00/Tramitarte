import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

export default function QuestionsHome() {
  return (
    <Accordion
      bg="white"
      id="frequently-asked-questions"
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
            {"How does it work?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`
              When you log in to the app, you will be told how to start your Italian citizenship process.
              When you log in, we will tell you what to look for and upload to the app, to move forward with the process and have your file to present to the Hague Apostille and the nearest Consulate.
              In record time, you will become an Italian citizen!
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
            {"How long does it take?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {`Depending on how available you are with the required documentation, the process will take more or less time.
            The average time to complete a dossier (the folder with all the necessary documentation) is 3 months. In any case, the best benefit we offer you
            is having everything you need and collecting it in a centralized place to which you have access.`}
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
            {"What do I need to get started?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`If you are new to this process, don't worry, we will tell you how to learn about the citizenship procedures.
              First of all, we inform you that you will need to have information from your AVO (ancestor who emigrated) to enter the data you need and verify that you are a descendant. `}
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
            {"Why choose Tramitarte?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`From our side, we have vast experience accompanying
              our clients in the process of obtaining citizenship.
              Contact us for any questions you may have ;).`}
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
