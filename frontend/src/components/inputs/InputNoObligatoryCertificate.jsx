import {
  Checkbox,
  Text,
  Flex,
  Collapse,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import InputFile from "./InputFile";

function InputNoObligatoryCertificate({ confirmationQuestion, action, handleOnInput, isOpen, onToggle }) {
  return (
    <Flex
      color="blue.900"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={1}
      >
        <GridItem colSpan={1}>
          <Text overflowWrap={"anywhere"} textAlign="center">
            {confirmationQuestion}
          </Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Checkbox isChecked={isOpen} onChange={onToggle}>
            {"Sí"}
          </Checkbox>
          <Checkbox isChecked={!isOpen} onChange={onToggle}>
            No
          </Checkbox>
        </GridItem>
        <GridItem colSpan={2}>
          <Collapse in={isOpen}>
            <InputFile handleOnInput={handleOnInput} action={action} />
          </Collapse>
        </GridItem>
      </Grid>
    </Flex>
  );
}

export default InputNoObligatoryCertificate;
