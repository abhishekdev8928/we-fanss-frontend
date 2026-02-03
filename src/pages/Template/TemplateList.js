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

const SectionTemplateList = () => {
  const { celebId, id } = useParams();

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${process.env.REACT_APP_API_BASE_URL}${imagePath}`;
  };

  const fetchSection = async () => {
    try {
      const res = await getSectionData(celebId, id);
      if (res.success) {
        setSection(res);
      } else {
        toast.error(res.msg || "Failed to load section data");
      }
    } catch (err) {
      console.error("Error fetching section:", err);
      toast.error("Error fetching section data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, [celebId, id]);

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
        celebId,
        section.sectionName.toLowerCase(),
        deleteId
      );

      if (result.success) {
        toast.success("Data deleted successfully!");
        handleClose();
        fetchSection();
      } else {
        toast.error(result.msg || "Failed to delete data");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting data");
    }
  };

  if (loading) return <p>Loading section...</p>;
  if (!section) return <p>Section not found!</p>;

  const { sectionName, fields, data } = section;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Section Template List"
          breadcrumbItems={[
            { title: "Dashboard", link: "/" },
            { title: "Section Templates", link: "#" },
          ]}
        />

        <Card className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Section: {sectionName}</h4>
              <Link
                to={`/dashboard/section-template-view/${celebId}/${id}`}
                className="btn btn-primary btn-sm"
              >
                ADD
              </Link>
            </div>

            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>No.</th>
                  {fields.map((f) => (
                    <th key={f._id}>{f.title}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={row._id}>
                      <td>{index + 1}</td>
                      {fields.map((f) => {
                        const value = row[f.title];

                        // ✅ Handle image/media type
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

                        // ✅ Handle rich text (HTML)
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

                        // ✅ Handle Multiple Select
                        if (f.type === "Multiple Select" && Array.isArray(value)) {
                          return <td key={f._id}>{value.join(", ")}</td>;
                        }

                        // ✅ Handle Single Select
                        if (f.type === "Single Select" && f.options?.length) {
                          const option = f.options.find((o) => o._id === value);
                          return <td key={f._id}>{option ? option.label : ""}</td>;
                        }

                        // ✅ Default text
                        return <td key={f._id}>{value || "-"}</td>;
                      })}

                      <td>
                        <Link
                          to={`/dashboard/section-template-edit/${celebId}/${id}/${row._id}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Edit
                        </Link>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(row._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length + 2} className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>

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