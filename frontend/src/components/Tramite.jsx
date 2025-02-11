import { Skeleton, SkeletonCircle, SkeletonText, Box } from "@chakra-ui/react";

import { Delete } from "@mui/icons-material";
import banderaItailiana from "../assets/baneraItaliana.png";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState, createContext } from "react";
import Etapa from "./Etapa";
import tramiteService from "../services/TramiteService";
import CardIniciarTramite from "./CardIniciarTramite";
import EsqueletoIsLoading from "./EsqueletoIsLoading";
import EtapaView from "../dominio/EtapaView";

const BanderaItaliana = ({ height }) => (
  <Box zIndex={-1} position="" left={0} bottom={1} h={height}>
    <Box
      display="inline-block"
      borderRadius="10px 0 0 10px"
      w="33%"
      h="100%"
      bg="green.200"
    />
    <Box display="inline-block" w="33%" h="100%" bg="white" />
    <Box
      display="inline-block"
      borderRadius="0 10px 10px 0"
      w="33%"
      h="100%"
      bg="red.300"
    />
  </Box>
);

function Tramite({ setTramiteContext }) {
  const navigate = useNavigate();
  const { idUsuario } = useParams();
  const [estaCargando, setEstaCargando] = useState(true);
  const [tramite, setTramite] = useState();

  useEffect(() => {
    tramiteService
      .buscarPorUsuario(idUsuario)
      .then((response) => {
        setEstaCargando(false);
        let tramitePersistido = response.data;
        setTramite(tramitePersistido);
        setTramiteContext(tramitePersistido);
        window.localStorage.setItem(
          "process",
          JSON.stringify({
            id: tramitePersistido.id,
            codigo: tramitePersistido.codigo,
          })
        );
      })
      .catch((error) => navigate("/network-error"));
  }, []);

  return (
    <>
      {estaCargando ? (
        <EsqueletoIsLoading estaCargando={estaCargando} />
      ) : tramite ? (
        <Etapa tramite={tramite} />
      ) : (
        <CardIniciarTramite></CardIniciarTramite>
      )}
    </>
  );
}

export default Tramite;
