import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useAuth } from "../../../store/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const { LogoutUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [adminName, setAdminName] = useState("");
    const [adminName2, setAdminName2] = useState("");

  const toggle = () => setMenu(!menu);

  const handleLogout = async () => {
    await LogoutUser();
    console.log("User logged out.");
    navigate("/login");
  };

  const authUser = localStorage.getItem("authUser");
  if (authUser) {
    const obj = JSON.parse(authUser);
    const uNm = obj.email.split("@")[0];
  }

  useEffect(() => {
    const adminId = localStorage.getItem("adminid");

    if (adminId) {
      fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/getdataByid/${adminId}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Admin Name:", data.msg.username); // ✅ Correct
          setAdminName(data.msg.username);
            setAdminName2(data.msg.profile_pic);
          localStorage.setItem("adminname", data.msg.username);
        })
        .catch((error) => {
          console.error("Error fetching admin name:", error);
        });
    }
  }, []);

  return (
    <Dropdown
      isOpen={menu}
      toggle={toggle}
      className="d-inline-block user-dropdown"
    >
      <DropdownToggle
        tag="button"
        className="btn header-item waves-effect"
        id="page-header-user-dropdown"
      >
        <img
          className="rounded-circle header-profile-user me-1"
           src={`${process.env.REACT_APP_API_BASE_URL}/profile/${adminName2}`}

          alt="Header Avatar"
        />
        <span className="d-none d-xl-inline-block ms-1 text-transform">
          {adminName}
        </span>
        <i className="mdi mdi-chevron-down d-none ms-1 d-xl-inline-block"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem tag={Link} to="/user-profile">
          <i className="ri-user-line align-middle me-1"></i> {t("Profile")}
        </DropdownItem>
        {/* <DropdownItem href="#">
          <i className="ri-wallet-2-line align-middle me-1"></i>{" "}
          {t("My Wallet")}
        </DropdownItem>
        <DropdownItem className="d-block" href="#">
          <span className="badge badge-success float-end mt-1">11</span>
          <i className="ri-settings-2-line align-middle me-1"></i>{" "}
          {t("Settings")}
        </DropdownItem>
        <DropdownItem href="#">
          <i className="ri-lock-unlock-line align-middle me-1"></i>{" "}
          {t("Lock screen")}
        </DropdownItem> */}
        <DropdownItem divider />
        <DropdownItem className="text-danger" onClick={handleLogout}>
          <i className="ri-shut-down-line align-middle me-1 text-danger"></i>{" "}
          {t("Logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileMenu;
