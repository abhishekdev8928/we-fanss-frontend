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
import {
  addtriviaentries,
  gettriviaentriesCategories,
} from "../../api/triviaentriesApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const AddTriviaEntries = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/" },
    { title: "Add Trivia Entries", link: "#" },
  ]);

  const [optionscat, setOptions] = useState([]);
  const [trivia, setTrivia] = useState({
    category_id: "",
    category_name: "",
    title: "",
    description: "",
    media: null,
    source_link: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { id } = useParams(); // ✅ match route
  const celebrityId = id; // use it as celebrityId
  const handleInput = (e) => {
    const { name, value } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✅ Submit form
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!trivia.category_id) newErrors.category_id = "Category is required";
    if (!trivia.title) newErrors.title = "Title is required";
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
      formData.append("createdBy", adminid);
      formData.append("celebrityId", celebrityId);
      if (trivia.media) formData.append("media", trivia.media);

      const res_data = await addtriviaentries(formData);

      if (res_data.success === false) {
        toast.error(res_data.msg || "Failed to add Trivia Entry");
        return;
      }

      toast.success("Trivia Entry added successfully!");
      setErrors({});
      navigate(`/dashboard/triviaentries-list/${celebrityId}`);
      setTrivia({
        category_id: "",
        category_name: "",
        title: "",
        description: "",
        media: null,
        source_link: "",
      });
    } catch (error) {
      console.error("Add Trivia Entry Error:", error);
      toast.error("Something went wrong!");
    }
  };

  // ✅ Fetch category options
  const fetchOptions = async () => {
    try {
      const res_data = await gettriviaentriesCategories();
      const options = Array.isArray(res_data.msg)
        ? res_data.msg.map((item) => ({
            value: item._id,
            label: item.name?.trim() || item.name,
          }))
        : [];
      setOptions(options);
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Add Trivia Entries"
            breadcrumbItems={["Trivia Entries", "Add"]}
          />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <form className="needs-validation" onSubmit={handleAddSubmit}>
                    <Row>
                      {/* Trivia Category */}
                      <Col md="6">
                        <div className="mb-3">
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
                        </div>
                      </Col>

                      {/* Title */}
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Title</Label>
                          <Input
                            value={trivia.title || ""}
                            onChange={handleInput}
                            name="title"
                            placeholder="Enter trivia title"
                            type="text"
                          />
                          {errors.title && (
                            <span className="text-danger">{errors.title}</span>
                          )}
                        </div>
                      </Col>

                      {/* Description */}
                      <Col md="12">
                        <div className="mb-3">
                          <Label className="form-label">Description</Label>
                          <Input
                            type="textarea"
                            name="description"
                            placeholder="Enter description"
                            value={trivia.description}
                            onChange={handleInput}
                            rows="4"
                          />
                          {errors.description && (
                            <span className="text-danger">
                              {errors.description}
                            </span>
                          )}
                        </div>
                      </Col>

                      {/* Media (optional) */}
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Media (optional)</Label>
                          <Input
                            type="file"
                            name="media"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                          />
                          {trivia.media && (
                            <small className="text-success">
                              {trivia.media.name}
                            </small>
                          )}
                        </div>
                      </Col>

                      {/* Source Link (optional) */}
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">
                            Source Link (optional)
                          </Label>
                          <Input
                            type="text"
                            name="source_link"
                            placeholder="Enter source link"
                            value={trivia.source_link}
                            onChange={handleInput}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex gap-2 mt-3">
                      <Button type="submit" color="primary">
                        Add Trivia Entry
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
    </React.Fragment>
  );
};

export default AddTriviaEntries;
