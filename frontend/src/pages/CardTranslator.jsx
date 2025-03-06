import {
    Card,
    Text,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Button,
    Grid,
    HStack,
    IconButton,
    Box
  } from "@chakra-ui/react";
  
  import { useNavigate, useParams } from "react-router";
  import { useState, useEffect } from "react";
import WarningCard from "../components/cards/WarningCard";
import { Delete } from "@mui/icons-material";
import userService from "../services/UserService";
import { useAuth0 } from "@auth0/auth0-react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import ConfirmationModal from "../components/modals/ConfirmationModal";
  
  function CardTranslator() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([])
    const [savedTask, setSavedTask] = useState()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const {user}=useAuth0()
    
      const closeDownloadModal = () => {
        setIsDownloadOpen(false);
      };

      const openDownloadModal = (taskHooked) => {
        let task = taskHooked
        setSavedTask(task)
        console.log("Hooked task: ",taskHooked.process.user.name)
        setIsDownloadOpen(true);
      };
    
    const openCancelModal = (taskHooked) => {
        let task = taskHooked
        setSavedTask(task)
        console.log("Hooked task: ",taskHooked.process.user.name)
        setIsDeleteOpen(true);
      };
    
      const closeCancelModal = () => {
        setIsDeleteOpen(false);
      };

    const getTasks = async () => {
        try{
            let translationTasks = await userService.searchTranslationTask(userId)
            setTasks(translationTasks)
        }catch(e){
            navigate("network-error")
        }
    }

    const sendCancelNotification = async () => {
        await userService.deleteTranslationTask(savedTask.id)
        await userService.sendAlert(userId, savedTask.process.user.id, "Translator "+user.email+" has rejected your translation request")
        closeCancelModal()
      }

    const downloadFiles = async () => {
      const arrayFiles = savedTask.process.attachments_to_translate;
      console.log(arrayFiles)
      const zip = new JSZip();
    
      arrayFiles.forEach((file, index) => { 
        const filename = `${file.name.replace(/\s/g, '_')}_${index}.pdf`; 
        const base64 = file.file_base64;
    
        const blobFile = base64ToBlob(base64);
    
        zip.file(filename, blobFile);
      });
    
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "Documentation.zip");
      });
    
      closeDownloadModal();
    };

    function base64ToBlob(base64Data) {
      const splitData = base64Data.split(",");
      const contentType = splitData[0].match(/:(.*?);/)[1];
      const byteCharacters = atob(splitData[1]);
      const byteNumbers = new Array(byteCharacters.length);
    
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
    
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    }

    const loadDocuments = (task) => {
      localStorage.setItem('translatorId', JSON.stringify(userId));
      localStorage.setItem('requesterId', JSON.stringify(task.process.user.id));
      localStorage.setItem('taskId', JSON.stringify(task.id));
      navigate(`/loading`)
    }

    useEffect(() => {
        getTasks()
    }, [tasks])
  
    return (
      <Grid py="1.2rem" justifyContent="center">
        {tasks.length === 0 ? <Box h='calc(80vh)' alignContent={"center"}><WarningCard text={"There are no translation jobs"}/></Box> :
        tasks.map((task, index) => (
        <Card
          key={index}
          borderRadius="45px"
          bg="rgba(255, 255, 255, 0.8)"
          align="center"
          p={"1rem"}
          w={"20rem"}
          marginBottom={"0.5rem"}
        >
            <HStack spacing="2%" justifyContent={"right"} width={"100%"}>
                <IconButton
                    aria-label="Delete process"
                    color="red.500"
                    size="lg"
                    onClick={() => openCancelModal(task)}
                    icon={<Delete fontSize="large" />}
                    
            ></IconButton>
            </HStack>
          <CardHeader>
            <Heading textAlign="center" size="md">{"Translation Request"}</Heading>
          </CardHeader>
          <CardBody align="center">
            <Text>{"Requester email: "}<Text fontWeight={700}>{task.process.user.email}</Text></Text>
            <Text>{"Attachments to translate: "+task.process.attachments_to_translate.length}</Text>
          </CardBody>
          <CardFooter w="20rem" justifyContent={"center"}>
            <Button
              borderRadius="45px"
              color="white"
              w="6rem"
              bg="green.400"
              onClick={() => loadDocuments(task)}
            >
              {"Load"}
            </Button>
            <Button
              borderRadius="45px"
              color="white"
              w="6rem"
              bg="red.900"
              marginLeft={"10px"}
              onClick={() => openDownloadModal(task)}
            >
              {"Download"}
            </Button>
          </CardFooter>
        </Card>
        ))}
        <ConfirmationModal
              id="modal-confirmation"
              question={savedTask && "Are you sure you want to reject the request from "+savedTask.process.user.email+"?"}
              isOpen={isDeleteOpen}
              handleConfirmation={sendCancelNotification}
              onClose={closeCancelModal}
      />
      <ConfirmationModal
              id="modal-confirmation"
              question={savedTask && "Are you sure you want to download the documents of "+savedTask.process.user.email+"?"}
              isOpen={isDownloadOpen}
              handleConfirmation={downloadFiles}
              onClose={closeDownloadModal}
      />
      </Grid>
    );
  }
  
  export default CardTranslator;