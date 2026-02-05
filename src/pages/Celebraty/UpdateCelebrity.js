import React, { useState, useEffect } from "react";
import RichTextEditor from "../../components/editor/RichTextEditor";
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
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  getLanguageOptions,
  getProfessionsOptions,
  updateCelebraty,
  getSocialLinksOptions,
  getCelebratyById,
} from "../../api/celebratyApi";
import { useRoleName } from "../../config/store/authStore";

const knownForRegionOptions = [
  { value: "India", label: "India" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "South Korea", label: "South Korea" },
  { value: "Japan", label: "Japan" },
  { value: "Europe", label: "Europe" },
  { value: "Middle East", label: "Middle East" },
];

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const UpdateCelebrityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isAdmin = ["Super Admin", "Admin"].includes(useRoleName());

  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Update Celebrity", link: "#" },
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const totalSteps = isAdmin ? 5 : 4;

  const stepTitles = {
    1: "Basic Information",
    2: "Professional Details & Social Links",
    3: "Family & Relationships",
    4: "Gallery & Images",
    5: "SEO & Admin"
  };

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [oldGallery, setOldGallery] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [languagesOptions, setLanguageOptions] = useState([]);
  const [professionsOptions, setProfessionsOptions] = useState([]);
  const [socialLinksOptions, setSocialLinksOptions] = useState([]);

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortinfo: "",
    biography: "",
    status: "Draft",
    previewImage: "",
    old_image: "",
    removeOldImage: false,

    dob: "",
    birthplace: "",
    gender: "",
    nationality: "",
    religion: "",

    isAlive: true,
    dateOfDeath: "",
    placeOfDeath: "",
    causeOfDeath: "",

    fatherName: "",
    showFather: false,
    motherName: "",
    showMother: false,
    spouses: [],
    children: [],
    siblings: [],

    professions: [],
    primaryProfession: "",
    languages: [],
    primaryLanguage: "",
    careerStartYear: "",
    careerEndYear: "",
    isCareerOngoing: true,

    currentCity: "",
    knownForRegion: [],

    height: "",
    signatureStyle: "",

    socialLinks: [],

    tags: [],
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoKeywords: [],

    isFeatured: false,
    verificationStatus: "Not Claimed",
    internalNotes: "",
  });

  const [editorKey, setEditorKey] = useState(0);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
      },
    }),
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
    },
    accept: { "image/*": [] },
    multiple: true,
  });

  useEffect(() => {
    fetchLanguageOptions();
    fetchProfessionsOptions();
    fetchSocialLinksOptions();
    fetchCelebrityData();
  }, [id]);

  const fetchCelebrityData = async () => {
    try {
      setLoading(true);
      const res_data = await getCelebratyById(id);
      const celebrityData = res_data.data || res_data.msg;

      if (!celebrityData) {
        toast.error("Celebrity not found");
        navigate("/dashboard/celebrity-list");
        return;
      }

      const extractId = (item) => {
        if (!item) return "";
        return typeof item === "object" ? item._id : item;
      };

      const extractIds = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(extractId).filter(Boolean);
      };

      setFormData({
        name: celebrityData.identityProfile?.name || "",
        slug: celebrityData.identityProfile?.slug || "",
        shortinfo: celebrityData.identityProfile?.shortinfo || "",
        biography: celebrityData.identityProfile?.biography || "",
        status: celebrityData.identityProfile?.status || "Draft",
        old_image: celebrityData.identityProfile?.image || "",
        previewImage: "",
        removeOldImage: false,

        dob: celebrityData.personalDetails?.dob
          ? new Date(celebrityData.personalDetails.dob).toISOString().split("T")[0]
          : "",
        birthplace: celebrityData.personalDetails?.birthplace || "",
        gender: celebrityData.personalDetails?.gender || "",
        nationality: celebrityData.personalDetails?.nationality || "",
        religion: celebrityData.personalDetails?.religion || "",

        isAlive: celebrityData.lifeStatus?.isAlive !== false,
        dateOfDeath: celebrityData.lifeStatus?.dateOfDeath
          ? new Date(celebrityData.lifeStatus.dateOfDeath).toISOString().split("T")[0]
          : "",
        placeOfDeath: celebrityData.lifeStatus?.placeOfDeath || "",
        causeOfDeath: celebrityData.lifeStatus?.causeOfDeath || "",

        fatherName: celebrityData.familyRelationships?.father?.name || "",
        showFather: celebrityData.familyRelationships?.father?.showOnPublicProfile || false,
        motherName: celebrityData.familyRelationships?.mother?.name || "",
        showMother: celebrityData.familyRelationships?.mother?.showOnPublicProfile || false,
        spouses: celebrityData.familyRelationships?.spouses || [],
        children: celebrityData.familyRelationships?.children || [],
        siblings: celebrityData.familyRelationships?.siblings || [],

        professions: extractIds(celebrityData.professionalIdentity?.professions),
        primaryProfession: extractId(celebrityData.professionalIdentity?.primaryProfession),
        languages: extractIds(celebrityData.professionalIdentity?.languages),
        primaryLanguage: extractId(celebrityData.professionalIdentity?.primaryLanguage),
        careerStartYear: celebrityData.professionalIdentity?.careerStartYear || "",
        careerEndYear: celebrityData.professionalIdentity?.careerEndYear || "",
        isCareerOngoing: celebrityData.professionalIdentity?.isCareerOngoing !== false,

        currentCity: celebrityData.locationPresence?.currentCity || "",
        knownForRegion: celebrityData.locationPresence?.knownForRegion || [],

        height: celebrityData.publicAttributes?.height || "",
        signatureStyle: celebrityData.publicAttributes?.signatureStyle || "",

        socialLinks: (celebrityData.socialLinks || []).map((link) => ({
          platform: extractId(link.platform),
          url: link.url || "",
          label: link.label || "",
        })),

        tags: celebrityData.seoMetadata?.tags || [],
        seoMetaTitle: celebrityData.seoMetadata?.seoMetaTitle || "",
        seoMetaDescription: celebrityData.seoMetadata?.seoMetaDescription || "",
        seoKeywords: celebrityData.seoMetadata?.seoKeywords || [],

        isFeatured: celebrityData.adminControls?.isFeatured || false,
        verificationStatus: celebrityData.adminControls?.verificationStatus || "Not Claimed",
        internalNotes: celebrityData.adminControls?.internalNotes || "",
      });

      setOldGallery(celebrityData.identityProfile?.gallery || []);
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.error("Fetch Celebrity error:", error);
      toast.error("Failed to fetch Celebrity data");
      navigate("/dashboard/celebrity-list");
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinksOptions = async () => {
    try {
      const response = await getSocialLinksOptions();
      const data = response.data || response.msg || response;
      const options = (Array.isArray(data) ? data : []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setSocialLinksOptions(options);
    } catch (err) {
      console.error("Error fetching social link options:", err);
      toast.error("Failed to fetch social links");
    }
  };

  const fetchLanguageOptions = async () => {
    try {
      const response = await getLanguageOptions();
      const data = response.data || response.msg || response;
      const options = (Array.isArray(data) ? data : []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setLanguageOptions(options);
    } catch (err) {
      console.error("Error fetching language options:", err);
      toast.error("Failed to fetch languages");
    }
  };

  const fetchProfessionsOptions = async () => {
    try {
      const response = await getProfessionsOptions();
      const data = response.data || response.msg || response;
      const options = (Array.isArray(data) ? data : []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setProfessionsOptions(options);
    } catch (err) {
      console.error("Error fetching profession options:", err);
      toast.error("Failed to fetch professions");
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name || formData.name.trim() === "") {
        newErrors.name = "Please enter celebrity name";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name should be at least 2 characters";
      }

      if (!formData.slug || formData.slug.trim() === "") {
        newErrors.slug = "Slug is required";
      }

      // Death date validation
      if (!formData.isAlive && formData.dateOfDeath) {
        const deathDate = new Date(formData.dateOfDeath);
        const dobDate = new Date(formData.dob);
        const today = new Date();

        if (deathDate > today) {
          newErrors.dateOfDeath = "Date of death cannot be in the future";
        } else if (formData.dob && deathDate < dobDate) {
          newErrors.dateOfDeath = "Date of death cannot be before date of birth";
        }
      }
    }

    if (step === 2) {
      if (!formData.professions || formData.professions.length === 0) {
        newErrors.professions = "Please select at least one profession";
      }

      formData.socialLinks.forEach((link, index) => {
        if (link.url && link.url.trim() !== "") {
          const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9_-]+(\.[a-z]{2,})(\/.*)?$/;
          if (!urlPattern.test(link.url.trim())) {
            newErrors[`socialLink_${index}`] = "Please enter a valid URL";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.seoKeywords.includes(keywordInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          seoKeywords: [...prev.seoKeywords, keywordInput.trim()],
        }));
      }
      setKeywordInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeKeyword = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleTabClick = (targetStep) => {
    if (targetStep === currentStep || completedSteps.includes(targetStep)) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (targetStep > currentStep) {
      let allValid = true;
      for (let step = currentStep; step < targetStep; step++) {
        if (step === 1 || step === 2) {
          if (!validateStep(step)) {
            allValid = false;
            toast.error(`Please complete Step ${step}: ${stepTitles[step]} before proceeding`);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        }
        if (!completedSteps.includes(step)) {
          setCompletedSteps((prev) => [...prev, step]);
        }
      }

      if (allValid) {
        setCurrentStep(targetStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 || currentStep === 2) {
      if (!validateStep(currentStep)) {
        toast.error("Please fix the errors before proceeding");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);

    if (!step1Valid || !step2Valid) {
      toast.error("Please fix all errors before submitting");
      if (!step1Valid) {
        setCurrentStep(1);
      } else if (!step2Valid) {
        setCurrentStep(2);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const allStepsUpToCurrent = Array.from({ length: currentStep }, (_, i) => i + 1);
    setCompletedSteps(allStepsUpToCurrent);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("identityProfile[name]", formData.name.trim());
      formDataToSend.append("identityProfile[slug]", formData.slug.trim());
      if (formData.shortinfo) {
        formDataToSend.append("identityProfile[shortinfo]", formData.shortinfo.trim());
      }
      if (formData.biography) {
        formDataToSend.append("identityProfile[biography]", formData.biography.trim());
      }
      formDataToSend.append("identityProfile[status]", formData.status);

      if (formData.dob) {
        formDataToSend.append("personalDetails[dob]", formData.dob);
      }
      if (formData.birthplace) {
        formDataToSend.append("personalDetails[birthplace]", formData.birthplace.trim());
      }
      if (formData.gender) {
        formDataToSend.append("personalDetails[gender]", formData.gender);
      }
      if (formData.nationality) {
        formDataToSend.append("personalDetails[nationality]", formData.nationality.trim());
      }
      if (formData.religion) {
        formDataToSend.append("personalDetails[religion]", formData.religion.trim());
      }

      // ✅ FIXED: Always send lifeStatus fields
      formDataToSend.append("lifeStatus[isAlive]", formData.isAlive.toString());
      
      // ✅ FIXED: Send death fields when isAlive is false
      if (!formData.isAlive) {
        if (formData.dateOfDeath && formData.dateOfDeath.trim() !== "") {
          formDataToSend.append("lifeStatus[dateOfDeath]", formData.dateOfDeath);
          console.log("✅ Death Date Added:", formData.dateOfDeath);
        }
        if (formData.placeOfDeath && formData.placeOfDeath.trim() !== "") {
          formDataToSend.append("lifeStatus[placeOfDeath]", formData.placeOfDeath.trim());
          console.log("✅ Place of Death Added:", formData.placeOfDeath);
        }
        if (formData.causeOfDeath && formData.causeOfDeath.trim() !== "") {
          formDataToSend.append("lifeStatus[causeOfDeath]", formData.causeOfDeath.trim());
          console.log("✅ Cause of Death Added:", formData.causeOfDeath);
        }
      }

      // Debug log to verify death fields
      console.log("=== Death Related Fields Debug ===");
      console.log("isAlive:", formData.isAlive);
      console.log("dateOfDeath:", formData.dateOfDeath);
      console.log("placeOfDeath:", formData.placeOfDeath);
      console.log("causeOfDeath:", formData.causeOfDeath);
      console.log("================================");

      if (formData.fatherName) {
        formDataToSend.append("familyRelationships[father][name]", formData.fatherName.trim());
        formDataToSend.append("familyRelationships[father][showOnPublicProfile]", formData.showFather.toString());
      }
      if (formData.motherName) {
        formDataToSend.append("familyRelationships[mother][name]", formData.motherName.trim());
        formDataToSend.append("familyRelationships[mother][showOnPublicProfile]", formData.showMother.toString());
      }
      
      if (formData.spouses.length > 0) {
        formDataToSend.append("familyRelationships[spouses]", JSON.stringify(formData.spouses));
      }
      if (formData.children.length > 0) {
        formDataToSend.append("familyRelationships[children]", JSON.stringify(formData.children));
      }
      if (formData.siblings.length > 0) {
        formDataToSend.append("familyRelationships[siblings]", JSON.stringify(formData.siblings));
      }

      formDataToSend.append("professionalIdentity[professions]", JSON.stringify(formData.professions));
      
      const primaryProf = formData.primaryProfession || formData.professions[0];
      if (primaryProf) {
        formDataToSend.append("professionalIdentity[primaryProfession]", primaryProf);
      }
      
      if (formData.languages.length > 0) {
        formDataToSend.append("professionalIdentity[languages]", JSON.stringify(formData.languages));
      }
      if (formData.primaryLanguage) {
        formDataToSend.append("professionalIdentity[primaryLanguage]", formData.primaryLanguage);
      }
      if (formData.careerStartYear) {
        formDataToSend.append("professionalIdentity[careerStartYear]", formData.careerStartYear.toString());
      }
      if (formData.careerEndYear && !formData.isCareerOngoing) {
        formDataToSend.append("professionalIdentity[careerEndYear]", formData.careerEndYear.toString());
      }
      formDataToSend.append("professionalIdentity[isCareerOngoing]", formData.isCareerOngoing.toString());

      if (formData.currentCity) {
        formDataToSend.append("locationPresence[currentCity]", formData.currentCity.trim());
      }
      if (formData.knownForRegion.length > 0) {
        formDataToSend.append("locationPresence[knownForRegion]", JSON.stringify(formData.knownForRegion));
      }

      if (formData.height) {
        formDataToSend.append("publicAttributes[height]", formData.height.trim());
      }
      if (formData.signatureStyle) {
        formDataToSend.append("publicAttributes[signatureStyle]", formData.signatureStyle.trim());
      }

      const validSocialLinks = formData.socialLinks
        .filter((link) => link.platform && link.url)
        .map((link) => ({
          platform: link.platform,
          url: link.url.trim(),
          label: link.label || "",
        }));

      if (validSocialLinks.length > 0) {
        formDataToSend.append("socialLinks", JSON.stringify(validSocialLinks));
      }

      if (isAdmin) {
        if (formData.tags.length > 0) {
          formDataToSend.append("seoMetadata[tags]", JSON.stringify(formData.tags));
        }
        if (formData.seoMetaTitle) {
          formDataToSend.append("seoMetadata[seoMetaTitle]", formData.seoMetaTitle.trim());
        }
        if (formData.seoMetaDescription) {
          formDataToSend.append("seoMetadata[seoMetaDescription]", formData.seoMetaDescription.trim());
        }
        if (formData.seoKeywords.length > 0) {
          formDataToSend.append("seoMetadata[seoKeywords]", JSON.stringify(formData.seoKeywords));
        }

        formDataToSend.append("adminControls[isFeatured]", formData.isFeatured.toString());
        formDataToSend.append("adminControls[verificationStatus]", formData.verificationStatus);
        if (formData.internalNotes) {
          formDataToSend.append("adminControls[internalNotes]", formData.internalNotes.trim());
        }
      }

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }
      if (formData.removeOldImage) {
        formDataToSend.append("removeOldImage", "true");
      }

      formDataToSend.append("oldGallery", JSON.stringify(oldGallery));
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formDataToSend.append("gallery", file);
        });
      }

      // ✅ Log all FormData entries for debugging
      console.log("=== FormData Entries ===");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
      console.log("========================");

      const result = await updateCelebraty(id, formDataToSend);

      const success = result.success || result.status;
      const message = result.message || result.msg;

      if (!success) {
        toast.error(message || "Failed to update celebrity.");
        return;
      }

      toast.success(message || "Celebrity Updated Successfully");
      navigate("/dashboard/celebrity-list");
    } catch (err) {
      console.error("Update celebrity Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong while updating celebrity.";

      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="UPDATE Celebrity" breadcrumbItems={breadcrumbItems} />

        <Row className="mb-4">
          <Col xl="12">
            <Card>
              <CardBody className="p-0">
                {/* Tab Navigation */}
                <div className="d-flex border-bottom">
                  {/* Tab 1 */}
                  <div
                    onClick={() => handleTabClick(1)}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      cursor: "pointer",
                      backgroundColor: currentStep === 1 ? "#f8f9fa" : "transparent",
                      borderBottom: currentStep === 1 ? "3px solid #556ee6" : "3px solid transparent",
                      transition: "all 0.3s ease",
                      opacity: 1,
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: completedSteps.includes(1) ? "#4285F4" : "#e9ecef",
                          color: completedSteps.includes(1) ? "#ffffff" : "#6c757d",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {completedSteps.includes(1) ? "✓" : "1"}
                      </div>
                      <div>
                        <div style={{ fontWeight: currentStep === 1 ? "600" : "normal", fontSize: "14px" }}>
                          Basic Info
                        </div>
                        <small className="text-muted d-none d-md-block" style={{ fontSize: "11px" }}>
                          Name, DOB, Biography
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Tab 2 */}
                  <div
                    onClick={() => handleTabClick(2)}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      cursor: completedSteps.includes(2) || currentStep >= 2 ? "pointer" : "not-allowed",
                      backgroundColor: currentStep === 2 ? "#f8f9fa" : "transparent",
                      borderBottom: currentStep === 2 ? "3px solid #556ee6" : "3px solid transparent",
                      transition: "all 0.3s ease",
                      opacity: completedSteps.includes(2) || currentStep >= 2 ? 1 : 0.5,
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: completedSteps.includes(2) ? "#4285F4" : "#e9ecef",
                          color: completedSteps.includes(2) ? "#ffffff" : "#6c757d",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {completedSteps.includes(2) ? "✓" : "2"}
                      </div>
                      <div>
                        <div style={{ fontWeight: currentStep === 2 ? "600" : "normal", fontSize: "14px" }}>
                          Professional
                        </div>
                        <small className="text-muted d-none d-md-block" style={{ fontSize: "11px" }}>
                          Career & Social Links
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Tab 3 */}
                  <div
                    onClick={() => handleTabClick(3)}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      cursor: completedSteps.includes(3) || currentStep >= 3 ? "pointer" : "not-allowed",
                      backgroundColor: currentStep === 3 ? "#f8f9fa" : "transparent",
                      borderBottom: currentStep === 3 ? "3px solid #556ee6" : "3px solid transparent",
                      transition: "all 0.3s ease",
                      opacity: completedSteps.includes(3) || currentStep >= 3 ? 1 : 0.5,
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: completedSteps.includes(3) ? "#4285F4" : "#e9ecef",
                          color: completedSteps.includes(3) ? "#ffffff" : "#6c757d",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {completedSteps.includes(3) ? "✓" : "3"}
                      </div>
                      <div>
                        <div style={{ fontWeight: currentStep === 3 ? "600" : "normal", fontSize: "14px" }}>
                          Family
                        </div>
                        <small className="text-muted d-none d-md-block" style={{ fontSize: "11px" }}>
                          Relations & Spouse
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Tab 4 */}
                  <div
                    onClick={() => handleTabClick(4)}
                    style={{
                      flex: 1,
                      padding: "16px 24px",
                      cursor: completedSteps.includes(4) || currentStep >= 4 ? "pointer" : "not-allowed",
                      backgroundColor: currentStep === 4 ? "#f8f9fa" : "transparent",
                      borderBottom: currentStep === 4 ? "3px solid #556ee6" : "3px solid transparent",
                      transition: "all 0.3s ease",
                      opacity: completedSteps.includes(4) || currentStep >= 4 ? 1 : 0.5,
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: completedSteps.includes(4) ? "#4285F4" : "#e9ecef",
                          color: completedSteps.includes(4) ? "#ffffff" : "#6c757d",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {completedSteps.includes(4) ? "✓" : "4"}
                      </div>
                      <div>
                        <div style={{ fontWeight: currentStep === 4 ? "600" : "normal", fontSize: "14px" }}>
                          Gallery
                        </div>
                        <small className="text-muted d-none d-md-block" style={{ fontSize: "11px" }}>
                          Images & Media
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Tab 5 - Admin Only */}
                  {isAdmin && (
                    <div
                      onClick={() => handleTabClick(5)}
                      style={{
                        flex: 1,
                        padding: "16px 24px",
                        cursor: completedSteps.includes(5) || currentStep >= 5 ? "pointer" : "not-allowed",
                        backgroundColor: currentStep === 5 ? "#f8f9fa" : "transparent",
                        borderBottom: currentStep === 5 ? "3px solid #556ee6" : "3px solid transparent",
                        transition: "all 0.3s ease",
                        opacity: completedSteps.includes(5) || currentStep >= 5 ? 1 : 0.5,
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: completedSteps.includes(5) ? "#4285F4" : "#e9ecef",
                            color: completedSteps.includes(5) ? "#ffffff" : "#6c757d",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginRight: "10px",
                          }}
                        >
                          {completedSteps.includes(5) ? "✓" : "5"}
                        </div>
                        <div>
                          <div style={{ fontWeight: currentStep === 5 ? "600" : "normal", fontSize: "14px" }}>
                            SEO & Admin
                          </div>
                          <small className="text-muted d-none d-md-block" style={{ fontSize: "11px" }}>
                            Meta & Controls
                          </small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <div>
                  {/* STEP 1: BASIC INFO */}
                  {currentStep === 1 && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <h4 className="mb-4">Basic Information</h4>
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>
                          Name <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInput}
                          placeholder="Enter celebrity name"
                          type="text"
                          className={errors.name ? "is-invalid" : ""}
                        />
                        {errors.name && (
                          <div className="invalid-feedback d-block">{errors.name}</div>
                        )}
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>
                          Slug <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="slug"
                          value={formData.slug}
                          onChange={handleInput}
                          placeholder="auto-generated-slug"
                          type="text"
                          className={errors.slug ? "is-invalid" : ""}
                        />
                        {errors.slug && (
                          <div className="invalid-feedback d-block">{errors.slug}</div>
                        )}
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Status</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInput}
                          value={formData.status}
                        >
                          <option value="Draft">Draft</option>
                          <option value="In Review">In Review</option>
                          <option value="Published">Published</option>
                          <option value="Archived">Archived</option>
                        </Input>
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Date of Birth</Label>
                        <Input
                          name="dob"
                          value={formData.dob}
                          onChange={handleInput}
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Birthplace</Label>
                        <Input
                          name="birthplace"
                          value={formData.birthplace}
                          onChange={handleInput}
                          placeholder="City, State, Country"
                          type="text"
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Gender</Label>
                        <Input
                          type="select"
                          name="gender"
                          onChange={handleInput}
                          value={formData.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </Input>
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Nationality</Label>
                        <Input
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInput}
                          placeholder="e.g. Indian"
                          type="text"
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Religion</Label>
                        <Input
                          name="religion"
                          value={formData.religion}
                          onChange={handleInput}
                          placeholder="Optional"
                          type="text"
                        />
                      </Col>

                      <Col md="12" className="mb-4">
                        <hr />
                        <h5 className="mb-3">Life Status</h5>
                      </Col>

                      <Col md="12" className="mb-3">
                        <div className="form-check form-switch">
                          <Input
                            type="checkbox"
                            id="isAlive"
                            name="isAlive"
                            checked={formData.isAlive}
                            onChange={handleInput}
                            className="form-check-input"
                            role="switch"
                          />
                          <Label check for="isAlive" className="form-check-label">
                            Celebrity is Alive
                          </Label>
                        </div>
                      </Col>

                      {!formData.isAlive && (
                        <>
                          <Col md="6" className="mb-3">
                            <Label>Date of Death</Label>
                            <Input
                              name="dateOfDeath"
                              value={formData.dateOfDeath}
                              onChange={handleInput}
                              type="date"
                              max={new Date().toISOString().split("T")[0]}
                              className={errors.dateOfDeath ? "is-invalid" : ""}
                            />
                            {errors.dateOfDeath && (
                              <div className="invalid-feedback d-block">{errors.dateOfDeath}</div>
                            )}
                          </Col>

                          <Col md="6" className="mb-3">
                            <Label>Place of Death</Label>
                            <Input
                              name="placeOfDeath"
                              value={formData.placeOfDeath}
                              onChange={handleInput}
                              placeholder="City, State, Country"
                              type="text"
                            />
                          </Col>

                          <Col md="12" className="mb-3">
                            <Label>Cause of Death</Label>
                            <Input
                              type="textarea"
                              name="causeOfDeath"
                              value={formData.causeOfDeath}
                              onChange={handleInput}
                              placeholder="Optional"
                              rows="2"
                            />
                          </Col>
                        </>
                      )}

                      <Col md="12" className="mb-3">
                        <Label>Short Intro</Label>
                        <Input
                          type="textarea"
                          name="shortinfo"
                          value={formData.shortinfo}
                          onChange={handleInput}
                          placeholder="Brief introduction"
                          rows="3"
                        />
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>Biography</Label>
                        <RichTextEditor
                          key={editorKey}
                          value={formData.biography}
                          height={400}
                          onChange={(data) =>
                            setFormData((prev) => ({
                              ...prev,
                              biography: data,
                            }))
                          }
                        />
                      </Col>
                    </Row>
                  )}

                  {/* STEP 2: PROFESSIONAL */}
                  {currentStep === 2 && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <h4 className="mb-4">Professional Details</h4>
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>
                          Professions <span className="text-danger">*</span>
                        </Label>
                        <Select
                          isMulti
                          name="professions"
                          options={professionsOptions}
                          styles={customSelectStyles}
                          value={professionsOptions.filter((opt) =>
                            formData.professions.includes(opt.value)
                          )}
                          onChange={(selectedOptions) => {
                            const selected = selectedOptions
                              ? selectedOptions.map((opt) => opt.value)
                              : [];
                            setFormData((prev) => ({
                              ...prev,
                              professions: selected,
                            }));
                            if (errors.professions) {
                              setErrors((prev) => {
                                const updated = { ...prev };
                                delete updated.professions;
                                return updated;
                              });
                            }
                          }}
                          placeholder="Select professions..."
                          className={errors.professions ? "is-invalid" : ""}
                        />
                        {errors.professions && (
                          <div className="text-danger mt-1">{errors.professions}</div>
                        )}
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Primary Profession (Optional)</Label>
                        <Select
                          name="primaryProfession"
                          options={professionsOptions.filter((opt) =>
                            formData.professions.includes(opt.value)
                          )}
                          styles={customSelectStyles}
                          value={professionsOptions.find(
                            (opt) => opt.value === formData.primaryProfession
                          )}
                          onChange={(selected) => {
                            setFormData((prev) => ({
                              ...prev,
                              primaryProfession: selected ? selected.value : "",
                            }));
                          }}
                          placeholder="Select primary profession..."
                          isClearable
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Languages</Label>
                        <Select
                          isMulti
                          name="languages"
                          options={languagesOptions}
                          styles={customSelectStyles}
                          value={languagesOptions.filter((opt) =>
                            formData.languages.includes(opt.value)
                          )}
                          onChange={(selectedOptions) => {
                            const selected = selectedOptions
                              ? selectedOptions.map((opt) => opt.value)
                              : [];
                            setFormData((prev) => ({
                              ...prev,
                              languages: selected,
                            }));
                          }}
                          placeholder="Select languages..."
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Primary Language</Label>
                        <Select
                          name="primaryLanguage"
                          options={languagesOptions.filter((opt) =>
                            formData.languages.includes(opt.value)
                          )}
                          styles={customSelectStyles}
                          value={languagesOptions.find(
                            (opt) => opt.value === formData.primaryLanguage
                          )}
                          onChange={(selected) => {
                            setFormData((prev) => ({
                              ...prev,
                              primaryLanguage: selected ? selected.value : "",
                            }));
                          }}
                          placeholder="Select primary language..."
                          isClearable
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Career Start Year</Label>
                        <Input
                          type="number"
                          name="careerStartYear"
                          value={formData.careerStartYear}
                          onChange={handleInput}
                          placeholder="YYYY"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Career End Year</Label>
                        <div className="d-flex gap-2 align-items-center">
                          <Input
                            type="number"
                            name="careerEndYear"
                            value={formData.careerEndYear}
                            onChange={handleInput}
                            placeholder="YYYY"
                            min="1900"
                            max={new Date().getFullYear() + 10}
                            disabled={formData.isCareerOngoing}
                          />
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="isCareerOngoing"
                              name="isCareerOngoing"
                              checked={formData.isCareerOngoing}
                              onChange={handleInput}
                            />
                            <Label check for="isCareerOngoing" className="small">
                              Ongoing
                            </Label>
                          </div>
                        </div>
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Current City / Base Location</Label>
                        <Input
                          name="currentCity"
                          value={formData.currentCity}
                          onChange={handleInput}
                          placeholder="e.g. Mumbai, India"
                          type="text"
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Known For Region</Label>
                        <Select
                          isMulti
                          name="knownForRegion"
                          options={knownForRegionOptions}
                          styles={customSelectStyles}
                          value={knownForRegionOptions.filter((opt) =>
                            formData.knownForRegion.includes(opt.value)
                          )}
                          onChange={(selected) => {
                            setFormData((prev) => ({
                              ...prev,
                              knownForRegion: selected ? selected.map((opt) => opt.value) : [],
                            }));
                          }}
                          placeholder="Select regions..."
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Height</Label>
                        <Input
                          name="height"
                          value={formData.height}
                          onChange={handleInput}
                          placeholder="e.g. 5'10&quot; or 178 cm"
                          type="text"
                        />
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Signature Style / Known For</Label>
                        <Input
                          name="signatureStyle"
                          value={formData.signatureStyle}
                          onChange={handleInput}
                          placeholder="e.g. Romantic roles, open-arm pose"
                          type="text"
                        />
                      </Col>

                      <Col md="12" className="mb-4 mt-4">
                        <hr />
                        <h5 className="mb-3">Social Links</h5>
                      </Col>

                      <Col md="12" className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Label>Social Media Profiles</Label>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                socialLinks: [
                                  ...prev.socialLinks,
                                  { platform: "", url: "", label: "" },
                                ],
                              }))
                            }
                          >
                            + Add Link
                          </Button>
                        </div>

                        {formData.socialLinks.length > 0 ? (
                          <div>
                            {formData.socialLinks.map((item, index) => {
                              const platformOption = socialLinksOptions.find(
                                (opt) => opt.value === item.platform
                              );

                              const availableOptions = socialLinksOptions.filter((option) => {
                                const isAlreadySelected = formData.socialLinks.some(
                                  (link, idx) => idx !== index && link.platform === option.value
                                );
                                return !isAlreadySelected;
                              });

                              return (
                                <div key={index} className="mb-3 p-3 border rounded">
                                  <Row className="g-2 align-items-start">
                                    <Col md="4">
                                      <Label className="small">Platform</Label>
                                      <Select
                                        options={availableOptions}
                                        styles={customSelectStyles}
                                        value={platformOption}
                                        onChange={(selected) => {
                                          const updated = [...formData.socialLinks];
                                          updated[index].platform = selected ? selected.value : "";
                                          setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: updated,
                                          }));
                                        }}
                                        placeholder="Select Platform"
                                        isClearable
                                      />
                                    </Col>

                                    <Col md="5">
                                      <Label className="small">URL</Label>
                                      <Input
                                        type="text"
                                        placeholder="https://example.com/profile"
                                        value={item.url || ""}
                                        onChange={(e) => {
                                          const updated = [...formData.socialLinks];
                                          updated[index].url = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: updated,
                                          }));
                                          if (errors[`socialLink_${index}`]) {
                                            setErrors((prev) => {
                                              const updated = { ...prev };
                                              delete updated[`socialLink_${index}`];
                                              return updated;
                                            });
                                          }
                                        }}
                                        className={errors[`socialLink_${index}`] ? "is-invalid" : ""}
                                      />
                                      {errors[`socialLink_${index}`] && (
                                        <div className="invalid-feedback d-block">
                                          {errors[`socialLink_${index}`]}
                                        </div>
                                      )}
                                    </Col>

                                    <Col md="2">
                                      <Label className="small">Label (Optional)</Label>
                                      <Input
                                        type="text"
                                        placeholder="e.g. Fan Club"
                                        value={item.label || ""}
                                        onChange={(e) => {
                                          const updated = [...formData.socialLinks];
                                          updated[index].label = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: updated,
                                          }));
                                        }}
                                      />
                                    </Col>

                                    <Col md="1" className="d-flex align-items-end">
                                      <Button
                                        color="danger"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                          const updated = formData.socialLinks.filter(
                                            (_, i) => i !== index
                                          );
                                          setFormData((prev) => ({
                                            ...prev,
                                            socialLinks: updated,
                                          }));
                                        }}
                                        style={{ marginTop: "24px" }}
                                      >
                                        ×
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center text-muted p-3 border rounded">
                            No social links added yet
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}

