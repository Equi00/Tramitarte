import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  Link,
} from "@chakra-ui/react";

import { ExternalLinkIcon } from "@chakra-ui/icons";

import { ChevronDownIcon } from "@chakra-ui/icons";
import Map from "./Map";
import { useRef, useState } from "react";
import MapFamilySearch from "./MapFamilySearch";
import MapTranslators from "./MapTranslators";

export default function Faq() {
  const [onOpenMap1, onToggleMap1] = useState(false)
  const [onOpenMap2, onToggleMap2] = useState(false)
  const [onOpenMap3, onToggleMap3] = useState(false)

  const renderMap1 = () => {
    setTimeout(() => {
      onToggleMap1(!onOpenMap1);
    }, 1);
  }

  const renderMap2 = () => {
    setTimeout(() => {
      onToggleMap2(!onOpenMap2);
    }, 1);
  }

  const renderMap3 = () => {
    setTimeout(() => {
      onToggleMap3(!onOpenMap2);
    }, 1);
  }

  return (
    <Accordion
      bg="white"
      id="preguntas-frecuentes"
      allowMultiple
      w="100%"
      maxW="100%"
    >
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          bg="teal.300"
          color="white"
          justifyContent="space-between"
          p={4}
          w="full"
          _hover={{ bg: "teal.300" }}
        >
          <Text fontSize="md">{"How do I know what my AVO is?"}</Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
          You can search for your AVO (Italian ancestor who emigrated) at:
            <Link
              color="teal.400"
              href="https://www.familysearch.org/"
              isExternal
            >
              Family Search <ExternalLinkIcon mx="2px" />
            </Link>
            &nbsp;or&nbsp;
            <Link color="teal.400" href="https://www.myheritage.es/" isExternal>
              My Heritage <ExternalLinkIcon mx="2px" />
            </Link>
            <br />
            Once the search is complete, load the data in Step 1
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          bg="teal.300"
          color="white"
          alignItems="center"
          justifyContent="space-between"
          p={4}
          _hover={{ bg: "teal.300" }}
          onClick={renderMap1}
        >
          <Text fontSize="md">
            {"Where is the nearest Italian consulate?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Map bool={onOpenMap1} />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          bg="teal.300"
          color="white"
          alignItems="center"
          justifyContent="space-between"
          p={4}
          _hover={{ bg: "teal.300" }}
          onClick={renderMap2}
        >
          <Text fontSize="md">
            {"Where is the nearest Family Search center?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <MapFamilySearch bool={onOpenMap2} />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          bg="teal.300"
          color="white"
          alignItems="center"
          justifyContent="space-between"
          p={4}
          _hover={{ bg: "teal.300" }}
          onClick={renderMap3}
        >
          <Text fontSize="md">
            {"Where is the nearest Translator?"}
          </Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <MapTranslators bool={onOpenMap3} />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="teal.300"
          color="white"
          p={4}
          _hover={{ bg: "teal.300" }}
        >
          <Text fontSize="md">{'How do I request my AVO birth certificate?'}</Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`If the father was born before 1861, the certificate is a Baptismal certificate and must be requested in the Parish where he was born. 
            If he was born after, it is a municipal certificate and must be requested in the corresponding municipality..`}
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="teal.300"
          color="white"
          p={4}
          _hover={{ bg: "teal.300" }}
        >
          <Text fontSize="md">{'Where can I get the email and phone number of the municipality where I was born?'}</Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
          On the official site of the commune it can appear as:
            <p>1- Office Anagrafe</p>
            <p>2- Civil State Office</p>
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton
          display="flex"
          alignItems="center"
          bg="teal.300"
          color="white"
          justifyContent="space-between"
          p={4}
          _hover={{ bg: "teal.300" }}
        >
          <Text fontSize="md">{'What certificates do I need?'}</Text>
          <ChevronDownIcon fontSize="24px" />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Text>
            {`You need the birth certificate of your AVO, and all the
              direct ancestors up to you. If you got married in Italy,
              you will need to have the marriage certificate.`}
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
