import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

/* ================= AUTH ================= */
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

import Otp from "../pages/Authentication/Otp";
import ForgotOtp from "../pages/Authentication/ForgotOtp";
import ResetPwd from "../pages/Authentication/ResetPwd";

/* ================= DASHBOARD ================= */
import Dashboard from "../pages/Dashboard";

/* ================= PROFESSIONAL ================= */
import Professionallist from "../pages/ProfessionalMaster/Professionallist";
import AddProfessional from "../pages/ProfessionalMaster/AddProfessional";
import UpdateProfessional from "../pages/ProfessionalMaster/UpdateProfessional";
import ReferencesList from "../pages/References/ReferencesList";

/* ================= TIMELINE ================= */
import Timelinelist from "../pages/Timeline/Timelinelist";
import AddTimeline from "../pages/Timeline/AddTimeline";
import UpdateTimeline from "../pages/Timeline/UpdateTimeline";

/* ================= CUSTOM OPTION ================= */
import CustomOptionlist from "../pages/CustomOption/CustomOptionlist";
import AddCustomOption from "../pages/CustomOption/AddCustomOption";
import UpdateCustomOption from "../pages/CustomOption/UpdateCustomOption";

/* ================= SECTION MASTER ================= */
import SectionMasterList from "../pages/SectionMaster/SectionMasterList";
import AddSectionMaster from "../pages/SectionMaster/AddSectionMaster";
import UpdateSectionMaster from "../pages/SectionMaster/UpdateSectionMaster";

/* ================= MASTER ================= */
import LanguageList from "../pages/LanguageMaster/LanguageList";
import TriviaTypesList from "../pages/TriviaTypes/TriviaTypesList";
import GenreMasterList from "../pages/GenreMaster/GenreMasterList";

/* ================= TEMPLATE ================= */
import SectionTemplateList from "../pages/SectionTemplate/SectionTemplateList";
import Template from "../pages/Template/TemplateView";
import TemplateList from "../pages/Template/TemplateList";
import TemplateEdit from "../pages/Template/TemplateEdit";

/* ================= SOCIAL ================= */
import SocialLinkList from "../pages/SocialLink/SocialLinkList";

/* ================= CELEBRITY ================= */
import CelebratyList from "../pages/Celebraty/CelebratyList";


/* ================= SECTION ================= */
import AddSection from "../pages/Section/AddMovie";
import ListMoviev from "../pages/Section/ListMoviev";
import UpdateMoviev from "../pages/Section/UpdateMovie";

import AddSeries from "../pages/Section/AddSeries";
import ListSeries from "../pages/Section/ListSeries";
import UpdateSeries from "../pages/Section/UpdateSeries";

import AddElection from "../pages/Section/AddElection";
import ListElection from "../pages/Section/ListElection";
import UpdateElection from "../pages/Section/UpdateElection";

import AddPositions from "../pages/Section/AddPositions";
import ListPositions from "../pages/Section/ListPositions";
import UpdatePositions from "../pages/Section/UpdatePositions";

/* ================= TRIVIA ================= */
import TriviaentriesList from "../pages/Triviaentries/TriviaentriesList";
import CreateTriviaentries from "../pages/Triviaentries/add";
import UpdateTriviaentries from "../pages/Triviaentries/UpdateTriviaentries";

/* ================= ROLE / EMPLOYEE ================= */
import RoleMasterList from "../pages/RoleMaster/RoleMasterList";
import Privileges from "../pages/RoleMaster/Privileges";

import EmployeeList from "../pages/Employee/EmployeeList";
import CreateEmploye from "../pages/Employee/CreateEmploye";
import UpdateEmploye from "../pages/Employee/UpdateEmploye";

