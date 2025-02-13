import { useEffect, useState } from "react";
import InputFile from "../inputs/InputFile";
import { Box, Center, useDisclosure } from "@chakra-ui/react";
import processService from "../../services/ProcessService";
import ModalError from "../modals/ModalError";
import InputNoObligatoryCertificateMultiple from "../inputs/InputNoObligatoryCertificateMultiple";
import ModalIsLoading from "../modals/ModalIsLoading";

function AncestorsDocumentFile({ ancestorCount, persons, setAncestorsDocumentation, deleteDocuments, setCheck1, setCheck2 }) {
  const [name1, setName1] = useState([]);
  const [name2, setName2] = useState([]);
  const [name3, setName3] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const [verified1, setVerified1] = useState([])
  const [verified2, setVerified2] = useState([])

  const handleInputDeathCertificate = async (e, index) => {
    const file = e.target.files[0];
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsLoading(true)
    if(extension === "pdf"){
    const verification = await processService.isDeathCertificate(file);
    
    if (verification === false) {
      setIsLoading(false)
        onOpen();
      } else {
        setAncestorsDocumentation({
          id: "death-certificate",
          file: file,
          index: index
        });

        const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
        
        setName1((prevNames) => {
          const newName = [...prevNames];
          newName[index] = shorterName;
          return newName;
        });
        setIsLoading(false)
      }
  }else{
    setIsLoading(false)
    onOpenError()
  }
    }
}

  const handleInputMarriageCertificate = async (e, index) => {
    const file = e.target.files[0];
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsLoading(true)
      if(extension === "pdf"){
    const verification = await processService.isMarriageCertificate(file);
    
    if (verification === false) {
      setIsLoading(false)
      onOpen();
    } else {
      setAncestorsDocumentation({
        id: "marriage-certificate",
        file: file,
        index: index
      });

      const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
      
      setName2((prevNames) => {
        const newNames = [...prevNames];
        newNames[index] = shorterName;
        return newNames;
      });
      setIsLoading(false)
    }
  }else{
    setIsLoading(false)
    onOpenError()
  }
    }
  }

  const handleInputBirthCertificate = async (e, index) => {
    const file = e.target.files[0];
    if(file){
      const lastPoint = file.name.lastIndexOf(".");
      const extension = file.name.slice(lastPoint + 1);
      setIsLoading(true)
      if(extension === "pdf"){
    const verification = await processService.isBirthCertificate(file);
    
    if (verification === false) {
      setIsLoading(false)
      onOpen();
    } else {
      setAncestorsDocumentation({
        id: "birth-certificate",
        file: file,
        index: index
      });

      const shorterName = file.name.length > 20 ? file.name.substring(0, 30) + '...' : file.name;
      
      setName3((prevNames) => {
        const newNames = [...prevNames];
        newNames[index] = shorterName;
        return newNames;
      });
      setIsLoading(false)
    }
  }else{
    setIsLoading(false)
    onOpenError()
  }
    }
  }

  useEffect(() => { //set all the standard values ​​according to the number of descendants
    const names1 = Array(ancestorCount).fill("death certificate (.pdf)");
    const names2 = Array(ancestorCount).fill("marriage certificate (.pdf)");
    const names3 = Array(ancestorCount).fill("birth certificate (.pdf)");
    const verificationCount = Array(ancestorCount).fill(false)
  
    setName1(names1);
    setName2(names2);
    setName3(names3);
    setVerified1(verificationCount)
    setVerified2(verificationCount)
    
  }, [ancestorCount]);

  useEffect(() => { //Here if you check "no", then the button name returns to its original state
    verified1.forEach((verified, index) => {
      if (verified1[index] === false) {
        setName1((prevNames) => {
          const newNames = [...prevNames];
          newNames[index] = "death certificate (.pdf)";
          return newNames;
        });
        if(!(persons[index].deathCertificate.name === "")){
          deleteDocuments({
            id: "death-certificate",
            index: index
          })
        }
      }
    });
    setCheck1(verified1)
  }, [verified1])

  useEffect(() => { //Here if you check "no", then the button name returns to its original state
    verified2.forEach((verified, index) => {
      if (verified2[index] === false) {
        setName2((prevNames) => {
          const newNames = [...prevNames];
          newNames[index] = "marriage certificate (.pdf)";
          return newNames;
        });
        if(!(persons[index].marriageCertificate.name === "")){
          deleteDocuments({
            id: "marriage-certificate",
            index: index
          })
        }
      }
    });
    setCheck2(verified2)
  }, [verified2])

  return (
    <Box borderRadius="30px" bg="teal.100">
      {persons.map((persona, index) => (
        <Box key={index}>
          <Center py="2%">
          <InputNoObligatoryCertificateMultiple
            confirmationQuestion={"Is he dead?"}
            action={name1[index]}
            handleOnInput={(e) => handleInputDeathCertificate(e, index)}
            handleCheckbox={setVerified1}
            index={index}
          />
          </Center>
          <Center py="2%">
            <InputNoObligatoryCertificateMultiple
              confirmationQuestion={"Was he in a marital relationship??"}
              action={name2[index]}
              handleOnInput={(e) => handleInputMarriageCertificate(e, index)}
              handleCheckbox={setVerified2}
              index={index}
            />
          </Center>
          <Center py="2%">
            <InputFile action={name3[index]} handleOnInput={(e) => handleInputBirthCertificate(e, index)} />
          </Center>
        </Box>
      ))}
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
            "Please choose a file with the extension ¨.pdf¨."
              }
            isOpen={isOpenError}
            onClose={onCloseError}
        />
    </Box>
  );
}

export default AncestorsDocumentFile;
