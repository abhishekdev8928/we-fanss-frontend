import React, { useState, useEffect } from "react";
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
import {
  addprofessionalmaster,
  getSectionTemplateOptions,
} from "../../api/professionalmasterApi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const Addprofessionalmaster = () => {
  const [professionalmaster, setprofessionalmaster] = useState({
    name: "",
    slug: "",
    image: null,
    sectiontemplate: [],
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [sectiontemplateOptions, setSectionTemplateOptions] = useState([]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Professional Master", link: "/dashboard/professional-list" },
    { title: "Add New", link: "#" },
  ];

  // Fetch section template options on mount
  useEffect(() => {
    fetchSectionTemplateOptions();
  }, []);

  const fetchSectionTemplateOptions = async () => {
    try {
      const data = await getSectionTemplateOptions();
      const options = (data.data || data.msg || []).map((item) => ({
        value: item._id,
        label: item.title?.trim() || item.name?.trim() || "Untitled",
      }));
      setSectionTemplateOptions(options);
    } catch (err) {
      console.error("Error fetching section template options:", err);
      toast.error("Failed to load section templates");
    }
  };

  // Handle text input changes
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setprofessionalmaster({
        ...professionalmaster,
        name: value,
        slug: generatedSlug,
      });
    } else {
      setprofessionalmaster({ ...professionalmaster, [name]: value });
    }
  };

  // Handle file selection with preview
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }

      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }

      setprofessionalmaster((prev) => ({
        ...prev,
        [name]: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setprofessionalmaster((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    const fileInput = document.querySelector('input[name="image"]');
    if (fileInput) fileInput.value = "";
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!professionalmaster.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (professionalmaster.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!professionalmaster.slug?.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!professionalmaster.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const adminid = localStorage.getItem("adminid");
      const formData = new FormData();

      formData.append("name", professionalmaster.name.trim());
      formData.append("slug", professionalmaster.slug.trim());

      if (professionalmaster.sectiontemplate.length > 0) {
        formData.append(
          "sectiontemplate",
          JSON.stringify(professionalmaster.sectiontemplate)
        );
      }

      if (adminid) {
        formData.append("createdBy", adminid);
      }

      if (professionalmaster.image) {
        formData.append("image", professionalmaster.image);
      }

      const res_data = await addprofessionalmaster(formData);

      if (res_data.success === false) {
        toast.error(res_data.message || res_data.msg || "Failed to add");
        setIsSubmitting(false);
        return;
      }

      toast.success("Professional master added successfully!");
      navigate("/dashboard/professional-list");
    } catch (error) {
      console.error("Add professional master Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Add Professional Master"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    {/* Name Field */}
                    <Col md="6" className="mb-3">
                      <Label className="form-label">Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter profession name"
                        value={professionalmaster.name}
                        onChange={handleInput}
                        invalid={!!errors.name}
                      />
                      {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
                    </Col>

                    {/* Image Upload */}
                    <Col md="6" className="mb-3">
                      <Label className="form-label">Image</Label>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        invalid={!!errors.image}
                      />
                      {errors.image && <FormFeedback>{errors.image}</FormFeedback>}

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-3">
                          <div className="position-relative d-inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="rounded border"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                           
                          </div>
                        </div>
                      )}
                    </Col>

                    {/* Slug Field */}
                    <Col md="6" className="mb-3">
                      <Label className="form-label">Slug</Label>
                      <Input
                        name="slug"
                        type="text"
                        placeholder="Auto-generated from name"
                        value={professionalmaster.slug}
                        onChange={handleInput}
                        invalid={!!errors.slug}
                      />
                      {errors.slug && <FormFeedback>{errors.slug}</FormFeedback>}
                    </Col>

                    {/* Section Templates */}
                    <Col md="6" className="mb-3">
                      <Label className="form-label">Default Section Templates</Label>
                      <Select
                        isMulti
                        name="sectiontemplate"
                        options={sectiontemplateOptions}
                        value={sectiontemplateOptions.filter((opt) =>
                          professionalmaster.sectiontemplate.includes(opt.value)
                        )}
                        onChange={(selectedOptions) =>
                          setprofessionalmaster((prev) => ({
                            ...prev,
                            sectiontemplate: selectedOptions.map(
                              (opt) => opt.value
                            ),
                          }))
                        }
                        placeholder="Select templates..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div className="mt-4 d-flex gap-2">
                    <Button
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Adding...
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                    <Button
                      color="secondary"
                      type="button"
                      onClick={() => navigate("/dashboard/professional-list")}
                      disabled={isSubmitting}
                    >
                      Cancel
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

export default Addprofessionalmaster;