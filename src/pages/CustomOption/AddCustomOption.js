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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { addcustomoption } from "../../api/customoptionApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Addcustomoption = () => {
  const [customoption, setCustomOption] = useState({
    title: "",
    description: "",
 
    media: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { id } = useParams(); // ✅ match route
  const celebrityId = id; // use it as celebrityId
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add CustomOption", link: "#" },
  ];

 
  const handleInput = (e) => {
    const { name, value } = e.target;
    setCustomOption({ ...customoption, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCustomOption((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // ✅ Validation
    if (!customoption.title) newErrors.title = "Title is required";
    if (!customoption.description)
      newErrors.description = "Description is required";
 

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const adminid = localStorage.getItem("adminid");

      const formData = new FormData();
      formData.append("title", customoption.title);
      formData.append("description", customoption.description);
      formData.append("createdBy", adminid);
      formData.append("celebrityId", celebrityId);

      if (customoption.media) formData.append("media", customoption.media);

      const res_data = await addcustomoption(formData);
      console.log("API Response:", res_data);

      if (res_data?.success === true) {
        toast.success(res_data.msg || "customoption added successfully!");
        setErrors({});
        navigate(`/customoption-list/${celebrityId}`);
      } else if (res_data?.msg === "customoption already exist") {
        toast.error("customoption already exists!");
      } else {
        toast.error(res_data?.msg || "Failed to add customoption");
      }
    } catch (error) {
      console.error("Add customoption Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="CustomOption" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    {/* Title */}
                    <Col md="6">
                      <Label>Title</Label>
                      <Input
                        name="title"
                        type="text"
                        placeholder="Enter title"
                        value={customoption.title}
                        onChange={handleInput}
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    {/* Media */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">Media</Label>
                        <Input
                          type="file"
                          name="media"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
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
                          value={customoption.description}
                          onChange={handleInput}
                          rows="3"
                        />
                        {errors.description && (
                          <span className="text-danger">
                            {errors.description}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Add CustomOption
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/customoption-list/${celebrityId}`)}
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
