import { CalendarIcon } from "@chakra-ui/icons";
import processService from "../services/ProcessService";
import {
  Box,
  Flex,
  VStack,
  Avatar,
  IconButton,
  Center,
  Heading,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Checkbox,
  Select,
  FormHelperText,
  Button
} from "@chakra-ui/react";
import { AccountCircle, ArrowBack, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {useState,useEffect} from "react"
import WarningCard from "../components/cards/WarningCard"


function AvoProfile() {
  const days = [...Array(31).keys()].map((i) => i + 1);
  const months = [...Array(12).keys()].map((i) => i + 1);
  const years = [...Array(new Date().getFullYear()).keys()]
    .map((i) => i + 1000)
    .filter((i) => i < 2023 - 18);

  const navigate = useNavigate();
  const [avoData, setAvoData] = useState() 
  const [avatar, setAvatar]=useState()
  const [edit,setEdit]= useState(false)
  const [editFirstName, setEditFirstName]=useState("")
  const [editLastName, setEditLastName]=useState("")
  const [isChecked, setIsChecked] = useState(false);
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const handleOnChangeSexRadioButton = (e) => {
    setGender(e.target.name)
    setIsChecked(!isChecked);
  };
  
  const handleOnChangeAVOBirthdate = (birthdate) => {
    setBirthdate(birthdate);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = async () => {
    let body={
      "id":avoData.id,
      "first_name":editFirstName,
      "last_name":editLastName,
      "birth_date":`${birthdate.year}-${String(birthdate.month).padStart(2, "0")}-${String(birthdate.day).padStart(2, "0")}`,
      "gender":gender
    }
    if(body.first_name === ""){
      body.first_name = avoData.first_name
    }
    if(body.last_name === ""){
      body.last_name = avoData.last_name
    }
    if(body.gender === ""){
      body.gender = avoData.gender
    }
    let updatedAVO = await processService.updateAVOData(body)
    setAvoData(updatedAVO)
    fetchData();
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const handleBack = () => navigate(-1);

  const fetchData = async () => {
      try{ 
          const avoData=await processService.getAVOData(JSON.parse(window.localStorage.getItem('loggedUser')).id);
          setAvoData(avoData)
          if(avoData.gender === "Male"){setAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTujnrocNopBoCYAhK3G50mc6qYWSV4c8h6Gg&usqp=CAU")}
          else{setAvatar("https://img.freepik.com/vector-gratis/plantilla-etiqueta-cara-icono-emoji-anciana_1308-58444.jpg?w=2000")}
    } catch (error) {
        console.error('Error getting data from avo:', error);
      }
  }

  useEffect(() => {
    fetchData();
  }, [avoData])

  useEffect(() => {
    if (avoData) {
      const [year, month, day] = avoData.birth_date.split("-");
      setBirthdate({
        day: String(parseInt(day, 10)),
        month: String(parseInt(month, 10)),
        year: year,
      });
      setGender(avoData.gender);
      setEditFirstName(avoData.first_name);
      setEditLastName(avoData.last_name);
      if (avoData.gender === "Male"){
        setIsChecked(true);
      }
    }
  }, []); 
  
  return (
    <Box minH="100%" h="100%" p="3%" bg="teal.200">
      {avoData ? 
        <Flex minH="100%" bg="whiteAlpha.700" borderRadius="20px">
        <VStack w="100%">
        <Flex w="100%" p=".8rem" justify="space-between">
                    <IconButton
                      onClick={() => handleBack()}
                      color="black"
                      bg="white"
                      borderRadius="50%"
                      size="lg"
                      icon={<ArrowBack />}
                    />
                    <IconButton
                      onClick={() => handleEdit() }
                      color="blue.900"
                      borderRadius="50%"
                      size="lg"
                      icon={<Edit />}
                    />
                  </Flex>
          <Flex py="2%" w="90%" justifyContent="space-around">
            <Avatar
              size="2xl"
              name="Segun Adebayo"
              src={avatar}
            />
            <Center>
            <Box>
              <Heading color="blue.900" as="h1" size="xl" paddingLeft={"15px"}>
                Name:
              </Heading>
              {edit? (
                <>
                <input 
                    type="text"
                    value={editFirstName}
                    placeholder="Enter the first name"
                    onChange={(e) => setEditFirstName(e.target.value)}
                    style={{
                      background: 'white',
                      borderRadius:"5px",
                      color: 'black',
                      margin:"5px",
                      fontSize: "14px"
                    }}
                  />
                  <input 
                    type="text"
                    value={editLastName}
                    placeholder="Enter the last name"
                    onChange={(e) => setEditLastName(e.target.value)}
                    style={{
                      background: 'white',
                      borderRadius:"5px",
                      color: 'black',
                      fontSize: "14px"
                    }}
                  />
                </>
                  ):(
                    <Heading color="blue.900" as="h1" size="xl" paddingLeft={"15px"}>
                      {avoData?.first_name} {avoData?.last_name} 
                    </Heading>
                  )}
              </Box>
            </Center>
          </Flex>
          <Wrap py="5%" color="blue.900" justifyContent="center">
            <WrapItem w="sm">
              <Box justifyContent="center" marginRight="2.4rem">
                <AccountCircle size="lg" />
              </Box>
              {edit? (
              <>
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
              </>
                ):(
                  <>
                  <Heading size="md">Gender:</Heading>
                  <Heading size="md" pl={"2"}>{avoData?.gender}</Heading>
                  </>
                )}
            </WrapItem>
            {edit? (
              <>
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
              </>
            ):(
            <WrapItem w="sm" flexDir={"row"}>
              <Box flexDir={"row"}>
              <Heading size="md">Birthdate:</Heading>
                <Box justifyContent="center" marginRight="2.4rem">
                  <CalendarIcon />
                </Box>
                <Heading size="md">{avoData?.birth_date}</Heading>
              </Box>
            </WrapItem>
            )}
          </Wrap>
          {edit? ( <><Flex  w="90%" justifyContent="space-around" >
            <Button
              onClick={() => handleSave()}
              borderRadius="45px"
              color="white"
              w="40%"
              bg="blue.900"
              py="2%"
            >
              {"Save"}
            </Button>
              <Button
              onClick={() => handleCancel()}
              borderRadius="45px"
              color="white"
              w="40%"
              bg="teal.500"
                        >
              {"Cancel"}
            </Button></Flex></>):<></>}
          
        </VStack>
      </Flex>
      :
      <>
        <Flex w="100%" p=".8rem" justify="space-between">
          <IconButton
            onClick={() => handleBack()}
            color="black"
            bg="white"
            borderRadius="50%"
            size="lg"
            icon={<ArrowBack />}
          />
        </Flex>
        <Box h='calc(85vh)' alignContent={"center"}><WarningCard text={"No AVO Available"}/></Box>
      </>
      }
    </Box>
  );
}

export default AvoProfile;
