import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Edit } from "@mui/icons-material";
import { useRef } from "react";

function InputEdit({ action, handleOnInput }) {
    const inputOculto = useRef(null);
    const openInput = () => {
      inputOculto.current.click();
    };
    return (
      <>
        <Button
          borderRadius="45px"
          color="white"
          bg="teal.300"
          _hover={{bg: "teal.200"}}
          h={"1.5rem"}
          w={{ base: '100%', md: 'auto'}}
          onClick={openInput}
          textTransform={"uppercase"}
          textAlign={"center"}
        >
          {action}
          <Edit />
        </Button>
        <Input id={action} onInput={handleOnInput} ref={inputOculto} type="file" accept="image/*" display="none" />
      </>
    );
  }

  export default InputEdit