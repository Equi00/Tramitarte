import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Process from "../pages/Process";
import UserHome from "../pages/UserHome";
import UserProfile from "../pages/UserProfile";
import FrequentQuestions from "../pages/FrequentQuestions";
import RegisteredTranslators from "../pages/RegisteredTranslators";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import RoleElection from "../pages/RoleElection";
import AVORequest from "../pages/AVORequest";
import TranslationRequests from "../pages/TranslationRequests";
import VerifyEmailForm from "../pages/VerifyEmailForm";
import PersonalDocumentation from "../pages/PersonalDocumentation";
import AncestorsDocumentation from "../pages/AncestorsDocumentation";
import AvoDocuments from "../pages/AvoDocuments";
import AvoProfile from "../pages/AvoProfile";
import DocumentationUploaded from "../pages/DocumentationUploaded";
import CardTranslator from "../pages/CardTranslator";
import LoadDocuments from "../pages/LoadDocuments";
import TranslatedDocumentation from "../pages/TranslatedDocumentation";


export const RouterApp = ({ setProcessContext, setLoggedUserContext }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="role-election"
          element={
            <RoleElection
            setLoggedUserContext={setLoggedUserContext}
            />
          }
        />
        <Route
          path="verificacion"
          element={
            <VerifyEmailForm
            setLoggedUserContext={setLoggedUserContext}
            />
          }
        />

        <Route index element={<Home />} />
        <Route path="/home/requester/:userId" element={<UserHome />}>
          <Route
            index
            element={<Process setProcessContext={setProcessContext} />}
          />
        </Route>
        <Route
          path="/home/requester/:userId/personal-documentation"
          element={<PersonalDocumentation />}
        />
        <Route
          path="/home/requester/:userId/ancestors-documentation"
          element={<AncestorsDocumentation />}
        />
        <Route
          path="/home/requester/:userId/translated-documentation"
          element={<TranslatedDocumentation />}
        />
        <Route
          path="/home/requester/:userId/avo-documentation"
          element={<AvoDocuments />}
        />
        <Route
          path="/home/requester/:userId/avo-request"
          element={<AVORequest />}
        />

        <Route 
          path="/home/requester/:userId/translators" 
          element={<RegisteredTranslators />} 
        />

        <Route path="/user/:userId" element={<UserProfile />} />

        <Route 
          path="home/translator/:userId/pending-orders" 
          element={<TranslationRequests />} 
        />

        <Route 
          path="/loading" 
          element={<LoadDocuments />} 
        />

        <Route path="/home/translator/:userId/*" element={<UserHome />}>
          <Route 
            index 
            element={<CardTranslator/>} 
          />
        </Route>
        <Route path="/user" element={<UserProfile />} />
        <Route path="/avo-profile" element={<AvoProfile />} />
        <Route path="/frequently-asked-questions" element={<FrequentQuestions />} />
        <Route path="/pending-orders" element={<TranslationRequests />} />
        <Route path="/documentation-uploaded" element={<DocumentationUploaded />} />
        <Route path="/network-error" element={<div>Error</div>} />
      </Routes>
    </BrowserRouter>
  );
};
