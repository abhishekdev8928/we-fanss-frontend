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
  FormFeedback,
  Spinner,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { getcustomoptionById, updatecustomoption } from "../../api/customoptionApi";
import RichTextEditor from "../../components/editor/RichTextEditor";

const Updatecustomoption = () => {
  const [customoption, setcustomoption] = useState({
    title: "",
    description: "",
    media: null,
    old_media: null, // Store the old media object {path, type}
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const [celebrityId, setCelebrityId] = useState("");
  const [editorKey, setEditorKey] = useState(0);

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "CustomOption List", link: celebrityId ? `/dashboard/customoption-list/${celebrityId}` : "#" },
    { title: "Update CustomOption", link: "#" },
  ];
  
  // Fetch customoption data
  useEffect(() => {
    const fetchcustomoption = async () => {
      try {
        setLoading(true);
        const res_data = await getcustomoptionById(id);

        if (res_data?.success && res_data?.data) {
          const data = res_data.data;
          
          console.log('Fetched CustomOption data:', data);
          console.log('Media object:', data.media);
          
          setcustomoption({
            title: data.title || "",
            description: data.description || "",
            old_media: data.media || null, // {path: "...", type: "image/video"}
            media: null,
          });
          
          // Extract celebrityId from the data
          if (data.celebrity?._id) {
            setCelebrityId(data.celebrity._id);
          } else if (data.celebrity) {
            setCelebrityId(data.celebrity);
          }
          
          setEditorKey((prev) => prev + 1);
        } else {
          toast.error(res_data?.message || "CustomOption not found");
          navigate("/dashboard/celebrity-list");
        }
      } catch (error) {
        console.error("Fetch customoption error:", error);
        toast.error("Failed to fetch customoption data");
        navigate("/dashboard/celebrity-list");
      } finally {
        setLoading(false);
      }
    };

    fetchcustomoption();
  }, [id]);

  // Input handler
  const handleInput = (e) => {
    const { name, value } = e.target;
    setcustomoption({ ...customoption, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setcustomoption((prev) => ({ ...prev, [name]: files[0] }));
      
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

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      const adminid = localStorage.getItem("adminid");
      const formData = new FormData();

      formData.append("title", customoption.title.trim());
      
      // Description is optional
      if (customoption.description && customoption.description.trim()) {
        formData.append("description", customoption.description.trim());
      }
      
      formData.append("updatedBy", adminid);
      
      // Only append media if a new file is selected
      if (customoption.media) {
        formData.append("media", customoption.media);
      }

      const res_data = await updatecustomoption(id, formData);

      if (res_data?.success) {
        toast.success(res_data.message || "CustomOption updated successfully!");
        navigate(`/dashboard/customoption-list/${celebrityId}`);
      } else {
        toast.error(res_data?.message || res_data?.msg || "Failed to update CustomOption");
      }
    } catch (error) {
      console.error("Update customoption Error:", error);
      
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
      setSubmitting(false);
    }
  };

  // Get media URL
  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return null;
    
    // If it's already a full URL, return as is
    if (mediaPath.startsWith('http')) {
      return mediaPath;
    }
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = mediaPath.startsWith('/') ? mediaPath.substring(1) : mediaPath;
    
    // Construct the full URL
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const fullUrl = `${baseUrl}/${cleanPath}`;
    
    console.log('Media URL Construction:', { mediaPath, cleanPath, baseUrl, fullUrl });
    
    return fullUrl;
  };

  // Render media preview
  const renderMediaPreview = () => {
    if (!customoption.old_media || !customoption.old_media.path) {
      return null;
    }

    const mediaUrl = getMediaUrl(customoption.old_media.path);
    const mediaType = customoption.old_media.type;

    console.log('Media Preview:', { mediaUrl, mediaType, old_media: customoption.old_media });

    return (
      <div className="mt-2">
        <small className="text-muted d-block mb-1">Current {mediaType === 'video' ? 'Video' : 'Image'}:</small>
        
        {mediaType === "video" ? (
          <video
            src={mediaUrl}
            controls
            style={{ maxWidth: '200px', maxHeight: '150px' }}
            className="rounded border"
            onError={(e) => {
              console.error('Failed to load video:', mediaUrl);
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="Current Media"
            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
            className="rounded border"
            onError={(e) => {
              console.error('Failed to load image:', mediaUrl);
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23f0f0f0" width="200" height="150"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">Image not found</text></svg>';
            }}
            onLoad={(e) => {
              console.log('✅ Image loaded successfully:', mediaUrl);
            }}
          />
        )}
      </div>
    );
  };

  // Render new file preview
  const renderNewFilePreview = () => {
    if (!customoption.media) return null;

    const file = customoption.media;
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    return (
      <div className="mt-2">
        <small className="text-success d-block mb-1">
          <i className="mdi mdi-check-circle me-1"></i>
          New {isVideo ? 'Video' : 'Image'}: {file.name}
        </small>
        
        {isVideo ? (
          <video
            src={fileUrl}
            controls
            style={{ maxWidth: '200px', maxHeight: '150px' }}
            className="rounded border"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={fileUrl}
            alt="New Media Preview"
            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
            className="rounded border"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-5">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Loading CustomOption data...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update CustomOption"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form
                  className="needs-validation"
                  onSubmit={handleUpdateSubmit}
                >
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
                        
                        {/* Show new file preview if selected, otherwise show current media */}
                        {customoption.media ? renderNewFilePreview() : renderMediaPreview()}
                      </div>
                    </Col>

                    {/* Description - Optional */}
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label">Description</Label>
                        <RichTextEditor
                          key={editorKey}
                          value={customoption.description}
                          height={400}
                          onChange={(data) => {
                            setcustomoption((prev) => ({
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
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        "Update CustomOption"
                      )}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/customoption-list/${celebrityId}`)}
                      disabled={submitting}
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

export default Updatecustomoption;