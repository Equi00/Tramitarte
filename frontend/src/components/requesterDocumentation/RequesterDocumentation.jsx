import { useState } from "react";
import InputFile from "../inputs/InputFile";
import { Box, Center, useDisclosure } from "@chakra-ui/react";
import processService from "../../services/ProcessService";
import ModalError from "../modals/ModalError";
import ModalIsLoading from "../modals/ModalIsLoading";

function RequesterDocumentation({
  addRequesterDocumentation,
}) {
  const [name1, setName1] = useState("dni front (.jpg)")
  const [name2, setName2] = useState("dni back (.jpg)")
  const [name3, setName3] = useState("birth certificate (.pdf)")
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isOpenError2, onOpen: onOpenError2, onClose: onCloseError2 } = useDisclosure();

  const handleInputDniFront = async (e) => {
    let file = e.target.files[0]
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsLoading(true)
      if(extension === "jpg" || extension === "png"){
        let verification = await processService.isDNIFront(file)
        if(verification === false){
          setIsLoading(false)
          onOpen()
        }else{
          addRequesterDocumentation({
          id: "dni-front",
          file: file,
        });
        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        setName1(shorterName)
        setIsLoading(false)
        }
      }else{
        setIsLoading(false)
        onOpenError()
      }
    }
  };

  const handleInputDniBack = async (e) => {
    let file = e.target.files[0]
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsLoading(true)
      if(extension === "jpg" || extension === "png"){
        let verification = await processService.isDNIBack(file)
        if(verification === false){
          setIsLoading(false)
          onOpen()
        }else{
          addRequesterDocumentation({
          id: "dni-back",
          file: file,
        });
        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        setName2(shorterName)
        setIsLoading(false)
        }
      }else{
        setIsLoading(false)
        onOpenError()
      }
    }
    
  };

  const handleInputBirthCertificate = async (e) => {
    let file = e.target.files[0]
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsLoading(true)
      if(extension === "pdf"){
        let verification = await processService.isBirthCertificate(file)
        if(verification === false){
          setIsLoading(false)
          onOpen()
        }else{
          addRequesterDocumentation({
          id: "birth-certificate",
          file: file,
        });
        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        setName3(shorterName)
        setIsLoading(false)
        }
      }else{
        setIsLoading(false)
        onOpenError2()
      }
    }
  };

  return (
    <Box w="100%" borderRadius="30px" bg="teal.100">
      <Center flexWrap="wrap" gap={2} w="100%" p="2%" flexDir={"column"}>
        <InputFile handleOnInput={handleInputDniFront} action={name1} />
        <InputFile handleOnInput={handleInputDniBack} action={name2} />
        <InputFile handleOnInput={handleInputBirthCertificate} action={name3} />
      </Center>
      <ModalError
        question={"The selected file is not valid."}
        dataToConfirm={
          "Please choose the appropriate file to continue. If the file is correct, please try again with better resolution and clearer images."
        }
        isOpen={isOpen}
        onClose={onClose}
      />
      <ModalIsLoading
        message={"Please wait while we save the documentation ;)"}
        isOpen={isLoading}
      />
      <ModalError
                question={"The file extension is not valid"}
                dataToConfirm={
                "Please choose a file with the extension ¨.jpg¨ or ¨.png¨."
                }
                isOpen={isOpenError}
                onClose={onCloseError}
            />
      <ModalError
                question={"The file extension is not valid"}
                dataToConfirm={
                "Please choose a file with the extension ¨.pdf¨."
                }
                isOpen={isOpenError2}
                onClose={onCloseError2}
            />
    </Box>
  );
}

export default RequesterDocumentation;
