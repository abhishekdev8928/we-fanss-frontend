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
import { getcustomoptionById, updatecustomoption } from "../../api/customoptionApi";

const Updatecustomoption = () => {
  const [customoption, setcustomoption] = useState({
    name: "",
    description: "",
  

    media: null,
    old_image: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const [celebrityId, setCelebrityId] = useState("");

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Update Profession Master", link: "#" },
  ];
  
  // Fetch customoption data
  useEffect(() => {
    const fetchcustomoption = async () => {
      try {
        const res_data = await getcustomoptionById(id);

        if (res_data.msg) {
          const data = res_data.msg;
          setcustomoption({
            title: data.title || "",
            description: data.description || "",
        
            old_image: data.media || "",
          });
          setCelebrityId(data.celebrityId);
        } else {
          toast.error("customoption not found");
        }
      } catch (error) {
        console.error("Fetch customoption error:", error);
        toast.error("Failed to fetch customoption data");
      }
    };

    fetchcustomoption();
  }, [id]);

  // Input handler
  const handleInput = (e) => {
    setcustomoption({ ...customoption, [e.target.name]: e.target.value });
  };
  // Handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setcustomoption((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✅ Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

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
      

      formData.append("updatedBy", adminid);
      if (customoption.media) formData.append("media", customoption.media);

      const res_data = await updatecustomoption(id, formData);

      if (
        res_data.success === false ||
        res_data.msg === "customoption already exist"
      ) {
        toast.error(res_data.msg || "Failed to update customoption");
        return;
      }

      toast.success("customoption updated successfully!");
      navigate(`/customoption-list/${celebrityId}`);
    } catch (error) {
      console.error("Update customoption Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="UPDATE 
Profession Master"
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
                    <Col md="6">
                      <Label> Title</Label>
                      <Input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={customoption.title} // ✅ correct usage
                        onChange={handleInput}
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>
                    {/* Main Image */}
                    <Col md="6">
                      <Label className="form-label">Media</Label>
                      <Input
                        type="file"
                        name="media"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {customoption.old_image && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/customoption/${customoption.old_image}`}
                            alt="Main"
                            width="100"
                            className="rounded border"
                          />
                        </div>
                      )}
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
                      Update customoption
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

export default Updatecustomoption;
