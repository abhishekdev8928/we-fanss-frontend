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
import { getLanguageOptions, addElection } from "../../api/electionApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useDropzone } from "react-dropzone";

const AddElection = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Add Election", link: "#" },
  ]);
  const navigate = useNavigate();

  const { id } = useParams(); // ✅ match route
  const celebrityId = id; // use it as celebrityId

  const [formData, setFormData] = useState({
    election_year: "",
    type: "",
    state: "",
    constituency: "",
    party: "",
    role: "",
    result: "",
    vote_share: "",
    votes: "",
    opponent: "",
    notes: "",
    reference: [], // ✅ Repeater field for reference links
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
    if (!formData.election_year)
      newErrors.election_year = "Election year is required";
    if (!formData.type) newErrors.type = "Election type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("election_year", formData.election_year);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("constituency", formData.constituency);
      formDataToSend.append("party", formData.party);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("result", formData.result);
      formDataToSend.append("vote_share", formData.vote_share);
      formDataToSend.append("votes", formData.votes);
      formDataToSend.append("opponent", formData.opponent);
      formDataToSend.append("notes", formData.notes);
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
      const result = await addElection(formDataToSend);

      if (!result.status) {
        toast.error(result.msg || "Failed to add Election.");
        return;
      }

      toast.success("Election added successfully!");
      navigate(`/list-election/${celebrityId}`);

      // Reset form
      setFormData({
        election_year: "",
        type: "",
        state: "",
        constituency: "",
        party: "",
        role: "",
        result: "",
        vote_share: "",
        votes: "",
        opponent: "",
        notes: "",
        reference: [],
        sort: "",
        statusnew: "Draft", // ✅ Default value
      });
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      console.error("Add Election Error:", err);
      toast.error("Something went wrong while adding the Election.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ADD Election" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Election Year </Label>
                      <Input
                        name="election_year"
                        value={formData.election_year}
                        onChange={handleInput}
                        placeholder="Election Year "
                        type="number"
                      />
                      {errors.election_year && (
                        <span className="text-danger">
                          {errors.election_year}
                        </span>
                      )}
                    </Col>
                    <Col md="6">
                      <Label>Election Type</Label>
                      <Input
                        type="select"
                        name="type"
                        onChange={handleInput}
                        value={formData.type}
                      >
                        <option value="">Select</option>
                        <option value="Lok Sabha">Lok Sabha </option>
                        <option value="Vidhan Sabha">Vidhan Sabha </option>

                        <option value="Municipal">Municipal </option>
                        <option value="Panchayat">Panchayat </option>

                        <option value="Rajya Sabha">Rajya Sabha </option>
                        <option value="Other">Other </option>
                      </Input>
                      {errors.type && (
                        <span className="text-danger">{errors.type}</span>
                      )}
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
                      <Label>Constituency </Label>
                      <Input
                        name="constituency"
                        value={formData.constituency}
                        onChange={handleInput}
                        placeholder="Constituency "
                        type="text"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Party / Affiliation </Label>
                      <Input
                        name="party"
                        value={formData.party}
                        onChange={handleInput}
                        placeholder="Party / Affiliation"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Role in Election </Label>
                      <Input
                        type="select"
                        name="role"
                        onChange={handleInput}
                        value={formData.role}
                      >
                        <option value="">Select</option>
                        <option value="Candidate">Candidate </option>
                        <option value="Campaign Lead">Campaign Lead </option>
                        <option value="Star Campaigner">
                          Star Campaigner{" "}
                        </option>
                        <option value="Support">Support </option>
                      </Input>
                    </Col>

                    <Col md="6">
                      <Label>Result </Label>
                      <Input
                        type="select"
                        name="result"
                        onChange={handleInput}
                        value={formData.result}
                      >
                        <option value="">Select</option>
                        <option value="Won">Won </option>
                        <option value="Lost">Lost </option>
                        <option value="Withdrawn">Withdrawn </option>
                        <option value="Nominated">Nominated </option>
                        <option value="Unknown">Unknown </option>
                      </Input>
                    </Col>

                    <Col md="6">
                      <Label>Vote Share % </Label>
                      <Input
                        name="vote_share"
                        value={formData.vote_share}
                        onChange={handleInput}
                        placeholder="Vote Share %"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Total Votes Received </Label>
                      <Input
                        name="votes"
                        value={formData.votes}
                        onChange={handleInput}
                        placeholder="Total Votes Received"
                        type="number"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Opponent(s) </Label>
                      <Input
                        name="opponent"
                        value={formData.opponent}
                        onChange={handleInput}
                        placeholder="Opponent(s)"
                        type="text"
                      />
                    </Col>

                    <Col md="12">
                      <Label>Key Highlights / Note</Label>
                      <Input
                        type="textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInput}
                        placeholder="Key Highlights / Note"
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
                              src={`${process.env.REACT_APP_API_BASE_URL}/election/${formData.old_image}`}
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
                      Add Election
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/list-election/${celebrityId}`)}
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

export default AddElection;