{/* STEP 3: FAMILY */}
                  {currentStep === 3 && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <h4 className="mb-4">Family & Relationships</h4>
                      </Col>

                      <Col md="10" className="mb-3">
                        <Label>Father Name</Label>
                        <Input
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInput}
                          placeholder="Father's name"
                          type="text"
                        />
                      </Col>
                      <Col md="2" className="mb-3 d-flex align-items-end">
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            id="showFather"
                            name="showFather"
                            checked={formData.showFather}
                            onChange={handleInput}
                          />
                          <Label check for="showFather" className="small">
                            Show Public
                          </Label>
                        </div>
                      </Col>

                      <Col md="10" className="mb-3">
                        <Label>Mother Name</Label>
                        <Input
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInput}
                          placeholder="Mother's name"
                          type="text"
                        />
                      </Col>
                      <Col md="2" className="mb-3 d-flex align-items-end">
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            id="showMother"
                            name="showMother"
                            checked={formData.showMother}
                            onChange={handleInput}
                          />
                          <Label check for="showMother" className="small">
                            Show Public
                          </Label>
                        </div>
                      </Col>

                      <Col md="12" className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Label>Spouse / Partners</Label>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                spouses: [
                                  ...prev.spouses,
                                  {
                                    name: "",
                                    profession: "",
                                    showOnPublicProfile: false,
                                  },
                                ],
                              }))
                            }
                          >
                            + Add Spouse/Partner
                          </Button>
                        </div>

                        {formData.spouses.length > 0 && (
                          <div>
                            {formData.spouses.map((spouse, index) => (
                              <div key={index} className="mb-2 p-3 border rounded">
                                <Row className="g-2">
                                  <Col md="5">
                                    <Input
                                      type="text"
                                      placeholder="Name"
                                      value={spouse.name}
                                      onChange={(e) => {
                                        const updated = [...formData.spouses];
                                        updated[index].name = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          spouses: updated,
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md="4">
                                    <Input
                                      type="text"
                                      placeholder="Profession (Optional)"
                                      value={spouse.profession}
                                      onChange={(e) => {
                                        const updated = [...formData.spouses];
                                        updated[index].profession = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          spouses: updated,
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md="2">
                                    <div className="form-check">
                                      <Input
                                        type="checkbox"
                                        id={`spouseShow${index}`}
                                        checked={spouse.showOnPublicProfile}
                                        onChange={(e) => {
                                          const updated = [...formData.spouses];
                                          updated[index].showOnPublicProfile = e.target.checked;
                                          setFormData((prev) => ({
                                            ...prev,
                                            spouses: updated,
                                          }));
                                        }}
                                      />
                                      <Label check for={`spouseShow${index}`} className="small">
                                        Public
                                      </Label>
                                    </div>
                                  </Col>
                                  <Col md="1">
                                    <Button
                                      color="danger"
                                      size="sm"
                                      type="button"
                                      onClick={() => {
                                        const updated = formData.spouses.filter(
                                          (_, i) => i !== index
                                        );
                                        setFormData((prev) => ({
                                          ...prev,
                                          spouses: updated,
                                        }));
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            ))}
                          </div>
                        )}
                      </Col>

                      <Col md="12" className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Label>Children</Label>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                children: [
                                  ...prev.children,
                                  {
                                    name: "",
                                    relation: "",
                                    showOnPublicProfile: false,
                                  },
                                ],
                              }))
                            }
                          >
                            + Add Child
                          </Button>
                        </div>

                        {formData.children.length > 0 && (
                          <div>
                            {formData.children.map((child, index) => (
                              <div key={index} className="mb-2 p-3 border rounded">
                                <Row className="g-2">
                                  <Col md="5">
                                    <Input
                                      type="text"
                                      placeholder="Name"
                                      value={child.name}
                                      onChange={(e) => {
                                        const updated = [...formData.children];
                                        updated[index].name = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          children: updated,
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md="4">
                                    <Input
                                      type="text"
                                      placeholder="Relation (Son/Daughter)"
                                      value={child.relation}
                                      onChange={(e) => {
                                        const updated = [...formData.children];
                                        updated[index].relation = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          children: updated,
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md="2">
                                    <div className="form-check">
                                      <Input
                                        type="checkbox"
                                        id={`childShow${index}`}
                                        checked={child.showOnPublicProfile}
                                        onChange={(e) => {
                                          const updated = [...formData.children];
                                          updated[index].showOnPublicProfile = e.target.checked;
                                          setFormData((prev) => ({
                                            ...prev,
                                            children: updated,
                                          }));
                                        }}
                                      />
                                      <Label check for={`childShow${index}`} className="small">
                                        Public
                                      </Label>
                                    </div>
                                  </Col>
                                  <Col md="1">
                                    <Button
                                      color="danger"
                                      size="sm"
                                      type="button"
                                      onClick={() => {
                                        const updated = formData.children.filter(
                                          (_, i) => i !== index
                                        );
                                        setFormData((prev) => ({
                                          ...prev,
                                          children: updated,
                                        }));
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            ))}
                          </div>
                        )}
                      </Col>

                      <Col md="12" className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Label>Siblings</Label>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                siblings: [
                                  ...prev.siblings,
                                  {
                                    name: "",
                                    relation: "",
                                    showOnPublicProfile: false,
                                  },
                                ],
                              }))
                            }
                          >
                            + Add Sibling
                          </Button>
                        </div>

                        {formData.siblings.length > 0 && (
                          <div>
                            {formData.siblings.map((sibling, index) => (
                              <div key={index} className="mb-2 p-3 border rounded">
                                <Row className="g-2">
                                  <Col md="5">
                                    <Input
                                      type="text"
                                      placeholder="Name"
                                      value={sibling.name}
                                      onChange={(e) => {
                                        const updated = [...formData.siblings];
                                        updated[index].name = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          siblings: updated,
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md="4">
                                    <Input
                                      type="text"
                                      placeholder="Relation (Brother/Sister)"
                                      value={sibling.relation}
                                      onChange={(e) => {
                                        const updated = [...formData.siblings];
                                        updated[index].relation = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          siblings: updated,
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md="2">
                                    <div className="form-check">
                                      <Input
                                        type="checkbox"
                                        id={`siblingShow${index}`}
                                        checked={sibling.showOnPublicProfile}
                                        onChange={(e) => {
                                          const updated = [...formData.siblings];
                                          updated[index].showOnPublicProfile = e.target.checked;
                                          setFormData((prev) => ({
                                            ...prev,
                                            siblings: updated,
                                          }));
                                        }}
                                      />
                                      <Label check for={`siblingShow${index}`} className="small">
                                        Public
                                      </Label>
                                    </div>
                                  </Col>
                                  <Col md="1">
                                    <Button
                                      color="danger"
                                      size="sm"
                                      type="button"
                                      onClick={() => {
                                        const updated = formData.siblings.filter(
                                          (_, i) => i !== index
                                        );
                                        setFormData((prev) => ({
                                          ...prev,
                                          siblings: updated,
                                        }));
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            ))}
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}

{/* STEP 4: GALLERY */}
                  {currentStep === 4 && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <h4 className="mb-4">Gallery & Images</h4>
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label className="form-label">Profile Image</Label>
                        <Input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("Image size should be less than 5MB");
                                e.target.value = null;
                                return;
                              }
                              setSelectedFile(file);
                              setFormData((prev) => ({
                                ...prev,
                                previewImage: URL.createObjectURL(file),
                              }));
                            }
                          }}
                        />

                        {(formData.previewImage || formData.old_image) && (
                          <div className="mt-3 position-relative d-inline-block">
                            <img
                              src={
                                formData.previewImage
                                  ? formData.previewImage
                                  : `${API_BASE}${formData.old_image}`
                              }
                              alt="Preview"
                              width="150"
                              height="150"
                              className="rounded border"
                              style={{ objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setFormData((prev) => ({
                                  ...prev,
                                  previewImage: "",
                                  old_image: "",
                                  removeOldImage: true,
                                }));
                              }}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                              }}
                              title="Remove Image"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label className="form-label">Gallery Images (Multiple)</Label>
                        <div
                          {...getRootProps()}
                          className={`border border-dashed p-4 text-center rounded bg-light ${
                            isDragActive ? "bg-primary bg-opacity-10" : ""
                          }`}
                          style={{ cursor: "pointer", minHeight: "150px" }}
                        >
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p className="mb-0 text-primary fw-bold">Drop images here...</p>
                          ) : (
                            <div>
                              <i className="bx bx-cloud-upload display-4 text-muted"></i>
                              <p className="mb-0 text-muted mt-2">
                                Drag & drop images here, or <strong>click to select</strong>
                              </p>
                              <p className="text-muted small">Supports: JPG, PNG, GIF</p>
                            </div>
                          )}
                        </div>

                        {/* Old Gallery */}
                        {oldGallery.length > 0 && (
                          <div className="mt-4">
                            <h6 className="mb-3">Existing Gallery ({oldGallery.length})</h6>
                            <div className="d-flex flex-wrap gap-3">
                              {oldGallery.map((file, idx) => (
                                <div
                                  key={`old-${idx}`}
                                  className="position-relative"
                                  style={{ width: 120, height: 120 }}
                                >
                                  <img
                                    src={`${API_BASE}${file}`}
                                    alt={`gallery-${idx}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 8,
                                      border: "2px solid #ddd",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOldGallery((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    style={{
                                      position: "absolute",
                                      top: -8,
                                      right: -8,
                                      background: "red",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: 24,
                                      height: 24,
                                      cursor: "pointer",
                                      fontSize: 16,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New Gallery Files */}
                        {galleryFiles.length > 0 && (
                          <div className="mt-4">
                            <h6 className="mb-3">
                              New Images to Upload ({galleryFiles.length})
                            </h6>
                            <div className="d-flex flex-wrap gap-3">
                              {galleryFiles.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="position-relative"
                                  style={{ width: 120, height: 120 }}
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`gallery-${idx}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 8,
                                      border: "2px solid #ddd",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGalleryFiles((prev) =>
                                        prev.filter((_, i) => i !== idx)
                                      );
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: -8,
                                      right: -8,
                                      background: "red",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: 24,
                                      height: 24,
                                      cursor: "pointer",
                                      fontSize: 16,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}

{/* STEP 5: SEO & ADMIN (Admin Only) */}
                  {currentStep === 5 && isAdmin && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <h4 className="mb-4">SEO & Admin Controls</h4>
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>Tags</Label>
                        <Input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder="Type a tag and press Enter..."
                        />
                        <small className="text-muted">Press Enter to add tag</small>

                        {formData.tags.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="badge bg-primary d-flex align-items-center"
                                style={{
                                  fontSize: "14px",
                                  padding: "6px 10px",
                                }}
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(index)}
                                  style={{
                                    marginLeft: "8px",
                                    background: "transparent",
                                    border: "none",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>SEO Meta Title</Label>
                        <Input
                          name="seoMetaTitle"
                          value={formData.seoMetaTitle}
                          onChange={handleInput}
                          placeholder="Max 60 characters"
                          type="text"
                          maxLength="60"
                        />
                        <small className="text-muted">
                          {formData.seoMetaTitle.length}/60 characters
                        </small>
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>SEO Meta Description</Label>
                        <Input
                          type="textarea"
                          name="seoMetaDescription"
                          value={formData.seoMetaDescription}
                          onChange={handleInput}
                          placeholder="Max 160 characters"
                          rows="3"
                          maxLength="160"
                        />
                        <small className="text-muted">
                          {formData.seoMetaDescription.length}/160 characters
                        </small>
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>SEO Keywords</Label>
                        <Input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={handleKeywordKeyDown}
                          placeholder="Type a keyword and press Enter..."
                        />
                        <small className="text-muted">Press Enter to add keyword</small>

                        {formData.seoKeywords.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            {formData.seoKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="badge bg-secondary d-flex align-items-center"
                                style={{
                                  fontSize: "14px",
                                  padding: "6px 10px",
                                }}
                              >
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(index)}
                                  style={{
                                    marginLeft: "8px",
                                    background: "transparent",
                                    border: "none",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </Col>

                      <Col md="12">
                        <hr className="my-4" />
                        <h5 className="mb-3">Admin Controls</h5>
                      </Col>

                      <Col md="6" className="mb-3">
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            id="isFeatured"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleInput}
                          />
                          <Label check for="isFeatured">
                            Featured / Priority
                          </Label>
                        </div>
                      </Col>

                      <Col md="6" className="mb-3">
                        <Label>Verification Status</Label>
                        <Input
                          type="select"
                          name="verificationStatus"
                          onChange={handleInput}
                          value={formData.verificationStatus}
                        >
                          <option value="Not Claimed">Not Claimed</option>
                          <option value="Claim Requested">Claim Requested</option>
                          <option value="Verified">Verified</option>
                        </Input>
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>Internal Notes (Admin Only)</Label>
                        <Input
                          type="textarea"
                          name="internalNotes"
                          value={formData.internalNotes}
                          onChange={handleInput}
                          placeholder="Private notes for admin reference..."
                          rows="3"
                        />
                      </Col>
                    </Row>
                  )}

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    <Button
                      type="button"
                      color="secondary"
                      onClick={handlePreviousStep}
                      disabled={currentStep === 1}
                    >
                      <i className="bx bx-chevron-left me-1"></i>
                      Previous
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button 
                        type="button" 
                        color="primary" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleNextStep();
                        }}
                      >
                        Next
                        <i className="bx bx-chevron-right ms-1"></i>
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        color="success"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        }}
                      >
                        <i className="bx bx-save me-1"></i>
                        Update Celebrity
                      </Button>
                    )}
                  </div>

                  <div className="text-center mt-3">
                    <Button
                      type="button"
                      color="link"
                      onClick={() => navigate("/dashboard/celebrity-list")}
                    >
                      Cancel & Go Back
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateCelebrityForm;