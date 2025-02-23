
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  Box
} from "@chakra-ui/react";
import Stage from "../components/Stage";
import processService from "../services/ProcessService";
import CardStartProcess from "../components/cards/CardStartProcess";
import SkeletonIsLoading from "../components/SkeletonIsLoading";

function Process({ setProcessContext }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [process, setProcess] = useState();

  useEffect(() => {
    processService
      .searchProcessByUserId(userId)
      .then((response) => {
        if(response && response.data){
          let persistedProcess = response.data;
          setProcess(persistedProcess);
          setProcessContext(persistedProcess);
          window.localStorage.setItem(
            "process",
            JSON.stringify({
              id: persistedProcess.id,
              code: persistedProcess.code,
            })
          );
        }
        setIsLoading(false);
      })
  }, []);

  return (
    <Box h='calc(85vh)' alignContent={"center"}>
      {isLoading ? (
          <SkeletonIsLoading isLoading={isLoading} />
        ) : process ? (
          <Stage process={process} />
        ) : (
          <CardStartProcess></CardStartProcess>
        )}
    </Box>
  );
}

export default Process;
