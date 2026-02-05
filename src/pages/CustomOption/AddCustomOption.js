import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { addcustomoption } from "../../api/customoptionApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import RichTextEditor from "../../components/editor/RichTextEditor";

const Addcustomoption = () => {
  const [customoption, setCustomOption] = useState({
    title: "",
    description: "",
    media: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const celebrityId = id;

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "CustomOption List", link: `/dashboard/customoption-list/${celebrityId}` },
    { title: "Add CustomOption", link: "#" },
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCustomOption({ ...customoption, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCustomOption((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      
      // Clear error when file is selected
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Title validation (required, min 2, max 200)
    if (!customoption.title || !customoption.title.trim()) {
      newErrors.title = "Title is required";
    } else if (customoption.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (customoption.title.trim().length > 200) {
      newErrors.title = "Title cannot exceed 200 characters";
    }

    // Description validation (optional, max 1000)
    if (customoption.description && customoption.description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const adminid = localStorage.getItem("adminid");

      const formData = new FormData();
      formData.append("title", customoption.title.trim());
      
      // Description is optional
      if (customoption.description && customoption.description.trim()) {
        formData.append("description", customoption.description.trim());
      }
      
      formData.append("createdBy", adminid);
      
      // Backend expects 'celebrity' field (not celebrityId)
      formData.append("celebrity", celebrityId);

      // Media is optional
      if (customoption.media) {
        formData.append("media", customoption.media);
      }

      const res_data = await addcustomoption(formData);
      console.log("API Response:", res_data);

      if (res_data?.success === true) {
        toast.success(res_data.message || res_data.msg || "CustomOption added successfully!");
        setErrors({});
        navigate(`/dashboard/customoption-list/${celebrityId}`);
      } else {
        toast.error(res_data?.message || res_data?.msg || "Failed to add CustomOption");
      }
    } catch (error) {
      console.error("Add CustomOption Error:", error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Add CustomOption" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    {/* Title - Required Field */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          Title <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="title"
                          type="text"
                          placeholder="Enter title (2-200 characters)"
                          value={customoption.title}
                          onChange={handleInput}
                          invalid={!!errors.title}
                          maxLength={200}
                        />
                        {errors.title && (
                          <FormFeedback>{errors.title}</FormFeedback>
                        )}
                        <small className="text-muted">
                          {customoption.title.length}/200 characters
                        </small>
                      </div>
                    </Col>

                    {/* Media - Optional */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">Media</Label>
                        <Input
                          type="file"
                          name="media"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          invalid={!!errors.media}
                        />
                        {errors.media && (
                          <FormFeedback>{errors.media}</FormFeedback>
                        )}
                        {customoption.media && (
                          <small className="text-success d-block mt-1">
                            ✓ Selected: {customoption.media.name}
                          </small>
                        )}
                      </div>
                    </Col>

                    {/* Description - Optional */}
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label">Description</Label>
                        <RichTextEditor
                          value={customoption.description}
                          height={400}
                          onChange={(data) => {
                            setCustomOption((prev) => ({
                              ...prev,
                              description: data,
                            }));
                            // Clear error when user types
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                        />
                        {errors.description && (
                          <div className="text-danger mt-1">
                            {errors.description}
                          </div>
                        )}
                        <small className="text-muted d-block mt-1">
                          {customoption.description.length}/1000 characters (Optional)
                        </small>
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button 
                      type="submit" 
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : (
                        "Add CustomOption"
                      )}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/customoption-list/${celebrityId}`)}
                      disabled={loading}
                    >
                      ← Back
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Addcustomoption;