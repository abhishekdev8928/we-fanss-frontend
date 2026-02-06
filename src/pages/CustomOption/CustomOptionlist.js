import React, { Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Plus, Edit, Trash2, ChevronDown, Pen, Trash } from "lucide-react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getcustomoption,
  deletecustomoption,
  updatecustomoptionStatus,
} from "../../api/customoptionApi";
import { getCelebratyById } from "../../api/celebratyApi";
import deleteimg from "../../assets/images/delete.png";

const CustomSectionTabs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const celebrityId = id;

  // ========== STATE ==========
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [celebrityName, setCelebrityName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getcustomoption(celebrityId);

      if (result.success && result.data) {
        const dataArray = Array.isArray(result.data) ? result.data : [];
        setSections(dataArray);
        if (dataArray.length > 0) {
          setActiveSection(dataArray[0]);
        }
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to load sections");
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCelebrityName = async () => {
    try {
      const response = await getCelebratyById(celebrityId);
      if (response.msg?.identityProfile?.name) {
        setCelebrityName(response.msg.identityProfile.name);
      } else if (response.data?.identityProfile?.name) {
        setCelebrityName(response.data.identityProfile.name);
      }
    } catch (err) {
      console.error("Error fetching celebrity:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCelebrityName();
  }, [celebrityId]);

  // ========== HANDLERS ==========
  const toggleStatusDropdown = () => setStatusDropdownOpen(!statusDropdownOpen);

  const handleStatusChange = async (newStatus) => {
    if (!activeSection) return;

    try {
      const res_data = await updatecustomoptionStatus(activeSection._id, newStatus);

      if (res_data.success === false) {
        toast.error(res_data.message || "Failed to update status");
        return;
      }

      toast.success("Section status updated successfully");
      
      // Update the status in the current state without refetching
      const updatedSections = sections.map(section => 
        section._id === activeSection._id 
          ? { ...section, status: newStatus }
          : section
      );
      setSections(updatedSections);
      
      // Update active section with new status
      setActiveSection({ ...activeSection, status: newStatus });
      
      setStatusDropdownOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again!");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const data = await deletecustomoption(deleteId);

      if (data.success === false) {
        toast.error(data.message || "Failed to delete section");
        return;
      }

      toast.success(data.message || "Section deleted successfully");
      setDeleteModalOpen(false);
      setDeleteId(null);
      await fetchData();
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Something went wrong.");
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Celebrity List", link: "/dashboard/celebrity-list" },
    { title: "Custom Sections", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container className="p-2"  fluid>
          {/* <Breadcrumbs title={celebrityName} breadcrumbItems={breadcrumbItems} /> */}

          <Card style={{  backgroundColor:"transparent", border: "none", boxShadow:"none" }}>
            <CardBody style={{margin:"0" , padding:0}}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="flex gap-4">
                  <h4 className="mb-1 fs-4 ">Custom Section</h4>
                  <div className="d-flex gap-3 align-items-center">
                     <Link className="text-theme" to={`/dashboard/update-celebrity/${celebrityId}`} style={{ textDecoration: "none", fontSize: "14px" }}>
                      Basic Info
                    </Link>
                    <Link className="text-theme" to={`/dashboard/timeline-list/${celebrityId}`}  style={{ textDecoration: "none", fontSize: "14px" }}>
                      Fixed section
                    </Link>
                    <Link className="text-theme" to="/dashboard/profession-section" style={{ textDecoration: "none", fontSize: "14px" }}>
                      Profession section
                    </Link>
                  </div>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                                <Link to="/dashboard/celebrity-list" className="text-decoration-none text-muted">
                                  Celebrity List
                                </Link>
                                {" / Custom Section"}
                              </small>
                
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading sections...</p>
                </div>
              ) : (
                <>
                  {/* Tabs Row - With circle numbers, max-width, and styled add button */}
                  <div className="d-flex border-bottom align-items-center mb-3" style={{ gap: "8px" }}>
                    {sections.map((section, index) => (
                      <div
                        key={section._id}
                        onClick={() => setActiveSection(section)}
                        style={{
                          width: "200px",
                          padding: "16px 24px",
                          cursor: "pointer",
                          backgroundColor: activeSection?._id === section._id ? "#f8f9fa" : "transparent",
                          borderBottom: activeSection?._id === section._id ? "3px solid #4285F4" : "3px solid transparent",
                          transition: "all 0.3s ease",
                          opacity: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#e9ecef",
                              color: "#6c757d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: "600",
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </div>
                          <div style={{ 
                            fontWeight: activeSection?._id === section._id ? "600" : "normal", 
                            fontSize: "14px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {section.title}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Tab Button - Blue rounded */}
                    <div
                      onClick={() => navigate(`/dashboard/add-customoption/${celebrityId}`)}
                      className="bg-theme"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        marginLeft:"20px"
                       
                      }}
                    >
                      <Plus size={24} color="white" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Active Section Content */}
                 {activeSection && (
  <div
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}
  >
    {/* Section Header with Actions */}
    <div className="d-flex align-items-center justify-content-between mb-4">
      <h3 style={{ fontSize: "24px", fontWeight: "500", marginBottom: 0 }}>
        {activeSection.title}
      </h3>

      <div style={{ gap: "16px" }} className="d-flex">
        {/* Status Dropdown */}
        <Dropdown isOpen={statusDropdownOpen} toggle={toggleStatusDropdown}>
          <DropdownToggle
            caret
            style={{
              backgroundColor: "#F4FBFF",
              border: "none",
              color: activeSection.status === 1 ? "#28a745" : "#dc3545",
              fontWeight: "500",
              display: "flex",
              justifyContent: "center",
              width: "130px",
              height:"100%",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  activeSection.status === 1 ? "var(--active-color)" : "#dc3545",
                display: "inline-block",
              }}
            ></span>
            {activeSection.status === 1 ? "Active" : "Inactive"}
            <ChevronDown size={16} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleStatusChange(1)}>
              <span style={{ color: "#28a745" }}>● Active</span>
            </DropdownItem>
            <DropdownItem onClick={() => handleStatusChange(0)}>
              <span style={{ color: "#dc3545" }}>● Inactive</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Edit */}
        <Link
          to={`/dashboard/update-customoption/${activeSection._id}`}
          className="bg-theme d-flex align-items-center justify-content-center"
          style={{
            borderRadius: "8px",
            width: "48px",
            height: "48px",
          }}
        >
          <Pen size={22} color="white" />
        </Link>

        {/* Delete */}
        <Button
          onClick={() => handleDeleteClick(activeSection._id)}
          style={{
            backgroundColor: "#BA25261F",
            color: "#FF5555",
            border: "none",
            borderRadius: "8px",
            width: "48px",
            height: "48px",
          }}
        >
          <Trash size={22} stroke="#BA2526" />
        </Button>
      </div>
    </div>

    {/* Section Subtitle */}
    <div className="px-2">

      <h5 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "20px" }}>
      {activeSection.title}
    </h5>

    {/* Media */}
    {activeSection.media && (
      <div className="mb-4 ">
        {activeSection.media.type === "image" ? (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL || ""}${activeSection.media.path}`}
            alt={activeSection.title}
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "8px",
              backgroundColor: "#d3d3d3",
            }}
          />
        ) : activeSection.media.type === "video" ? (
          <video
            controls
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "8px",
              backgroundColor: "#d3d3d3",
            }}
          >
            <source
              src={`${process.env.REACT_APP_API_BASE_URL || ""}${activeSection.media.path}`}
              type="video/mp4"
            />
          </video>
        ) : null}
      </div>
    )}

    {/* Description */}
    <div
      style={{
        fontSize: "15px",
        lineHeight: "1.8",
        color: "#333",
      }}
      dangerouslySetInnerHTML={{ __html: activeSection.description }}
    />

   
    </div>
  </div>
)}


                  {/* Empty State */}
                  {sections.length === 0 && (
                    <div className="text-center py-5">
                      <p className="text-muted mb-3">No custom sections found</p>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Container>

        {/* Delete Confirmation Modal */}
 <Modal
  isOpen={deleteModalOpen}
  toggle={handleDeleteCancel}
  centered
  contentClassName="border-0 rounded-4"
>
  <ModalHeader toggle={handleDeleteCancel} className="border-0">
    <span className="fw-semibold">Confirm Deletion</span>
  </ModalHeader>

  <ModalBody className="px-5 pt-4 pb-3 text-center">
    {/* Centered Image */}
    <div className="d-flex justify-content-center">
      <img
        src={deleteimg}
        alt="Delete Confirmation"
        width="160"
        className="mb-4"
      />
    </div>

    <h4 className="fw-bold text-dark mb-3">
      Are you sure you want to delete this celebrity?
    </h4>

  
  </ModalBody>

  {/* Buttons RIGHT aligned */}
  <ModalFooter className="border-0 px-4 pb-4 d-flex justify-content-end gap-3">
    <Button
      onClick={handleDeleteConfirm}
      style={{
        backgroundColor: "#ff4d6d",
        border: "none",
        padding: "10px 26px",
        borderRadius: "12px",
        fontWeight: "600"
      }}
    >
      Yes, Delete
    </Button>

    <Button
      onClick={handleDeleteCancel}
      style={{
        backgroundColor: "#6c757d",
        border: "none",
        padding: "10px 22px",
        borderRadius: "12px",
        fontWeight: "500"
      }}
    >
      Cancel
    </Button>
  </ModalFooter>
</Modal>



      </div>
    </Fragment>
  );
};

export default CustomSectionTabs;