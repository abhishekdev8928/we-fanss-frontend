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
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { toast } from "react-toastify";
import { getLanguageOptions, addPositions } from "../../api/positionsApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useDropzone } from "react-dropzone";

const AddPositions = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Add Positions", link: "#" },
  ]);
  const navigate = useNavigate();

  const { id } = useParams(); // ✅ match route
  const celebrityId = id; // use it as celebrityId

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    level: "",
    from_date: "",
    to_date: "",
    current: "",
    state: "",
    constituency: "",
    party: "",
    reporting: "",
    work: "",
    reference: [],
    sort: "",
    statusnew: "Draft", // ✅ Default value
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [languagesOptions, setLanguageOptions] = useState([]);

  useEffect(() => {
    fetchLanguageOptions();
  }, []);

  const fetchLanguageOptions = async () => {
    try {
      const data = await getLanguageOptions();
      const options = (data.msg || []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setLanguageOptions(options);
    } catch (err) {
      console.error("Error fetching language options:", err);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (selectedDates, name) => {
    const formattedDate = selectedDates[0].toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, [name]: formattedDate }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };
  // ✅ Handle Watch Links repeater
  const handleAddWatchLink = () => {
    setFormData((prev) => ({
      ...prev,
      reference: [...prev.reference, { label: "", url: "", type: "" }],
    }));
  };

  const handleRemoveWatchLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      reference: prev.reference.filter((_, i) => i !== index),
    }));
  };

  const handleWatchLinkChange = (index, field, value) => {
    const updated = [...formData.reference];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, reference: updated }));
  };
  // ✅ Handle Seasons repeater
  const handleAddSeason = () => {
    setFormData((prev) => ({
      ...prev,
      seasons: [
        ...(prev.seasons || []),
        { season_no: "", episodes: "", year: "", watch_link: "" },
      ],
    }));
  };

  const handleRemoveSeason = (index) => {
    setFormData((prev) => ({
      ...prev,
      seasons: prev.seasons.filter((_, i) => i !== index),
    }));
  };

  const handleSeasonChange = (index, field, value) => {
    const updated = [...formData.seasons];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, seasons: updated }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title)
      if (!formData.title) newErrors.title = "Position Title is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("level", formData.level);
      formDataToSend.append("from_date", formData.from_date);
      formDataToSend.append("to_date", formData.to_date);
      formDataToSend.append("current", formData.current);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("constituency", formData.constituency);
      formDataToSend.append("party", formData.party);
      formDataToSend.append("reporting", formData.reporting);
      formDataToSend.append("work", formData.work);
      formDataToSend.append("reference", JSON.stringify(formData.reference));
      formDataToSend.append("sort", formData.sort);
      formDataToSend.append("statusnew", formData.statusnew);
      formDataToSend.append("celebrityId", celebrityId);

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const adminid = localStorage.getItem("adminid");
      formDataToSend.append("createdBy", adminid);

      // Call backend API
      const result = await addPositions(formDataToSend);

      if (!result.status) {
        toast.error(result.msg || "Failed to add Positions.");
        return;
      }

      toast.success("Positions added successfully!");
      navigate(`/list-positions/${celebrityId}`);

      // Reset form
      setFormData({
        title: "",
        department: "",
        level: "",
        from_date: "",
        to_date: "",
        current: "",
        state: "",
        constituency: "",
        party: "",
        reporting: "",
        work: "",
        reference: [],
        sort: "",
        statusnew: "Draft", // ✅ Default value
      });
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      console.error("Add Positions Error:", err);
      toast.error("Something went wrong while adding the Positions.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ADD positions" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Position Title </Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        placeholder="Position Title"
                        type="text"
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Department / Ministry </Label>
                      <Input
                        name="department"
                        value={formData.department}
                        onChange={handleInput}
                        placeholder="Department / Ministry"
                        type="text"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Government Level</Label>
                      <Input
                        type="select"
                        name="level"
                        onChange={handleInput}
                        value={formData.level}
                      >
                        <option value="">Select</option>
                        <option value="Central">Central </option>
                        <option value="State">State </option>

                        <option value="Local">Local </option>
                        <option value="Party">Party </option>
                      </Input>
                    </Col>

                    <Col md="6">
                      <Label>From Date </Label>
                      <Input
                        name="from_date"
                        value={formData.from_date}
                        onChange={handleInput}
                        placeholder="From Date"
                        type="date"
                      />
                    </Col>
                    <Col md="6">
                      <Label>To Date </Label>
                      <Input
                        name="to_date"
                        value={formData.to_date}
                        onChange={handleInput}
                        placeholder="To Date"
                        type="date"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Is Current </Label>
                      <Input
                        name="current"
                        value={formData.current}
                        onChange={handleInput}
                        placeholder="Is Current"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>State </Label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInput}
                        placeholder="State "
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Constituency / Region </Label>
                      <Input
                        name="constituency"
                        value={formData.constituency}
                        onChange={handleInput}
                        placeholder="Constituency / Region"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Party / Affiliation </Label>
                      <Input
                        name="party"
                        value={formData.party}
                        onChange={handleInput}
                        placeholder="Party / Affiliation "
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Reporting To / Under </Label>
                      <Input
                        name="reporting"
                        value={formData.reporting}
                        onChange={handleInput}
                        placeholder="Reporting To / Under"
                        type="text"
                      />
                    </Col>

                    <Col md="12">
                      <Label>Major Work / Achievements </Label>
                      <Input
                        type="textarea"
                        name="work"
                        value={formData.work}
                        onChange={handleInput}
                        placeholder="Major Work / Achievements "
                      />
                    </Col>

                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          {" "}
                          Media (Image/Video)
                        </Label>
                        <Input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {formData.old_image && (
                          <div className="mt-2">
                            <img
                              src={`${process.env.REACT_APP_API_BASE_URL}/positions/${formData.old_image}`}
                              alt="Main"
                              width="100"
                              className="rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col md="6">
                      <Label>Sort Order </Label>
                      <Input
                        name="sort"
                        value={formData.sort}
                        onChange={handleInput}
                        placeholder="Sort Order"
                        type="number"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Status </Label>
                      <Input
                        type="select"
                        name="statusnew"
                        onChange={handleInput}
                        value={formData.statusnew}
                      >
                        <option value="">Select</option>
                        <option value="Draft">Draft </option>
                        <option value="Published">Published </option>
                      </Input>
                    </Col>

                    {/* ✅ WATCH LINKS SECTION */}
                    <Col md="12" className="mt-4">
                      <h5>Reference Link(s)</h5>
                      {formData.reference.map((link, index) => (
                        <Row key={index} className="align-items-center mb-2">
                          <Col md="3">
                            <Label>Label </Label>
                            <Input
                              type="text"
                              value={link.label}
                              placeholder="e.g. Netflix"
                              onChange={(e) =>
                                handleWatchLinkChange(
                                  index,
                                  "label",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col md="5">
                            <Label>URL</Label>
                            <Input
                              type="url"
                              value={link.url}
                              placeholder="https://..."
                              onChange={(e) =>
                                handleWatchLinkChange(
                                  index,
                                  "url",
                                  e.target.value
                                )
                              }
                            />
                          </Col>

                          <Col md="1" className="d-flex align-items-end">
                            <Button
                              type="button"
                              color="danger"
                              onClick={() => handleRemoveWatchLink(index)}
                            >
                              ×
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        type="button"
                        color="secondary"
                        className="mt-2"
                        onClick={handleAddWatchLink}
                      >
                        + Add Reference Link
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Add Positions
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/list-positions/${celebrityId}`)}
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

export default AddPositions;
