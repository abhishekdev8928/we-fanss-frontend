import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { logout } from "../../api/authApi";
import { useAuthUser } from "../../config/store/authStore";
import { toast } from "react-toastify";

//Import logo Images
import logosmdark from "../../assets/images/wefans.png";
import logodark from "../../assets/images/wefans-white.png";
import logosmlight from "../../assets/images/wefans.png";
import logolight from "../../assets/images/wefans-white.png";

const Header = (props) => {
    const [isSearch, setIsSearch] = useState(false);
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();

    const user = useAuthUser();
    const { profilePic, name, email } = user || {};

    const toggleMenu = () => {
        document.body.classList.toggle("sidebar-enable");
        document.body.classList.toggle("vertical-collpsed");
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/auth/login", { replace: true });
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    // Get first letter for avatar
    const getInitial = () => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    // Get display name
    const getDisplayName = () => {
        if (!name) return "User";
        return name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    return (
        <React.Fragment>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box flex items-center bg-[#252b3b]">
                            <Link to="/" className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={logosmdark} alt="" height="55" />
                                </span>
                                <span className="logo-lg">
                                    <img src={logodark} alt="" height="35" />
                                </span>
                            </Link>

                            <Link to="/" className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={logosmlight} alt="" height="55" />
                                </span>
                                <span className="logo-lg">
                                    <img src={logolight} alt="" height="38" />
                                </span>
                            </Link>
                        </div>

                        <Button 
                            size="sm" 
                            color="none" 
                            type="button" 
                            onClick={toggleMenu} 
                            className="px-3 font-size-24 header-item waves-effect" 
                            id="vertical-menu-btn"
                        >
                            <i className="ri-menu-2-line align-middle"></i>
                        </Button>

                        <Form className="app-search d-none d-lg-block">
                            <div className="position-relative">
                                <Input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder={props.t('Search')} 
                                />
                                <span className="ri-search-line"></span>
                            </div>
                        </Form>
                    </div>

                    <div className="d-flex">
                        {/* Mobile Search */}
                        <div className="dropdown d-inline-block d-lg-none ms-2">
                            <button 
                                type="button" 
                                onClick={() => setIsSearch(!isSearch)} 
                                className="btn header-item noti-icon waves-effect" 
                                id="page-header-search-dropdown"
                            >
                                <i className="ri-search-line"></i>
                            </button>
                            <div 
                                className={isSearch ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show" : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"}
                                aria-labelledby="page-header-search-dropdown"
                            >
                                <Form className="p-3">
                                    <div className="m-0">
                                        <div className="input-group">
                                            <Input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder={props.t('Search')} 
                                            />
                                            <div className="input-group-append">
                                                <Button color="primary" type="submit">
                                                    <i className="ri-search-line"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        <Dropdown 
                            isOpen={isProfile} 
                            toggle={() => setIsProfile(!isProfile)} 
                            className="d-inline-block"
                        >
                            <DropdownToggle 
                                tag="button" 
                                className="btn header-item waves-effect d-flex align-items-center gap-2" 
                                id="page-header-user-dropdown"
                            >
                                {/* Avatar */}
                                {!profilePic ? (
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            backgroundColor: "#0F4F72",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {getInitial()}
                                    </div>
                                ) : (
                                    <img 
                                        className="rounded-circle" 
                                        src={ `${process.env.REACT_APP_API_BASE_URL}/profile/${user.profilePic}`} 
                                        alt="Profile"
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            objectFit: "cover"
                                        }}
                                    />
                                )}

                                {/* User Name - Hidden on mobile */}
                                <span className="d-none d-xl-inline-block fw-medium">
                                    {getDisplayName()}
                                </span>

                                {/* Dropdown Icon */}
                                <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                            </DropdownToggle>

                            <DropdownMenu className="dropdown-menu-end">
                                {/* User Info Header */}
                                {/* <div className="dropdown-header d-flex align-items-center gap-2 p-3 border-bottom">
                                    {!profilePic ? (
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                backgroundColor: "#0F4F72",
                                                fontSize: "16px"
                                            }}
                                        >
                                            {getInitial()}
                                        </div>
                                    ) : (
                                        <img 
                                            className="rounded-circle" 
                                            src={profilePic} 
                                            alt="Profile"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover"
                                            }}
                                        />
                                    )}
                                    <div>
                                        <h6 className="mb-0">{getDisplayName()}</h6>
                                        {email && <small className="text-muted fs-6">{email}</small>}
                                    </div>
                                </div> */}

                                
                                

                                {/* Account */}
                                <DropdownItem tag={Link} to="/dashboard/user-profile">
                                    <i className="ri-user-line me-2"></i>
                                    Profile
                                </DropdownItem>

                               

                                <DropdownItem divider />

                                
                                <DropdownItem onClick={handleLogout}>
                                    <i className="ri-logout-box-line me-2"></i>
                                    Log out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default withTranslation()(Header);