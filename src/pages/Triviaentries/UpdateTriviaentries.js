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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  gettriviaentriesCategories,
  getTriviaentriesById,
  updateTriviaentries,
} from "../../api/triviaentriesApi";

const UpdateTriviaentries = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [celebrityId, setCelebrityId] = useState("");
  const [optionscat, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [trivia, setTrivia] = useState({
    category_id: "",
    category_name: "",
    title: "",
    description: "",
    media: null,
    source_link: "",
    old_media: "",
  });

  // ✅ Fetch categories and entry data on load
  useEffect(() => {
    fetchCategories();
    fetchTriviaEntry();
  }, [id]);

  // Fetch category dropdown options
  const fetchCategories = async () => {
    try {
      const res_data = await gettriviaentriesCategories();
      if (Array.isArray(res_data.msg)) {
        const options = res_data.msg.map((item) => ({
          value: item._id,
          label: item.name?.trim() || "Unnamed Category",
        }));
        setOptions(options);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Fetch trivia entry by ID
  const fetchTriviaEntry = async () => {
    try {
      const res_data = await getTriviaentriesById(id);
      if (res_data.msg) {
        const entry = res_data.msg;
        setTrivia({
          category_id: entry.category_id || "",
          category_name: entry.category_name || "",
          title: entry.title || "",
          description: entry.description || "",
          source_link: entry.source_link || "",
          old_media: entry.media || "",
        });
        setCelebrityId(entry.celebrityId);
      } else {
        toast.error("Failed to load trivia entry");
      }
    } catch (error) {
      console.error("Error fetching trivia entry:", error);
      toast.error("Error loading trivia entry");
    }
  };

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✅ Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!trivia.title) newErrors.title = "Title is required";
    if (!trivia.category_id) newErrors.category_id = "Category is required";
    if (!trivia.description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const adminid = localStorage.getItem("adminid");
      const formData = new FormData();
      formData.append("category_id", trivia.category_id);
      formData.append("category_name", trivia.category_name);
      formData.append("title", trivia.title);
      formData.append("description", trivia.description);
      formData.append("source_link", trivia.source_link);
      formData.append("updatedBy", adminid);
      if (trivia.media) formData.append("media", trivia.media);

      const res_data = await updateTriviaentries(id, formData);

      if (res_data.success === false) {
        toast.error(res_data.msg || "Failed to update entry");
        return;
      }

      toast.success("Trivia Entry updated successfully!");
      navigate(`/dashboard/triviaentries-list/${celebrityId}`);
    } catch (error) {
      console.error("Update Trivia Entry Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update Trivia Entry"
          breadcrumbItems={["Trivia Entries", "Update"]}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>
                  <Row>
                    {/* Category Select */}
                    <Col md="6">
                      <Label className="form-label">Trivia Category</Label>
                      <Select
                        options={optionscat}
                        name="category_id"
                        value={
                          optionscat.find(
                            (option) => option.value === trivia.category_id
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setTrivia((prev) => ({
                            ...prev,
                            category_id: selectedOption
                              ? selectedOption.value
                              : "",
                            category_name: selectedOption
                              ? selectedOption.label
                              : "",
                          }));
                        }}
                        isClearable
                        placeholder="Select category..."
                      />
                      {errors.category_id && (
                        <span className="text-danger">
                          {errors.category_id}
                        </span>
                      )}
                    </Col>

                    {/* Title */}
                    <Col md="6">
                      <Label className="form-label">Title</Label>
                      <Input
                        name="title"
                        value={trivia.title}
                        onChange={handleInput}
                        placeholder="Enter title"
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    {/* Description */}
                    <Col md="12">
                      <Label className="form-label">Description</Label>
                      <Input
                        type="textarea"
                        rows="4"
                        name="description"
                        value={trivia.description}
                        onChange={handleInput}
                        placeholder="Enter description"
                      />
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description}
                        </span>
                      )}
                    </Col>

                    {/* Media */}
                    <Col md="6">
                      <Label className="form-label">Media (optional)</Label>
                      <Input
                        type="file"
                        name="media"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                      />
                      {trivia.old_media && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/triviaentries/${trivia.old_media}`}
                            alt="Old Media"
                            width="120"
                            className="rounded border"
                          />
                        </div>
                      )}
                    </Col>

                    {/* Source Link */}
                    <Col md="6">
                      <Label className="form-label">
                        Source Link (optional)
                      </Label>
                      <Input
                        name="source_link"
                        value={trivia.source_link}
                        onChange={handleInput}
                        placeholder="Enter source link"
                      />
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Update Trivia Entry
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() =>
                        navigate(`/dashboard/triviaentries-list/${celebrityId}`)
                      }
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

export default UpdateTriviaentries;
