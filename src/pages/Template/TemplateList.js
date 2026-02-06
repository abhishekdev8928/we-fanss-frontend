import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getSectionData, deleteTemplateData } from "../../api/TemplateApi";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import ProfessionSectionTab from "../Section/ProfessionSectionTab";

const SectionTemplateList = () => {
  const { celebId } = useParams();
  const celebrityId = celebId ;

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentSectionMasterId, setCurrentSectionMasterId] = useState(null); // ✅ Only need SectionMaster ID

  console.log(currentSectionMasterId , celebrityId)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${process.env.REACT_APP_API_BASE_URL}${imagePath}`;
  };

  // ✅ Fetch section data using SectionMaster ID
  const fetchSection = async (sectionMasterId) => {
    if (!sectionMasterId) {
      console.log("No sectionMasterId provided, skipping fetch");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching section data for celebId:", celebrityId, "sectionMasterId:", sectionMasterId);
      
      // ✅ API call: /data/:celebId/:sectionMasterId
      const res = await getSectionData(celebrityId, sectionMasterId);
      
      console.log("API Response:", res);
      
      if (res.success) {
        setSection(res);
      } else {
        toast.error(res.msg || "Failed to load section data");
        setSection(null);
      }
    } catch (err) {
      console.error("Error fetching section:", err);
      toast.error("Error fetching section data");
      setSection(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSectionMasterId) {
      console.log("Section Master ID changed to:", currentSectionMasterId);
      fetchSection(currentSectionMasterId);
    }
  }, [currentSectionMasterId]);

  // ✅ Handle section change from ProfessionSectionTab
  const handleSectionChange = (sectionMasterId) => {
    console.log("Section Master ID received:", sectionMasterId);
    setCurrentSectionMasterId(sectionMasterId);
  };

  const handleDeleteClick = (dataId) => {
    setDeleteId(dataId);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteTemplateData(
        celebrityId,
        section.sectionName.toLowerCase(),
        deleteId
      );

      if (result.success) {
        toast.success("Data deleted successfully!");
        handleClose();
        fetchSection(currentSectionMasterId);
      } else {
        toast.error(result.msg || "Failed to delete data");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting data");
    }
  };

  return (
    <div className="page-content">
      <ProfessionSectionTab 
        celebId={celebrityId}
        onSectionChange={handleSectionChange} 
      />
      
      <Container fluid>
        <Breadcrumbs
          title="Section Template List"
          breadcrumbItems={[
            { title: "Dashboard", link: "/" },
            { title: "Section Templates", link: "#" },
          ]}
        />

        {!currentSectionMasterId ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading sections...</span>
            </div>
            <p className="text-muted mt-3">Please select a section from the tabs above</p>
          </div>
        ) : loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !section ? (
          <div className="text-center py-5">
            <p className="text-muted">No data found for this section</p>
          </div>
        ) : (
          <Card className="mb-4">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>{section.sectionName} List</h4>
                {/* ✅ Add button with SectionMaster ID */}
                <Link
                  to={`/dashboard/section-template-view/${celebrityId}/${currentSectionMasterId}`}
                  className="btn btn-primary btn-sm"
                >
                  + Add {section.sectionName}
                </Link>
              </div>

              <Table bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "50px" }}>No</th>
                    {section.fields && section.fields.map((f) => (
                      <th key={f._id}>{f.title}</th>
                    ))}
                    <th style={{ width: "150px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {section.data && section.data.length > 0 ? (
                    section.data.map((row, index) => (
                      <tr key={row._id}>
                        <td>{index + 1}</td>
                        {section.fields.map((f) => {
                          const value = row[f.title];

                          if (f.type === "media" && value) {
                            const imageUrl = getImageUrl(value);
                            return (
                              <td key={f._id}>
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={f.title}
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      border: "2px solid #e9ecef",
                                    }}
                                    onError={(e) => {
                                      e.target.src = "/default-image.png";
                                      e.target.onerror = null;
                                    }}
                                  />
                                ) : (
                                  <span className="text-muted">No image</span>
                                )}
                              </td>
                            );
                          }

                          if (f.type === "rich_text" && value) {
                            return (
                              <td key={f._id}>
                                <div 
                                  dangerouslySetInnerHTML={{ __html: value }}
                                  style={{ maxWidth: "300px", overflow: "auto" }}
                                />
                              </td>
                            );
                          }

                          if (f.type === "Multiple Select" && Array.isArray(value)) {
                            return <td key={f._id}>{value.join(", ")}</td>;
                          }

                          if (f.type === "Single Select" && f.options?.length) {
                            const option = f.options.find((o) => o._id === value);
                            return <td key={f._id}>{option ? option.label : ""}</td>;
                          }

                          return <td key={f._id}>{value || "-"}</td>;
                        })}

                        <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                          {/* ✅ Edit button with SectionMaster ID */}
                          <Link
                            to={`/dashboard/section-template-edit/${celebrityId}/${currentSectionMasterId}/${row._id}`}
                            className="btn btn-sm btn-warning me-2"
                            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <i className="bx bx-edit"></i> Edit
                          </Link>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(row._id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <i className="bx bx-trash"></i> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={(section.fields?.length || 0) + 2} className="text-center">
                        No data available. Click "Add {section.sectionName}" to create new entry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        <Modal isOpen={modalOpen} toggle={handleClose} centered>
          <ModalBody className="text-center">
            <h4 className="p-3">Do you really want to delete this record?</h4>
            <div className="d-flex justify-content-center">
              <img
                src={deleteimg}
                alt="Delete Icon"
                width={"70%"}
                className="mb-3"
              />
            </div>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-center">
            <Button color="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default SectionTemplateList;