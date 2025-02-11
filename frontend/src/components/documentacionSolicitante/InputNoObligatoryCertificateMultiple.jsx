import {
    Stack,
    Checkbox,
    Box,
    useDisclosure,
    Text,
    Flex,
    Collapse,
    Center,
    SimpleGrid,
    Grid,
    GridItem,
  } from "@chakra-ui/react";
  import InputFile from "./InputFile";
import { useEffect, useState } from "react";

function InputNoObligatoryCertificateMultiple({ confirmationQuestion, action, handleOnInput, handleCheckbox, index }) {
    const [isChecked, setIsChecked] = useState(false);
  
    const toggleCheckbox = () => {
      setIsChecked(!isChecked);
      handleCheckbox((prevChecks) => { //Here I take the checklist and set the change in the index value
        const newChecks = [...prevChecks];
        newChecks[index] = !isChecked;
        return newChecks;
      });
    };
  
    return (
      <Flex color="blue.900" flexDirection="column" justifyContent="space-between">
        <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)" gap={1}>
          <GridItem colSpan={1}>
            <Text overflowWrap={"anywhere"} textAlign="center">
              {confirmationQuestion}
            </Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Checkbox isChecked={isChecked} onChange={toggleCheckbox}>
              {"Sí"}
            </Checkbox>
            <Checkbox isChecked={!isChecked} onChange={toggleCheckbox}>
              No
            </Checkbox>
          </GridItem>
          <GridItem colSpan={2}>
            {isChecked && (
              <InputFile handleOnInput={handleOnInput} action={action} />
            )}
          </GridItem>
        </Grid>
      </Flex>
    );
  }

  export default InputNoObligatoryCertificateMultiple