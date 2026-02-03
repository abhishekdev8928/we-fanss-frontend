import React from "react";
import { NavLink } from "react-router-dom";
import SimpleBar from "simplebar-react";
import {
  LayoutDashboard,
  Briefcase,
  Languages,
  HelpCircle,
  Share2,
  Theater,
  Layers,
  LayoutTemplate,
  Star,
  ShieldCheck,
  Users,
} from "lucide-react";
import PrivilegeAccess from "../protection/PrivilegeAccess";
import { RESOURCES } from "../../constant/privilegeConstants";

// SidebarContent Component
const SidebarContent = () => {
  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">
        <li className="menu-title">Menu</li>

        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <PrivilegeAccess module={RESOURCES.PROFESSION}>
          <li>
            <NavLink
              to="/dashboard/professional-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Briefcase size={20} />
              <span>Professions</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.LANGUAGE}>
          <li>
            <NavLink
              to="/dashboard/language-master"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Languages size={20} />
              <span>Languages</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.TRIVIA_TYPE}>
          <li>
            <NavLink
              to="/dashboard/triviaTypes-master"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <HelpCircle size={20} />
              <span>Trivia Types</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.SOCIAL_LINK}>
          <li>
            <NavLink
              to="/dashboard/sociallink-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Share2 size={20} />
              <span>Social Links</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.GENRE}>
          <li>
            <NavLink
              to="/dashboard/genremaster-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Theater size={20} />
              <span>Genres</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.SECTION_TYPE}>
          <li>
            <NavLink
              to="/dashboard/sectionmaster-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Layers size={20} />
              <span>Section Types</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.SECTION_TEMPLATE}>
          <li>
            <NavLink
              to="/dashboard/sectiontemplate-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <LayoutTemplate size={20} />
              <span>Templates</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        <PrivilegeAccess module={RESOURCES.CELEBRITY}>
          <li>
            <NavLink
              to="/dashboard/celebrity-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Star size={20} />
              <span>Celebrities</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* ✅ Role Management - wrapped with PrivilegeAccess */}
        <PrivilegeAccess module={RESOURCES.ROLE_MANAGEMENT}>
          <li>
            <NavLink
              to="/dashboard/role-master"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <ShieldCheck size={20} />
              <span>Roles</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* ✅ User Management - wrapped with PrivilegeAccess */}
        <PrivilegeAccess module={RESOURCES.USER_MANAGEMENT}>
          <li>
            <NavLink
              to="/dashboard/employee-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Users size={20} />
              <span>Users</span>
            </NavLink>
          </li>
        </PrivilegeAccess>
      </ul>
    </div>
  );
};

// Main Sidebar Component
const Sidebar = ({ type }) => {
  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100 bg-[#252b3b]">
        {type !== "condensed" ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent />
          </SimpleBar>
        ) : (
          <SidebarContent />
        )}
      </div>
    </div>
  );
};

export default Sidebar;