import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Label,
  Row,
  Col,
  Container,
  Card,
  CardBody,
} from "reactstrap";
import { toast } from "react-toastify";
import RichTextEditor from "../../components/editor/RichTextEditor";
import {
  getSectionTemplateById,
  getTemplateDataById,
  updateTemplateData,
} from "../../api/TemplateApi";

const TemplateEdit = () => {
  const { celebId, sectionId, dataId } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [mediaPreviews, setMediaPreviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionRes = await getSectionTemplateById(sectionId);
        const dataRes = await getTemplateDataById(celebId, sectionId, dataId);

        console.log("Section Response:", sectionRes);
        console.log("Data Response:", dataRes);

        const sectionData = sectionRes.data;
        const existingData = dataRes.data || {};

        setSection(sectionData);

        // ✅ Map field IDs to actual data values using field.title
        const initialData = {};
        sectionData.fieldsConfig?.forEach((field) => {
          const fieldTitle = field.title;
          const value = existingData[fieldTitle];

          if (field.type === "media") {
            initialData[field._id] = value || null;
          } else if (field.type === "Multiple Select") {
            initialData[field._id] = Array.isArray(value) ? value : [];
          } else {
            initialData[field._id] = value || "";
          }
        });

        setFormData(initialData);
      } catch (err) {
        console.error("Error loading edit data:", err);
        toast.error("Failed to load section data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [celebId, sectionId, dataId]);

  const handleChange = (fieldId, value, type) => {
    // ✅ Ensure value is string for text fields (not object)
    let finalValue = value;
    
    if (type !== "media" && typeof value === "object" && value !== null && !Array.isArray(value)) {
      finalValue = JSON.stringify(value);
    }
    
    setFormData((prev) => ({ ...prev, [fieldId]: finalValue }));

    if (type === "media" && value) {
      setMediaPreviews((prev) => ({
        ...prev,
        [fieldId]: URL.createObjectURL(value),
      }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // ✅ Validate required fields
    section.fieldsConfig?.forEach((field) => {
      const value = formData[field._id];

      if (field.isRequired === "true" || field.isRequired === true) {
        if (field.type === "Multiple Select") {
          if (!value || value.length === 0) {
            newErrors[field._id] = `${field.title} is required`;
          }
        } else if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field._id] = `${field.title} is required`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("celebId", celebId);
      formDataToSend.append("templateId", sectionId);
      formDataToSend.append("dataId", dataId);
      formDataToSend.append("sectionName", section.name.toLowerCase());

      section.fieldsConfig?.forEach((field) => {
        const value = formData[field._id];
        if (value instanceof File) {
          formDataToSend.append(`${section.name}.${field.title}`, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) =>
            formDataToSend.append(`${section.name}.${field.title}[]`, v)
          );
        } else {
          formDataToSend.append(`${section.name}.${field.title}`, value || "");
        }
      });

      const result = await updateTemplateData(formDataToSend);

      if (result.success) {
        toast.success("Data updated successfully!");
        navigate(`/dashboard/section-template-list/${celebId}/${sectionId}`);
      } else {
        toast.error(result.msg || "Failed to update data");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating data");
    }
  };

  if (loading) return <p>Loading section...</p>;
  if (!section) return <p>Section not found!</p>;

  return (
    <div className="page-content">
      <Container fluid>
        <Card>
          <CardBody>
            <h4 className="mb-4">
              Edit Section: {section.name} ({section.fieldsConfig?.length} fields)
            </h4>

            <Row>
              {section.fieldsConfig?.map((field) => (
                <Col
                  md={field.type === "rich_text" ? "12" : "6"}
                  key={field._id}
                  className="mb-3"
                >
                  <Label>
                    {field.title}
                    {(field.isRequired === "true" || field.isRequired === true) && (
                      <span className="text-danger"> *</span>
                    )}
                  </Label>

                  {/* Short text */}
                  {field.type === "text_short" && (
                    <Input
                      type="text"
                      value={formData[field._id] || ""}
                      onChange={(e) =>
                        handleChange(field._id, e.target.value)
                      }
                      placeholder={field.placeholder || `Enter ${field.title}`}
                    />
                  )}

                  {/* Long text */}
                  {field.type === "text_long" && (
                    <Input
                      type="textarea"
                      rows="4"
                      value={formData[field._id] || ""}
                      onChange={(e) =>
                        handleChange(field._id, e.target.value)
                      }
                      placeholder={field.placeholder || `Enter ${field.title}`}
                    />
                  )}

                  {/* ✅ Rich Text Editor */}
                  {field.type === "rich_text" && (
                    <RichTextEditor
                      value={formData[field._id] || ""}
                      onChange={(data) => handleChange(field._id, data)}
                      height={400}
                    />
                  )}

                  {/* Number */}
                  {field.type === "number" && (
                    <Input
                      type="number"
                      value={formData[field._id] || ""}
                      onChange={(e) =>
                        handleChange(field._id, e.target.value)
                      }
                      placeholder={field.placeholder || `Enter ${field.title}`}
                    />
                  )}

                  {/* Date */}
                  {field.type === "date" && (
                    <Input
                      type="date"
                      value={formData[field._id] || ""}
                      onChange={(e) =>
                        handleChange(field._id, e.target.value)
                      }
                    />
                  )}

                  {/* URL */}
                  {field.type === "url" && (
                    <Input
                      type="url"
                      value={formData[field._id] || ""}
                      onChange={(e) =>
                        handleChange(field._id, e.target.value)
                      }
                      placeholder={field.placeholder || "Enter URL"}
                    />
                  )}

                  {/* Single Select */}
                  {field.type === "Single Select" && (
                    <Input
                      type="select"
                      value={formData[field._id] || ""}
                      onChange={(e) =>
                        handleChange(field._id, e.target.value)
                      }
                    >
                      <option value="">Select {field.title}</option>
                      {field.options?.map((opt) => (
                        <option key={opt._id} value={opt._id}>
                          {opt.label || opt.name || opt.title}
                        </option>
                      ))}
                    </Input>
                  )}

                  {/* Multiple Select */}
                  {field.type === "Multiple Select" && (
                    <div>
                      {field.options?.map((opt) => (
                        <div key={opt._id} className="form-check">
                          <Input
                            type="checkbox"
                            id={`${field._id}-${opt._id}`}
                            checked={(formData[field._id] || []).includes(opt._id)}
                            onChange={(e) => {
                              const currentValues = formData[field._id] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, opt._id]
                                : currentValues.filter((v) => v !== opt._id);
                              handleChange(field._id, newValues);
                            }}
                            className="form-check-input"
                          />
                          <Label
                            for={`${field._id}-${opt._id}`}
                            className="form-check-label"
                          >
                            {opt.label || opt.name || opt.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Media */}
                  {field.type === "media" && (
                    <>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) =>
                          handleChange(
                            field._id,
                            e.target.files[0],
                            "media"
                          )
                        }
                      />
                      {mediaPreviews[field._id] ? (
                        <div className="mt-2">
                          <img
                            src={mediaPreviews[field._id]}
                            alt="Preview"
                            style={{
                              width: 150,
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "2px solid #ddd",
                            }}
                          />
                        </div>
                      ) : formData[field._id] ? (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}${formData[field._id]}`}
                            alt="Current"
                            style={{
                              width: 150,
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "2px solid #ddd",
                            }}
                          />
                        </div>
                      ) : null}
                    </>
                  )}

                  {/* Errors */}
                  {errors[field._id] && (
                    <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                      {errors[field._id]}
                    </div>
                  )}
                </Col>
              ))}
            </Row>

            <div className="mt-4">
              <Button color="primary" onClick={handleSubmit} className="me-2">
                Update
              </Button>
              <Button
                color="secondary"
                onClick={() =>
                  navigate(`/dashboard/section-template-list/${celebId}/${sectionId}`)
                }
              >
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default TemplateEdit;