/* ================= PROFILE ================= */
import Profile from "../pages/profile/Profile";
import AuthLayout from "../layout/auth-layout";
import DashboardLayout from "../layout/dashboard-layout";
import AddCelebrityForm from "../pages/Celebraty/AddCelebrity";
import UpdateCelebrityForm from "../pages/Celebraty/UpdateCelebrity";
import UserManagementList from "../pages/UserManagement/UserManagementList";
import RelatedPersonalitiesList from "../pages/RelatedPersonality/RelatedPersonalitiesList";
import ProfessionSectionTab from "../pages/Section/ProfessionSectionTab";


/* ================= ROUTER ================= */

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/auth/login" /> },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgetPwd /> },
      { path: "verify-otp", element: <Otp /> },
      { path: "forgot-otp", element: <ForgotOtp /> },
      { path: "reset-password", element: <ResetPwd /> },
    ],
  },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Dashboard /> },

      { path: "professional-list", element: <Professionallist /> },
      { path: "add-professional", element: <AddProfessional /> },
      { path: "update-professional/:id", element: <UpdateProfessional /> },

      { path: "language-master", element: <LanguageList /> },
      { path: "triviaTypes-master", element: <TriviaTypesList /> },

      { path: "celebrity-list", element: <CelebratyList /> },
      { path: "add-celebrity", element: <AddCelebrityForm /> },
      { path: "update-celebrity/:id", element: <UpdateCelebrityForm /> },

      { path: "sectiontemplate-list", element: <SectionTemplateList /> },

      { path: "add-movie/:id", element: <AddSection /> },
      { path: "list-movie/:id", element: <ListMoviev /> },
      { path: "update-movie/:id", element: <UpdateMoviev /> },

      { path: "timeline-list/:id", element: <Timelinelist /> },
      { path: "add-timeline/:id", element: <AddTimeline /> },
      { path: "update-timeline/:id", element: <UpdateTimeline /> },

      { path: "customoption-list/:id", element: <CustomOptionlist /> },
      { path: "add-customoption/:id", element: <AddCustomOption /> },
      { path: "update-customoption/:id", element: <UpdateCustomOption /> },

      { path: "triviaentries-list/:id", element: <TriviaentriesList /> },
      { path: "add-triviaentries/:id", element: <CreateTriviaentries /> },
      { path: "update-triviaentries/:id", element: <UpdateTriviaentries /> },

      { path: "add-series/:id", element: <AddSeries /> },
      { path: "list-series/:id", element: <ListSeries /> },
      { path: "update-series/:id", element: <UpdateSeries /> },

      { path: "add-election/:id", element: <AddElection /> },
      { path: "list-election/:id", element: <ListElection /> },
      { path: "update-election/:id", element: <UpdateElection /> },

      { path: "add-positions/:id", element: <AddPositions /> },
      { path: "list-positions/:id", element: <ListPositions /> },
      { path: "update-positions/:id", element: <UpdatePositions /> },

      { path: "sociallink-list", element: <SocialLinkList /> },
      { path: "genremaster-list", element: <GenreMasterList /> },

      { path: "section-template-view/:celebId/:id", element: <Template /> },
      { path: "section-template-list/:celebId", element: <TemplateList /> },
      {
        path: "section-template-edit/:celebId/:sectionId/:dataId",
        element: <TemplateEdit />,
      },

      { path: "role-master", element: <RoleMasterList /> },
      { path: "privileges/:id", element: <Privileges /> },

      { path: "employee-list", element: <UserManagementList /> },
      { path: "create-employee", element: <CreateEmploye /> },
      { path: "update-employee/:id", element: <UpdateEmploye /> },

      { path: "sectionmaster-list", element: <SectionMasterList /> },
      { path: "add-sectionmaster", element: <AddSectionMaster /> },
      { path: "update-sectionmaster/:id", element: <UpdateSectionMaster /> },

      {
        path:"section-list",
        element:<ProfessionSectionTab />

      },
     

      {
        path: "references-list/:celebrityId",
        element: <ReferencesList />,
      },
{
  path: "related-personalities-list/:celebrityId",
  element: <RelatedPersonalitiesList />,
},


      { path: "user-profile", element: <Profile /> },
    ],
  },
]);

export default router;
