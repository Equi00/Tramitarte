import {
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  Box,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Button,
  Checkbox,
  useDisclosure,
  FormErrorMessage,
  Select,
  FormHelperText,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { CalendarIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useContext, useState, useEffect } from "react";

import ConfirmationModal from "../components/modals/ConfirmationModal";
import ModalIsLoading from "../components/modals/ModalIsLoading";
import processService from "../services/ProcessService";
import { ProcessContext } from "../App";
import ModalError from "../components/modals/ModalError";

function AVORequest() {
  const days = [...Array(31).keys()].map((i) => i + 1);
  const months = [...Array(12).keys()].map((i) => i + 1);
  const years = [...Array(new Date().getFullYear()).keys()]
    .map((i) => i + 1000)
    .filter((i) => i < 2023 - 18);

  const navigate = useNavigate();
  const { userId } = useParams();
  const processContext = useContext(ProcessContext);
  const handleBack = () => navigate(-1);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
  let [AVOName, setAVOName] = useState("");
  let [AVOSurname, setAVOSurname] = useState("");
  const [birthdate, setBirthdate] = useState({
    day: "1",
    month: "10",
    year: "1995",
  });
  const [AVOGender, setAVOGender] = useState("Female");

  const handleOnChangeAVOName = (e) => {
    setAVOName(e.target.value);
  };

  const handleOnChangeAVOSurname = (e) => {
    setAVOSurname(e.target.value);
  };

  const handleOnChangeAVOBirthdate = (birthdate) => {
    setBirthdate(birthdate);
  };

  const handleOnChangeSexRadioButton = (e) => {
    setAVOGender(e.target.name);
    setIsChecked(!isChecked);
  };

  const handleOnClickSubmitAVO = () => {
    if (isSurnameValid() && isNameValid() && AVOSurname.trim() && AVOName.trim()) {
      onOpen1();
    }else{
      onOpen2()
    }
  };

  const isSurnameValid = () => {
    return !AVOSurname.match(/\d+/g)
  };

  const isNameValid = () => {
    return !AVOName.match(/\d+/g)
  };

  const handleConfirmation = () => {
    setIsLoading(true);
  
    processService
      .searchProcessByUserId(userId)
      .then((response) => {
        const process = response.data;
        const idProcess = process.id; 
  
        return processService.uploadAVO(
          {
            first_name: AVOName,
            last_name: AVOSurname,
            birth_date: `${birthdate.year}-${String(birthdate.month).padStart(2, "0")}-${String(birthdate.day).padStart(2, "0")}`,
            gender: AVOGender,
          },
          idProcess
        );
      })
      .then((response) => {
        setIsLoading(false);
        navigate(`/home/requester/${userId}`);
        return response;
      })
      .catch((error) => navigate("/network-error"));
  };

  return (
    <Box minH="100%" bg="blue.50">
      <Flex w="100%" p=".8rem" justify="space-between">
        <IconButton
          onClick={() => handleBack()}
          color="blue.900"
          bg="white"
          boxShadow={"0px 4px 10px 3px rgba(26, 54, 93, .5)"}
          borderRadius="50%"
          size="lg"
          icon={<ArrowBack />}
        />
      </Flex>
      <Center p="1.4rem">
        <Center
          w="sm"
          borderRadius="45px"
          py=".8rem"
          bg="blue.900"
          color="white"
          fontWeight={"700"}
          overflowWrap={'break-word'}
        >
          {processContext.code}
        </Center>
      </Center>
      <Center p=".8rem">
        <Box
          borderTopRadius="20px"
          borderBottomRadius="30px"
          border=".1rem solid rgba(26, 54, 93, 1)"
          w="5xl"
        >
          <Box p="1rem">
            <Center
              borderRadius="15px"
              p=".8rem"
              bg="teal.600"
              color="white"
              fontWeight={"700"}
            >
              {"AVO SEARCHING"}
            </Center>
          </Box>
          <Center>
            <Text textAlign="center" p=".8rem">
            Fill in the details of your Italian ancestor who emigrated
            </Text>
          </Center>
          <Accordion allowToggle w="100%" maxW="100%">
            <AccordionItem borderRadius="45px">
              <h2>
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  bg="teal.700"
                  color="white"
                  justifyContent="space-between"
                  w="full"
                  _hover={{ bg: "teal.700" }}
                  _expanded={{ display: "flex" }}
                  borderRadius="45px"
                >
                  <Text fontWeight={"700"}>COMPLETE REQUEST</Text>
                  <ChevronDownIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <FormControl
                  isInvalid={!isNameValid()}
                  isRequired
                  py="2%"
                  color="blue.900"
                  id="avo-name"
                >
                  <FormLabel>Name</FormLabel>
                  <Input
                    h={12}
                    borderRadius="25px"
                    border="1px solid rgba(26, 54, 93, 1)"
                    type="text"
                    placeholder="Name..."
                    value={AVOName}
                    onInput={handleOnChangeAVOName}
                  />
                  {!isNameValid() && (
                    <FormErrorMessage>
                      Only letters are allowed.
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={!isSurnameValid()}
                  isRequired
                  py="2%"
                  color="blue.900"
                  id="avo-surname"
                >
                  <FormLabel>Surname</FormLabel>
                  <Input
                    value={AVOSurname}
                    onInput={handleOnChangeAVOSurname}
                    onChange={handleOnChangeAVOSurname}
                    h={12}
                    borderRadius="25px"
                    border="1px solid rgba(26, 54, 93, 1)"
                    type="text"
                    placeholder="Surname..."
                  />
                  {!isSurnameValid() && (
                    <FormErrorMessage>Only letters are allowed.</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isRequired
                  py="2%"
                  color="blue.900"
                  id="avo-birthdate"
                >
                  <FormLabel>Birthdate</FormLabel>
                  <InputGroup
                    borderRadius="25px"
                    border="1px solid rgba(26, 54, 93, 1)"
                    alignItems="center"
                    p="2.5"
                  >
                    <Flex justify="space-evenly" w="80%" pl="1rem">
                      <Select
                        value={birthdate.day}
                        textAlign="center"
                        variant="unstyled"
                        icon={""}
                        size="md"
                        onChange={(e) => {
                          handleOnChangeAVOBirthdate({
                            year: birthdate.year,
                            month: birthdate.month,
                            day: e.target.value,
                          });
                        }}
                      >
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={birthdate.month}
                        textAlign="center"
                        variant="unstyled"
                        icon={""}
                        size="md"
                        onChange={(e) =>
                          handleOnChangeAVOBirthdate({
                            year: birthdate.year,
                            month: e.target.value,
                            day: birthdate.day,
                          })
                        }
                      >
                        {months.map((month, index) => (
                          <option key={index} value={month}>
                            {month}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={birthdate.year}
                        textAlign="center"
                        variant="unstyled"
                        icon={""}
                        size="auto"
                        onChange={(e) =>
                          handleOnChangeAVOBirthdate({
                            year: e.target.value,
                            month: birthdate.month,
                            day: birthdate.day,
                          })
                        }
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                      <InputRightElement>
                        <CalendarIcon
                          color="blue.800"
                          boxSize={10}
                          pt=".2rem"
                          pr=".8rem"
                        />
                      </InputRightElement>
                    </Flex>
                  </InputGroup>
                  <FormHelperText color="blue.600">
                  Your AVO's date of birth
                  </FormHelperText>
                </FormControl>
                <FormControl isRequired py="2%" color="blue.900" id="sexo-avo">
                  <FormLabel>Biological sex</FormLabel>
                  <Checkbox
                    colorScheme="teal"
                    color="blue.900"
                    p=".4rem"
                    isChecked={!isChecked}
                    onChange={(e) => handleOnChangeSexRadioButton(e)}
                    name={"Female"}
                  >
                    Female
                  </Checkbox>
                  <Checkbox
                    colorScheme="teal"
                    color="blue.900"
                    p=".4rem"
                    name={"Male"}
                    isChecked={isChecked}
                    onChange={(e) => handleOnChangeSexRadioButton(e)}
                  >
                    Male
                  </Checkbox>
                </FormControl>
                <Center py="4">
                  <Button
                    borderRadius="45px"
                    w="full"
                    p=".4rem"
                    fontSize="xl"
                    bg="teal.600"
                    color="white"
                    fontWeight={"700"}
                    boxShadow={"0px 0px 8px 4px rgba(0, 43, 91, 0.2)"}
                    onClick={() => handleOnClickSubmitAVO()}
                    _hover={{
                      bg: "teal.500",
                    }}
                  >
                    {"UPLOAD AVO"}
                  </Button>
                </Center>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Center>
      <ConfirmationModal
        question={"Are you sure you want to upload this data from your AVO?"}
        dataToConfirm={
          "In any case, you can modify them from your profile ;)"
        }
        isOpen={isOpen1}
        onClose={onClose1}
        handleConfirmation={() => handleConfirmation()}
      />
      <ModalError
        question={"The data entered is not correct."}
        dataToConfirm={
          "Please enter all data correctly"
        }
        isOpen={isOpen2}
        onClose={onClose2}
      />
      <ModalIsLoading
        message={"Please wait while we save your AVO data... ;)"}
        isOpen={isLoading}
      />
    </Box>
  );
}

export default AVORequest;
