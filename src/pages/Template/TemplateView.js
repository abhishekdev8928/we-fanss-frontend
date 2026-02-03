import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSectionTemplateById, saveTemplateData } from "../../api/TemplateApi";
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

const Template = () => {
  const { id, celebId } = useParams(); // id = Section Master ID
  const [section, setSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [mediaPreviews, setMediaPreviews] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await getSectionTemplateById(id);
        const data = res.data;

        setSection(data);

        // Initialize form fields dynamically
        const initialData = {};
        data.fieldsConfig?.forEach((field) => {
          if (field.type === "media") {
            initialData[field._id] = null;
          } else if (field.type === "Multiple Select") {
            initialData[field._id] = [];
          } else {
            initialData[field._id] = "";
          }
        });
        setFormData(initialData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load section master");
      }
    };

    fetchSection();
  }, [id]);

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
      // ✅ Prepare FormData
      const formDataToSend = new FormData();
      formDataToSend.append("celebId", celebId);
      formDataToSend.append("templateId", id); // actually sectionId here
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

      const result = await saveTemplateData(formDataToSend);

      if (result.success) {
        toast.success("Data saved successfully!");
        // Reset form
        const initialData = {};
        section.fieldsConfig?.forEach((field) => {
          if (field.type === "media") {
            initialData[field._id] = null;
          } else if (field.type === "Multiple Select") {
            initialData[field._id] = [];
          } else {
            initialData[field._id] = "";
          }
        });
        setFormData(initialData);
        setMediaPreviews({});
        setErrors({});
        navigate(`/dashboard/section-template-list/${celebId}/${id}`);
      } else {
        toast.error(result.msg || "Failed to save data");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Error saving data");
    }
  };

  if (!section) return <p>Loading section...</p>;

  return (
    <div className="page-content">
      <Container fluid>
        <Card>
          <CardBody>
            <h4 className="mb-4">
              Section: {section.name} ({section.fieldsConfig?.length} fields)
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
                      {mediaPreviews[field._id] && (
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
                      )}
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
              <Button color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Template;