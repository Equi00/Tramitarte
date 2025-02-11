import { Button, Input } from "@chakra-ui/react";
import { FileUpload } from "@mui/icons-material";
import { useRef } from "react";

function InputFile({ action, handleOnInput }) {
  const occultInput = useRef(null);
  const openInput = () => {
    occultInput.current.click();
  };
  return (
    <>
      <Button
        borderRadius="45px"
        color="white"
        bg="teal.300"
        _hover={{bg: "teal.200"}}
        w={{ base: '100%', md: 'auto'}}
        onClick={openInput}
        textTransform={"uppercase"}
        textAlign={"center"}
      >
        {action}
        <FileUpload />
      </Button>
      <Input id={action} onInput={handleOnInput} ref={occultInput} type="file" accept="image/*" display="none" />
    </>
  );
}

export default InputFile;
