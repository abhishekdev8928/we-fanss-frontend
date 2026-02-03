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
import {
  getLanguageOptions,
  addSeries,
  getGenreMaster,
} from "../../api/seriesApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useDropzone } from "react-dropzone";

const AddSeries = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Add Series", link: "#" },
  ]);
  const navigate = useNavigate();

  const { id } = useParams(); // ✅ match route
  const celebrityId = id; // use it as celebrityId
  const [optionscat, setOptions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    platform: "",
    start_year: "",
    end_year: "",
    statusseries: "",
    languages: [],
    role: "",
    role_type: "",
    director: "",
    notes: "",
    genre: [], // ✅ CHANGED: Now an array for multi-select
    image: "",
    watchLinks: [],
    seasons: [],
    sort: "",
    statusnew: "Draft",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [languagesOptions, setLanguageOptions] = useState([]);

  useEffect(() => {
    fetchLanguageOptions();
    fetchOptions();
  }, []);

  // ✅ Fetch category options
  const fetchOptions = async () => {
    try {
      const res_data = await getGenreMaster();
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
      watchLinks: [...prev.watchLinks, { platform: "", url: "", type: "" }],
    }));
  };

  const handleRemoveWatchLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      watchLinks: prev.watchLinks.filter((_, i) => i !== index),
    }));
  };

  const handleWatchLinkChange = (index, field, value) => {
    const updated = [...formData.watchLinks];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, watchLinks: updated }));
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
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("start_year", formData.start_year);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("role_type", formData.role_type);
      formDataToSend.append("languages", JSON.stringify(formData.languages));
      formDataToSend.append("watchLinks", JSON.stringify(formData.watchLinks));
      formDataToSend.append("seasons", JSON.stringify(formData.seasons));
      formDataToSend.append("genre", JSON.stringify(formData.genre)); // ✅ CHANGED: Sending as JSON array
      formDataToSend.append("director", formData.director);
      formDataToSend.append("end_year", formData.end_year);
      formDataToSend.append("platform", formData.platform);
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("statusseries", formData.statusseries);
      formDataToSend.append("celebrityId", celebrityId);
      formDataToSend.append("sort", formData.sort);
      formDataToSend.append("statusnew", formData.statusnew);
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const adminid = localStorage.getItem("adminid");
      formDataToSend.append("createdBy", adminid);

      // Call backend API
      const result = await addSeries(formDataToSend);

      if (!result.success) {
        toast.error(result.msg || "Failed to add Series.");
        return;
      }

      toast.success("Series added successfully!");
      navigate(`/dashboard/list-series/${celebrityId}`);

      // Reset form
      setFormData({
        title: "",
        type: "",
        start_year: "",
        role: "",
        role_type: "",
        languages: [],
        director: "",
        end_year: "",
        notes: "",
        image: "",
        watchLinks: [],
        platform: "",
        statusseries: "",
        genre: [], // ✅ Reset as empty array
        sort: "",
        statusnew: "Draft",
        seasons: [],
      });
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      console.error("Add Series Error:", err);
      toast.error("Something went wrong while adding the Series.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ADD Series" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Title</Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        placeholder="Title"
                        type="text"
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    {/* ✅ UPDATED: Multi-select Genre */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">Select Genre(s)</Label>
                        <Select
                          isMulti
                          name="genre"
                          options={optionscat}
                          value={optionscat.filter((opt) =>
                            formData.genre.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            setFormData((prev) => ({
                              ...prev,
                              genre: selectedOptions.map((opt) => opt.value),
                            }))
                          }
                          placeholder="Select genres..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                        {errors.genre && (
                          <span className="text-danger">{errors.genre}</span>
                        )}
                      </div>
                    </Col>

                    <Col md="6">
                      <Label>Series Type</Label>
                      <Input
                        type="select"
                        name="type"
                        onChange={handleInput}
                        value={formData.type}
                      >
                        <option value="">Select</option>
                        <option value="TV Series">TV Series </option>
                        <option value="Web Series">Web Series </option>
                      </Input>
                      {errors.type && (
                        <span className="text-danger">{errors.type}</span>
                      )}
                    </Col>
                    <Col md="6">
                      <Label>Platform / Channel</Label>
                      <Input
                        name="platform"
                        value={formData.platform}
                        onChange={handleInput}
                        placeholder="Platform / Channel"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Start Year </Label>
                      <Input
                        name="start_year"
                        value={formData.start_year}
                        onChange={handleInput}
                        placeholder="Start Year"
                        type="number"
                      />
                    </Col>
                    <Col md="6">
                      <Label>End Year </Label>
                      <Input
                        name="end_year"
                        value={formData.end_year}
                        onChange={handleInput}
                        placeholder="End Year"
                        type="number"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Status </Label>
                      <Input
                        type="select"
                        name="statusseries"
                        onChange={handleInput}
                        value={formData.statusseries}
                      >
                        <option value="">Select</option>
                        <option value="Ongoing">Ongoing </option>
                        <option value="Ended">Ended </option>
                        <option value="Mini-series">Mini-series </option>
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Role / Character Name </Label>
                      <Input
                        name="role"
                        value={formData.role}
                        onChange={handleInput}
                        placeholder="Role / Character Name "
                        type="text"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Role Type</Label>
                      <Input
                        type="select"
                        name="role_type"
                        onChange={handleInput}
                        value={formData.role_type}
                      >
                        <option value="">Select</option>
                        <option value="Lead">Lead </option>
                        <option value="Supporting">Supporting </option>
                        <option value="Cameo">Cameo </option>
                        <option value="Voice">Voice </option>
                      </Input>
                    </Col>
                    <Col md="6">
                      <Label>Languages</Label>
                      <Select
                        isMulti
                        name="languages"
                        options={languagesOptions}
                        value={languagesOptions.filter((opt) =>
                          formData.languages.includes(opt.value)
                        )}
                        onChange={(selectedOptions) =>
                          setFormData((prev) => ({
                            ...prev,
                            languages: selectedOptions.map((opt) => opt.value),
                          }))
                        }
                        placeholder="Choose..."
                      />
                      {errors.languages && (
                        <span className="text-danger">{errors.languages}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Director </Label>
                      <Input
                        name="director"
                        value={formData.director}
                        onChange={handleInput}
                        placeholder="Director "
                        type="text"
                      />
                    </Col>
                    <Col md="12">
                      <Label>Synopsis / Notes</Label>
                      <Input
                        type="textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInput}
                        placeholder="Synopsis / Notes"
                      />
                    </Col>

                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          {" "}
                          Poster / Thumbnail
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
                              src={`${process.env.REACT_APP_API_BASE_URL}/section/${formData.old_image}`}
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
                      <h5>Watch Links</h5>
                      {formData.watchLinks.map((link, index) => (
                        <Row key={index} className="align-items-center mb-2">
                          <Col md="3">
                            <Label>Platform Name</Label>
                            <Input
                              type="text"
                              value={link.platform}
                              placeholder="e.g. Netflix"
                              onChange={(e) =>
                                handleWatchLinkChange(
                                  index,
                                  "platform",
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
                          <Col md="3">
                            <Label>Link Type</Label>
                            <Input
                              type="select"
                              value={link.type}
                              onChange={(e) =>
                                handleWatchLinkChange(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select</option>
                              <option value="OTT">OTT</option>
                              <option value="Trailer">Trailer</option>
                              <option value="Clip">Clip</option>
                            </Input>
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
                        + Add Watch Link
                      </Button>
                    </Col>

                    {/* ✅ SEASONS SECTION */}
                    <Col md="12" className="mt-4">
                      <h5>Seasons</h5>
                      {formData.seasons?.map((season, index) => (
                        <Row key={index} className="align-items-center mb-3">
                          <Col md="2">
                            <Label>Season No</Label>
                            <Input
                              type="number"
                              value={season.season_no}
                              placeholder="1"
                              onChange={(e) =>
                                handleSeasonChange(
                                  index,
                                  "season_no",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col md="3">
                            <Label>Episodes</Label>
                            <Input
                              type="number"
                              value={season.episodes}
                              placeholder="10"
                              onChange={(e) =>
                                handleSeasonChange(
                                  index,
                                  "episodes",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col md="3">
                            <Label>Year</Label>
                            <Input
                              type="number"
                              value={season.year}
                              placeholder="2024"
                              onChange={(e) =>
                                handleSeasonChange(
                                  index,
                                  "year",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col md="3">
                            <Label>Watch Link (optional)</Label>
                            <Input
                              type="url"
                              value={season.watch_link}
                              placeholder="https://..."
                              onChange={(e) =>
                                handleSeasonChange(
                                  index,
                                  "watch_link",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col md="1" className="d-flex align-items-end">
                            <Button
                              type="button"
                              color="danger"
                              onClick={() => handleRemoveSeason(index)}
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
                        onClick={handleAddSeason}
                      >
                        + Add Season
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Add Series
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/list-series/${celebrityId}`)}
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

export default AddSeries;