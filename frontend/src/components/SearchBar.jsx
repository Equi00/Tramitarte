import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
  Button,
} from "@chakra-ui/react";
import { Search } from "@mui/icons-material";
import { useState } from "react";

function SearchBar({funcion}) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    funcion(searchValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <InputGroup maxW={"md"} borderRadius={"45px"} size="sm">
      <InputLeftElement
        borderLeftRadius={"45px"}
        pointerEvents="none"
        bg="teal.400"
        color="white"
        children={<Search />}
      />
      <Input borderLeftRadius={"45px"} type="text" placeholder="Buscar..." border="1px solid" borderColor="white" value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleKeyPress}
      />
      <InputRightAddon borderRightRadius={"45px"} p={0} border="none">
        <Button
          size="sm"
          borderLeftRadius={0}
          borderRightRadius={"45px"}
          border="1px solid"
          bg='teal.400'
          color="whiteAlpha.900"
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </InputRightAddon>
    </InputGroup>
  );
}

export default SearchBar;
