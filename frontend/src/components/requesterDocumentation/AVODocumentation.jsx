import { Box, Center, useDisclosure } from "@chakra-ui/react";
import InputFile from "../inputs/InputFile";
import InputNoObligatoryCertificate from "../inputs/InputNoObligatoryCertificate";
import processService from "../../services/ProcessService";
import { useEffect, useState } from "react";
import ModalError from "../modals/ModalError";
import ModalIsLoading from "../modals/ModalIsLoading";

function AVODocumentation({ addAVODocuments, isOpenNO1, onToggle1, isOpenNO2, onToggle2}) {
  const [name1, setName1] = useState("death certificate (.pdf)")
  const [name2, setName2] = useState("marriage certificate (.pdf)")
  const [name3, setName3] = useState("birth certificate (.pdf)")
  const [isCharging, setIsCharging] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();

  const handleInputDeathCertificate = async (e) => {
    let file = e.target.files[0]
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsCharging(true)
      if(extension === "pdf"){
        let verification = await processService.isDeathCertificate(file)
        if(verification === false){
          setIsCharging(false)
          onOpen()
        }else{
          addAVODocuments({
          id: "death-certificate",
          file: file,
        });
        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        setName1(shorterName)
        setIsCharging(false)
        }
    }else{
      setIsCharging(false)
      onOpenError()
    }
    }
  };

  const handleInputMarriageCertificate = async (e) => {
    let file = e.target.files[0]
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsCharging(true)
      if(extension === "pdf"){
        let verification = await processService.isMarriageCertificate(file)
        if(verification === false){
          setIsCharging(false)
          onOpen()
        }else{
          addAVODocuments({
          id: "marriage-certificate",
          file: file,
        });
        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        setName2(shorterName)
        setIsCharging(false)
      }
    }else{
      setIsCharging(false)
      onOpenError()
    }
    }
  };

  const handleInputBirthCertificate = async (e) => {
    let file = e.target.files[0]
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsCharging(true)
        if(extension === "pdf"){
        let verification = await processService.isBirthCertificate(file)
        if(verification === false){
          setIsCharging(false)
          onOpen()
        }else{
          addAVODocuments({
          id: "birth-certificate",
          file: file,
        });
        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        setName3(shorterName)
        setIsCharging(false)
        }
    }else{
      setIsCharging(false)
      onOpenError()
    }
    }
  };

  useEffect(() => {
    if(isOpenNO1 === false){
      setName1("death certificate (.pdf)")
    }
  }, [isOpenNO1])

  useEffect(() => {
    if(isOpenNO2 === false){
      setName2("marriage certificate (.pdf)")
    }
  }, [isOpenNO2])

  return (
    <Box w="100%" borderRadius="30px" bg="teal.100">
      <Center flexWrap="wrap" gap={2} w="100%" p="2%">
        <InputNoObligatoryCertificate
          handleOnInput={handleInputDeathCertificate}
          confirmationQuestion={"¿Is dead?"}
          action={name1}
          isOpen={isOpenNO1}
          onToggle={onToggle1}
        />
        <InputNoObligatoryCertificate
          handleOnInput={handleInputMarriageCertificate}
          confirmationQuestion={"Was he in a marital relationship?"}
          action={name2}
          isOpen={isOpenNO2}
          onToggle={onToggle2}
        />
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
        isOpen={isCharging}
      />
      <ModalError
                question={"The file extension is not valid"}
                dataToConfirm={
                "Please choose a file with the extension ¨.pdf¨."
                }
                isOpen={isOpenError}
                onClose={onCloseError}
            />
    </Box>
  );
}

export default AVODocumentation;
