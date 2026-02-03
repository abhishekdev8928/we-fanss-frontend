import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Button,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  getsectionmasterById,
  updatesectionmaster,
} from "../../api/sectionmasterApi";

const Updatesectionmaster = () => {
  const [sectionmaster, setSectionMaster] = useState({
    name: "",
    slug: "",
    layout: "",
    isRepeater: false,
  });

  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Section Master", link: "/dashboard/sectionmaster-list" },
    { title: "Update", link: "#" },
  ];

  // ─── FETCH DATA ───────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getsectionmasterById(id);
        const data = result.data;

        if (!data) {
          toast.error("Section master not found");
          navigate("/dashboard/sectionmaster-list");
          return;
        }

        setSectionMaster({
          name: data.name || "",
          slug: data.slug || "",
          layout: data.layout || "",
          isRepeater: data.isRepeater || false,
        });

        if (data.fieldsConfig && data.fieldsConfig.length > 0) {
          setFields(
            data.fieldsConfig.map((f) => ({
              title: f.title || "",
              type: f.type || "",
              placeholder: f.placeholder || "",
              isRequired: f.isRequired === true,
              options:
                f.options && Array.isArray(f.options) && f.options.length > 0
                  ? f.options.map((opt) => ({
                      label: opt.label || "",
                      value: opt.value || "",
                    }))
                  : [],
            }))
          );
        }
      } catch (error) {
        console.error("Fetch SectionMaster Error:", error);
        toast.error(error.message || "Failed to fetch section master data");
      }
    };

    fetchData();
  }, [id]);

  // ─── HANDLERS ─────────────────────────────────────────────────
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setSectionMaster((prev) => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));
    } else {
      setSectionMaster((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFields = [...fields];
    updatedFields[index][name] = type === "checkbox" ? checked : value;

    if (name === "type") {
      if (value === "Single Select" || value === "Multiple Select") {
        updatedFields[index].options = [{ label: "", value: "" }];
      } else {
        updatedFields[index].options = [];
      }
    }

    setFields(updatedFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, key, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex][key] = value;
    setFields(updatedFields);
  };

  const addMoreOption = (fieldIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.push({ label: "", value: "" });
    setFields(updatedFields);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(updatedFields);
  };

  const addMoreField = () => {
    setFields([
      ...fields,
      { title: "", type: "", placeholder: "", isRequired: false, options: [] },
    ]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // ─── SUBMIT ───────────────────────────────────────────────────
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!sectionmaster.name) newErrors.name = "Name is required";
    if (!sectionmaster.slug) newErrors.slug = "Slug is required";
    if (!sectionmaster.layout) newErrors.layout = "Layout is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: sectionmaster.name,
        slug: sectionmaster.slug,
        layout: sectionmaster.layout,
        isRepeater: sectionmaster.isRepeater,
        fieldsConfig: fields,
      };

      const response = await updatesectionmaster(id, payload);

      if (!response.success) {
        const errorMsg = response.message || response.error?.message || "Operation failed";

        if (errorMsg.toLowerCase().includes("already exist")) {
          setErrors({ name: errorMsg });
        }

        toast.error(errorMsg);
        return;
      }

      toast.success(response.message || "Section master updated successfully");
      navigate("/dashboard/sectionmaster-list");
    } catch (error) {
      console.error("Update SectionMaster Error:", error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  // ─── UI ───────────────────────────────────────────────────────
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update Section Master"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>

                  {/* ─── BASIC INFO SECTION ─── */}
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 36, height: 36, background: "#eef2ff" }}
                    >
                      <i className="mdi mdi-text-box-outline" style={{ color: "#6366f1", fontSize: 18 }}></i>
                    </div>
                    <h6 className="mb-0 fw-semibold">Basic Information</h6>
                  </div>

                  <Row>
                    <Col md="6">
                      <Label className="fw-semibold">Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter section name"
                        value={sectionmaster.name}
                        onChange={handleInput}
                      />
                      {errors.name && (
                        <span className="text-danger" style={{ fontSize: 12 }}>{errors.name}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label className="fw-semibold">Slug</Label>
                      <Input
                        name="slug"
                        type="text"
                        value={sectionmaster.slug}
                        onChange={handleInput}
                        placeholder="auto-generated-slug"
                        style={{ background: "#f8f9fa" }}
                      />
                      {errors.slug && (
                        <span className="text-danger" style={{ fontSize: 12 }}>{errors.slug}</span>
                      )}
                    </Col>

                    <Col md="6" className="mt-3">
                      <Label className="fw-semibold">Layout</Label>
                      <Input
                        type="select"
                        name="layout"
                        onChange={handleInput}
                        value={sectionmaster.layout}
                      >
                        <option value="">Select Layout</option>
                        <option value="List">List</option>
                        <option value="Cards">Cards</option>
                        <option value="Table">Table</option>
                        <option value="Media Gallery">Media Gallery</option>
                      </Input>
                      {errors.layout && (
                        <span className="text-danger" style={{ fontSize: 12 }}>{errors.layout}</span>
                      )}
                    </Col>

                    {/* ─── REPEATER TOGGLE ─── */}
                    <Col md="6" className="mt-3">
                      <Label className="fw-semibold">Repeater Section</Label>
                      <div
                        className="border rounded p-3 d-flex align-items-center justify-content-between"
                        style={{
                          background: sectionmaster.isRepeater ? "#eef2ff" : "#f8f9fa",
                          border: sectionmaster.isRepeater
                            ? "1.5px solid #6366f1 !important"
                            : "1.5px solid #dee2e6 !important",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() =>
                          setSectionMaster((prev) => ({ ...prev, isRepeater: !prev.isRepeater }))
                        }
                      >
                        <div>
                          <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>
                            {sectionmaster.isRepeater ? "Repeatable" : "Single Use"}
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                            {sectionmaster.isRepeater
                              ? "Multiple entries allowed in this section"
                              : "Single entry allowed in this section"}
                          </p>
                        </div>
                        <div className="form-check form-switch mb-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ width: "3em", height: "1.5em", cursor: "pointer" }}
                            checked={sectionmaster.isRepeater}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* ─── FIELDS CONFIG SECTION ─── */}
                  <hr className="my-4" />

                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 36, height: 36, background: "#ecfdf5" }}
                    >
                      <i className="mdi mdi-view-grid-plus-outline" style={{ color: "#10b981", fontSize: 18 }}></i>
                    </div>
                    <h6 className="mb-0 fw-semibold">Fields Configuration</h6>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3"
                      style={{ background: "#fafafa" }}
                    >
                      <Row className="align-items-center">
                        <Col md="3">
                          <Label className="fw-semibold" style={{ fontSize: 13 }}>Title</Label>
                          <Input
                            name="title"
                            type="text"
                            placeholder="e.g. Heading"
                            value={field.title}
                            onChange={(e) => handleFieldChange(index, e)}
                          />
                        </Col>

                        <Col md="3">
                          <Label className="fw-semibold" style={{ fontSize: 13 }}>Field Type</Label>
                          <Input
                            type="select"
                            name="type"
                            value={field.type}
                            onChange={(e) => handleFieldChange(index, e)}
                          >
                            <option value="">Select Type</option>
                            <option value="text_short">Text (Short)</option>
                            <option value="text_long">Text (Long)</option>
                            <option value="rich_text">Rich Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="url">URL (with Label)</option>
                            <option value="media">Media (Image/Video)</option>
                            <option value="Single Select">Single Select</option>
                            <option value="Multiple Select">Multiple Select</option>
                          </Input>
                        </Col>

                        <Col md="3">
                          <Label className="fw-semibold" style={{ fontSize: 13 }}>Placeholder</Label>
                          <Input
                            name="placeholder"
                            type="text"
                            placeholder="e.g. Enter heading here"
                            value={field.placeholder}
                            onChange={(e) => handleFieldChange(index, e)}
                          />
                        </Col>

                        <Col md="2">
                          <Label className="fw-semibold" style={{ fontSize: 13 }}>&nbsp;</Label>
                          <Label check className="d-flex align-items-center" style={{ fontSize: 13, cursor: "pointer", marginTop: 4 }}>
                            <Input
                              type="checkbox"
                              name="isRequired"
                              checked={field.isRequired}
                              onChange={(e) => handleFieldChange(index, e)}
                              className="me-1"
                            />
                            Required
                          </Label>
                        </Col>

                        <Col md="1">
                          <Label className="fw-semibold" style={{ fontSize: 13 }}>&nbsp;</Label>
                          {index > 0 ? (
                            <Button
                              color="danger"
                              outline
                              size="sm"
                              type="button"
                              onClick={() => removeField(index)}
                              style={{ marginTop: 2 }}
                            >
                              <i className="mdi mdi-close"></i>
                            </Button>
                          ) : null}
                        </Col>
                      </Row>

                      {/* ─── OPTIONS (only for select types) ─── */}
                      {(field.type === "Single Select" || field.type === "Multiple Select") && (
                        <div className="mt-3 p-3 rounded" style={{ background: "#f0fdf4", border: "1px dashed #86efac" }}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="fw-semibold" style={{ fontSize: 13 }}>
                              <i className="mdi mdi-menu-down-circle-outline me-1" style={{ color: "#10b981" }}></i>
                              {field.type} Options
                            </span>
                            <Button
                              color="success"
                              outline
                              size="sm"
                              type="button"
                              onClick={() => addMoreOption(index)}
                            >
                              <i className="mdi mdi-plus me-1"></i>Add Option
                            </Button>
                          </div>

                          {field.options.map((opt, optIndex) => (
                            <div key={optIndex} className="d-flex align-items-center gap-2 mb-2">
                              <span className="text-muted" style={{ fontSize: 12, width: 22 }}>{optIndex + 1}.</span>
                              <Input
                                type="text"
                                placeholder="Label"
                                value={opt.label}
                                onChange={(e) => handleOptionChange(index, optIndex, "label", e.target.value)}
                                className="flex-grow-1"
                              />
                              <Input
                                type="text"
                                placeholder="Value"
                                value={opt.value}
                                onChange={(e) => handleOptionChange(index, optIndex, "value", e.target.value)}
                                className="flex-grow-1"
                                style={{ background: "#f8f9fa" }}
                              />
                              {optIndex > 0 && (
                                <Button
                                  color="danger"
                                  outline
                                  size="sm"
                                  type="button"
                                  onClick={() => removeOption(index, optIndex)}
                                  style={{ padding: "4px 8px" }}
                                >
                                  <i className="mdi mdi-close"></i>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* ─── ADD FIELD BUTTON ─── */}
                  <Button
                    color="secondary"
                    outline
                    type="button"
                    onClick={addMoreField}
                    className="mt-1"
                  >
                    <i className="mdi mdi-plus me-1"></i>Add More Field
                  </Button>

                  {/* ─── SUBMIT ─── */}
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: "1px solid #eee" }}>
                    <Button
                      color="secondary"
                      outline
                      type="button"
                      onClick={() => navigate("/dashboard/sectionmaster-list")}
                    >
                      <i className="mdi mdi-arrow-left me-1"></i>Back
                    </Button>
                    <Button color="primary" type="submit">
                      <i className="mdi mdi-pencil-outline me-1"></i>Update Section Master
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

export default Updatesectionmaster;