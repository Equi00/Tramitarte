import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Tramite from "../components/Tramite";
import UserHome from "../pages/UserHome";
import UserProfile from "../pages/UserProfile";
import PreguntasFrecuentes from "../pages/PreguntasFrecuentes";
import FamilySearch from "../pages/FamilySearch";
import TraductoresRegistrados from "../pages/TraductoresRegistrados";
import ModalConfirmacion from "../components/ModalConfirmacion";
import EleccionRol from "../pages/EleccionRol";
import SolicitudAVO from "../pages/SolicitudAVO";
import PedidosTraduccion from "../components/PedidosTraduccion";
import VerifyEmailForm from "../pages/VerificacionEmail";
import Documentacion from "../pages/DocumentacionPersonal";
import DocumentacionPersonal from "../pages/DocumentacionPersonal";
import DocumentacionAscendentes from "../pages/DocumentacionAscendentes";
import DocumentacionAVO from "../pages/ArchivosAVO";
import ArchivosAVO from "../pages/ArchivosAVO";
import AvoProfile from "../pages/AvoProfile";
import DocumentacionCargada from "../pages/DocumentacionCargada";
import CardAviso from "../components/CardAviso";
import CardTraduccion from "../components/CardTraduccion";
import CargaDocumentos from "../components/CargaDocumentos";
import DocumentacionTraducida from "../pages/DocumentacionTraducida";


export const RouterApp = ({ setTramiteContext, setUsuarioLogueadoContext }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="eleccion-rol"
          element={
            <EleccionRol
              setUsuarioLogueadoContext={setUsuarioLogueadoContext}
            />
          }
        />
        <Route
          path="verificacion"
          element={
            <VerifyEmailForm
              setUsuarioLogueadoContext={setUsuarioLogueadoContext}
            />
          }
        />

        <Route index element={<Home />} />
        <Route path="/home/solicitante/:idUsuario" element={<UserHome />}>
          <Route
            index
            element={<Tramite setTramiteContext={setTramiteContext} />}
          />
        </Route>
        <Route
          path="/home/solicitante/:idUsuario/documentacion-personal"
          element={<DocumentacionPersonal />}
        />
        <Route
          path="/home/solicitante/:idUsuario/documentacion-ascendentes"
          element={<DocumentacionAscendentes />}
        />
        <Route
          path="/home/solicitante/:idUsuario/documentacion-traducida"
          element={<DocumentacionTraducida />}
        />
        <Route
          path="/home/solicitante/:idUsuario/documentacion-avo"
          element={<ArchivosAVO />}
        />
        <Route
          path="/home/solicitante/:idUsuario/solicitud-avo"
          element={<SolicitudAVO />}
        />

        <Route 
          path="/home/solicitante/:idUsuario/traductores" 
          element={<TraductoresRegistrados />} 
        />

        <Route path="/usuario/:idUsuario" element={<UserProfile />} />

        <Route 
          path="home/traductor/:idUsuario/pedidos-pendientes" 
          element={<PedidosTraduccion />} 
        />

        <Route 
          path="/carga" 
          element={<CargaDocumentos />} 
        />

        <Route path="/home/traductor/:idUsuario/*" element={<UserHome />}>
          <Route 
            index 
            element={<CardTraduccion/>} 
          />
        </Route>
        <Route path="/usuario" element={<UserProfile />} />
        <Route path="/avo-profile" element={<AvoProfile />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/family-search" element={<FamilySearch />} />
        <Route path="/solicitantes" element={<div>solicitantes</div>} />
        <Route path="/pedidos-pendientes" element={<PedidosTraduccion />} />
        <Route path="/documentacion-cargada" element={<DocumentacionCargada />} />
        <Route path="/network-error" element={<div>Error</div>} />
        
        <Route path="*" element={<ModalConfirmacion />} />
      </Routes>
    </BrowserRouter>
  );
};
