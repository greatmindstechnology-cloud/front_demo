import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Menu,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Editprofilebanner from "../assets/educational_banner2.jpg";
import "./studentEditForm.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgressWithLabe from "./progressBar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const personalForm = useForm({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      gender: "",
      contact_number: "",
      alt_contact: "",
      pincode: "",
      designation: "",
      mother_name: "",
      father_name: "",
      street_name: "",
      door_number: "",
      landmark: "",
      country: "",
      state: "",
      city: "",
      description: "",
      skills: [],
    },
  });

  const educationForm = useForm({
    mode: "onChange",
    defaultValues: {
      institution_name: "",
      qualification: "",
      cgpa: "",
      location: "",
      major_subject: "",
      passedout: null,
    },
  });

  const bankingForm = useForm({
    mode: "onChange",
    defaultValues: {
      account_holder_name: "",
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      branch_name: "",
      bank_location: "",
    },
  });

  const { control, handleSubmit, register, setValue, reset, formState: { isDirty } } = personalForm;
  const { control: educationControl, handleSubmit: handleEducationSubmit, register: registerEducation, reset: resetEducation, formState: { isDirty: isEducationDirty } } = educationForm;
  const { handleSubmit: handleBankingSubmit, register: registerBanking, reset: resetBanking } = bankingForm;

  const [personalData, setPersonalData] = useState({});
  const [educationData, setEducationData] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [enabledTabs, setEnabledTabs] = useState([true, false, false]);
  const [progress, setProgress] = useState(10);
  const [image, setImage] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [getStudentData, setGetStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [formReady, setFormReady] = useState(false);

  const country = personalForm.watch("country");
  const state = personalForm.watch("state");

  const inputRef = useRef();
  const BASE_URL = "https://backend-demo-esqk.onrender.com";

  const locationData = {
    India: {
      TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
      Karnataka: ["Bangalore", "Mysore", "Mangalore"],
      Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    },
    USA: {
      California: ["Los Angeles", "San Francisco", "San Diego"],
      Texas: ["Houston", "Austin", "Dallas"],
      NewYork: ["New York City", "Buffalo", "Rochester"],
    },
    UAE: {
      Dubai: ["Dubai Marina", "Downtown Dubai", "Jumeirah"],
      AbuDhabi: ["Abu Dhabi City", "Al Ain", "Al Dhafra"],
      Sharjah: ["Sharjah City", "Musuri", "Kalba"],
    },
  };

  const countries = Object.keys(locationData);
  const states = country ? Object.keys(locationData[country] || {}) : [];
  const cities = state && country ? locationData[country][state] || [] : [];

  useEffect(() => {
    if (country) {
      setValue("state", "");
      setValue("city", "");
    }
  }, [country, setValue]);

  useEffect(() => {
    if (state) {
      setValue("city", "");
    }
  }, [state, setValue]);

  const fetchData = async () => {
    try {
      const studentEmail = localStorage.getItem("userEmail");
      if (!studentEmail) {
        throw new Error("User email not found in localStorage");
      }

      const response = await fetch(
        `${BASE_URL}/admin_gmt/student/?email=${encodeURIComponent(studentEmail)}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch student data: ${response.status} ${response.statusText}`);
      }

      const studentData = await response.json();
      if (studentData.status !== "success" || !studentData.data) {
        throw new Error("Invalid response from server");
      }

      const student = studentData.data;
      setGetStudentData(student);

      const profilePicture = student.profile_picture
        ? `${BASE_URL}${student.profile_picture}`
        : null;
      setImage(profilePicture);
      if (profilePicture) {
        setProgress((prev) => Math.min(prev + 20, 100));
      }

      return student;
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchData();
    const savedPersonal = JSON.parse(localStorage.getItem("personalData") || "{}");
    const savedEducation = JSON.parse(localStorage.getItem("educationData") || "{}");

    setPersonalData(savedPersonal);
    setEducationData(savedEducation);

    return () => {};
  }, []);

  useEffect(() => {
    if (getStudentData && Object.keys(getStudentData).length > 0) {
      let skills = getStudentData.skills || [];
      if (typeof skills === "string") {
        try {
          skills = JSON.parse(skills);
        } catch (e) {
          console.error("Error parsing skills:", e);
          skills = [];
        }
      }

      console.log("getStudentData.cgpa:", getStudentData.cgpa, typeof getStudentData.cgpa);

      reset({
        firstname: getStudentData.firstname || "",
        lastname: getStudentData.lastname || "",
        email: getStudentData.email || "",
        gender: getStudentData.gender || "",
        contact_number: getStudentData.contact_number || "",
        alt_contact: getStudentData.alt_contact || "",
        pincode: getStudentData.pincode || "",
        designation: getStudentData.designation || "",
        mother_name: getStudentData.mother_name || "",
        father_name: getStudentData.father_name || "",
        street_name: getStudentData.street_name || "",
        door_number: getStudentData.door_number || "",
        landmark: getStudentData.landmark || "",
        country: getStudentData.country || "",
        state: getStudentData.state || "",
        city: getStudentData.city || "",
        description: getStudentData.description || "",
        skills: Array.isArray(skills) ? skills : [],
      }, { keepDirty: false });

      resetEducation({
        institution_name: getStudentData.institution_name || "",
        qualification: getStudentData.qualification || "",
        cgpa: getStudentData.cgpa !== null ? String(getStudentData.cgpa) : "",
        location: getStudentData.location || "",
        major_subject: getStudentData.major_subject || "",
        passedout: getStudentData.passedout
          ? new Date(parseInt(getStudentData.passedout), 0, 1)
          : null,
      }, { keepDirty: false });

      resetBanking({
        account_holder_name: getStudentData.account_holder_name || "",
        bank_name: getStudentData.bank_name || "",
        account_number: getStudentData.account_number || "",
        ifsc_code: getStudentData.ifsc_code || "",
        branch_name: getStudentData.branch_name || "",
        bank_location: getStudentData.bank_location || "",
      }, { keepDirty: false });

      setFormReady(true);
    }
  }, [getStudentData, reset, resetEducation, resetBanking]);

  useEffect(() => {
    if (getStudentData && getStudentData.country && getStudentData.state && getStudentData.city) {
      const availableCities = locationData[getStudentData.country]?.[getStudentData.state] || [];
      if (availableCities.includes(getStudentData.city)) {
        setValue("city", getStudentData.city, { shouldValidate: true });
      }
    }
  }, [getStudentData, country, state, setValue]);

  const handlePersonalSave = (data) => {
    setPersonalData(data);
    localStorage.setItem("personalData", JSON.stringify(data));
    setProgress((prev) => Math.min(prev + 20, 100));
    enableTabAndMove(1);
    alert("Personal details saved.");
  };

  const handleEducationSave = (data) => {
    const cgpaValue = data.cgpa ? parseFloat(parseInt(data.cgpa, 10)).toFixed(1) : null;
    console.log("Saving education cgpa:", cgpaValue);

    const formattedData = {
      ...data,
      cgpa: cgpaValue,
      passedout: data.passedout ? new Date(data.passedout).getFullYear().toString() : null,
    };
    setEducationData(formattedData);
    localStorage.setItem("educationData", JSON.stringify(formattedData));
    setProgress((prev) => Math.min(prev + 20, 100));
    enableTabAndMove(2);
    alert("Education details saved.");
  };

  const handleFinalSubmit = async (bankingData) => {
    const finalData = {
      ...personalData,
      ...educationData,
      ...bankingData,
    };

    const formData = new FormData();
    Object.entries(finalData).forEach(([key, value]) => {
      if (key === "skills" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key === "cgpa" && value !== null) {
        const cgpaValue = parseFloat(parseInt(value, 10)).toFixed(1);
        console.log("Submitting cgpa:", cgpaValue);
        formData.append(key, cgpaValue);
      } else if (key === "passedout" && value) {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value || "");
      }
    });

    if (image && image.startsWith("data:")) {
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("profile_picture", blob, "profile.jpg");
    }

    try {
      const response = await fetch(
        `${BASE_URL}/admin_gmt/update/student/?email=${encodeURIComponent(finalData.email)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
      } 

      const result = await response.json();
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      alert(`Form submitted successfully: ${result.message}`);
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to submit form: ${error.message}`);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setProgress((prev) => Math.min(prev + 20, 100));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  const enableTabAndMove = (nextTabIndex) => {
    setEnabledTabs((prev) => {
      const updated = [...prev];
      updated[nextTabIndex] = true;
      return updated;
    });
    setTabIndex(nextTabIndex);
  };

  const handleTabChange = (event, newValue) => {
    if (enabledTabs[newValue]) {
      setTabIndex(newValue);
    }
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const skillOptions = [
    "React",
    "Node.js",
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Go",
    "CSS",
    "HTML",
    "Angular",
    "SQL",
    "Django",
  ];

  return (
    <div>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      {formReady && (
        <div style={{ position: "relative" }}>
          <div className="profile-icon-container">
            <IconButton onClick={handleProfileClick} aria-label="Profile">
              <Avatar src={image} alt="Profile" sx={{ width: 40, height: 40 }} />
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  opacity: 1,
                  transition:
                    "opacity 251ms cubic-bezier(0.4, 0, 0.2, 1), transform 167ms cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: 3,
                  backgroundColor: "background.paper",
                  borderRadius: "4px",
                  minWidth: 150,
                  left: "auto",
                  right: 0,
                },
              }}
            >
              <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
            </Menu>
          </div>

          <div className="EditStudentDetails">
            <img
              src={Editprofilebanner}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
              alt="Profile banner"
            />
            <div>
              <div className="row" style={{ position: "relative" }}>
                <div
                  className="col-lg-4 col-md-4 col-xl-4"
                  style={{
                    padding: "0px 20px",
                    position: "absolute",
                    top: "-40px",
                    left: "20px",
                  }}
                >
                  <Card>
                    <CardContent>
                      <div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Avatar
                              src={image}
                              alt="Profile"
                              sx={{ width: 120, height: 120 }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              ref={inputRef}
                              onChange={handleImageChange}
                              style={{ display: "none" }}
                            />
                            <IconButton
                              onClick={handleIconClick}
                              style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundColor: "white",
                              }}
                              size="small"
                            >
                              <PhotoCameraIcon />
                            </IconButton>
                          </div>
                          <h6>{getStudentData?.firstname || "N/A"}</h6>
                          <small>
                            {getStudentData?.designation || "Student"}
                          </small>
                        </div>
                        <div>
                          <List aria-label="mailbox folders">
                            <ListItem>
                              <ListItemText primary="Profile Status" />
                              <Box>
                                <CircularProgressWithLabe value={progress} />
                              </Box>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                              <ListItemText primary="Course Completed" />
                              <Box>
                                <Typography style={{ color: "red" }}>
                                  Pending
                                </Typography>
                              </Box>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                              <ListItemText primary="Course Enrolled" />
                              <Box>
                                <Typography>
                                  {getStudentData?.courseEnrolled || 5}
                                </Typography>
                              </Box>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                              <ListItemText primary="Activated Course" />
                              <Box>
                                <Typography>
                                  {getStudentData?.activatedCourse || 2}
                                </Typography>
                              </Box>
                            </ListItem>
                          </List>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div
                  className="col-lg-8 col-md-8 col-xl-8"
                  style={{
                    padding: "0px 50px",
                    position: "absolute",
                    top: "-40px",
                    right: "5px",
                  }}
                >
                  <Box>
                    <Card variant="outlined">
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={tabIndex}
                          onChange={handleTabChange}
                          aria-label="form tabs"
                        >
                          <Tab
                            label="Personal Details"
                            disabled={!enabledTabs[0]}
                            {...a11yProps(0)}
                          />
                          <Tab
                            label="Educational Details"
                            disabled={!enabledTabs[1]}
                            {...a11yProps(1)}
                          />
                          <Tab
                            label="Bank Details"
                            disabled={!enabledTabs[2]}
                            {...a11yProps(2)}
                          />
                        </Tabs>
                      </Box>

                      <CardContent>
                        <CustomTabPanel value={tabIndex} index={0}>
                          <form onSubmit={handleSubmit(handlePersonalSave)}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label={
                                    <>
                                      First Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  InputLabelProps={{ shrink: !!getStudentData?.firstname || isDirty }}
                                  {...register("firstname", {
                                    required: "First name is required",
                                    pattern: {
                                      value: /^[A-Za-z\s]+$/,
                                      message: "Only letters and spaces are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.firstname}
                                  helperText={personalForm.formState.errors.firstname?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label={
                                    <>
                                      Last Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  InputLabelProps={{ shrink: !!getStudentData?.lastname || isDirty }}
                                  {...register("lastname", {
                                    required: "Last name is required",
                                    pattern: {
                                      value: /^[A-Za-z\s]+$/,
                                      message: "Only letters and spaces are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.lastname}
                                  helperText={personalForm.formState.errors.lastname?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  type="email"
                                  label={
                                    <>
                                      Email <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  InputLabelProps={{ shrink: !!getStudentData?.email || isDirty }}
                                  {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                      message: "Invalid email format",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.email}
                                  helperText={personalForm.formState.errors.email?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Controller
                                  name="gender"
                                  control={control}
                                  rules={{ required: "Gender is required" }}
                                  render={({ field, fieldState: { error } }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      select
                                      label={
                                        <>
                                          Gender <span style={{ color: "red" }}>*</span>
                                        </>
                                      }
                                      InputLabelProps={{ shrink: !!getStudentData?.gender || isDirty }}
                                      error={!!error}
                                      helperText={error?.message}
                                    >
                                      <MenuItem value="">Select Gender</MenuItem>
                                      <MenuItem value="Male">Male</MenuItem>
                                      <MenuItem value="Female">Female</MenuItem>
                                      <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label={
                                    <>
                                      Contact Number <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  type="tel"
                                  InputLabelProps={{ shrink: !!getStudentData?.contact_number || isDirty }}
                                  {...register("contact_number", {
                                    required: "Contact number is required",
                                    pattern: {
                                      value: /^\+\d{1,4}\d{6,14}$/,
                                      message: "Enter a valid phone number with country code",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.contact_number}
                                  helperText={personalForm.formState.errors.contact_number?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Alternative Number"
                                  type="tel"
                                  InputLabelProps={{ shrink: !!getStudentData?.alt_contact || isDirty }}
                                  {...register("alt_contact", {
                                    pattern: {
                                      value: /^\+\d{1,4}\d{6,14}$/,
                                      message: "Enter a valid phone number with country code",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.alt_contact}
                                  helperText={personalForm.formState.errors.alt_contact?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <Controller
                                  name="skills"
                                  control={control}
                                  rules={{
                                    required: "At least one skill is required",
                                    validate: (value) =>
                                      value.length > 0 || "At least one skill is required",
                                  }}
                                  render={({ field, fieldState: { error } }) => (
                                    <Autocomplete
                                      {...field}
                                      multiple
                                      options={skillOptions}
                                      value={field.value || []}
                                      onChange={(_, newValue) => field.onChange(newValue)}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label={
                                            <>
                                              Skills <span style={{ color: "red" }}>*</span>
                                            </>
                                          }
                                          InputLabelProps={{ shrink: !!getStudentData?.skills || field.value?.length > 0 || isDirty }}
                                          error={!!error}
                                          helperText={error?.message}
                                        />
                                      )}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Pincode"
                                  type="number"
                                  InputLabelProps={{ shrink: !!getStudentData?.pincode || isDirty }}
                                  {...register("pincode", {
                                    pattern: {
                                      value: /^[0-9]{6}$/,
                                      message: "Enter a valid 6-digit pincode",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.pincode}
                                  helperText={personalForm.formState.errors.pincode?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Designation"
                                  InputLabelProps={{ shrink: !!getStudentData?.designation || isDirty }}
                                  {...register("designation")}
                                  error={!!personalForm.formState.errors.designation}
                                  helperText={personalForm.formState.errors.designation?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Mother's Name"
                                  InputLabelProps={{ shrink: !!getStudentData?.mother_name || isDirty }}
                                  {...register("mother_name", {
                                    pattern: {
                                      value: /^[A-Za-z\s]+$/,
                                      message: "Only letters and spaces are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.mother_name}
                                  helperText={personalForm.formState.errors.mother_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Father's Name"
                                  InputLabelProps={{ shrink: !!getStudentData?.father_name || isDirty }}
                                  {...register("father_name", {
                                    pattern: {
                                      value: /^[A-Za-z\s]+$/,
                                      message: "Only letters and spaces are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.father_name}
                                  helperText={personalForm.formState.errors.father_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label={
                                    <>
                                      Street Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  InputLabelProps={{ shrink: !!getStudentData?.street_name || isDirty }}
                                  {...register("street_name", {
                                    required: "Street name is required",
                                    pattern: {
                                      value: /^[A-Za-z0-9\s]+$/,
                                      message: "Only letters, numbers, and spaces are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.street_name}
                                  helperText={personalForm.formState.errors.street_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Door Number"
                                  InputLabelProps={{ shrink: !!getStudentData?.door_number || isDirty }}
                                  {...register("door_number", {
                                    pattern: {
                                      value: /^[A-Za-z0-9\s\/-]+$/,
                                      message:
                                        "Only letters, numbers, spaces, slashes, and hyphens are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.door_number}
                                  helperText={personalForm.formState.errors.door_number?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Landmark"
                                  InputLabelProps={{ shrink: !!getStudentData?.landmark || isDirty }}
                                  {...register("landmark", {
                                    pattern: {
                                      value: /^[A-Za-z0-9\s]+$/,
                                      message: "Only letters, numbers, and spaces are allowed",
                                    },
                                  })}
                                  error={!!personalForm.formState.errors.landmark}
                                  helperText={personalForm.formState.errors.landmark?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  name="country"
                                  control={control}
                                  rules={{ required: "Country is required" }}
                                  render={({ field, fieldState: { error } }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      select
                                      label={
                                        <>
                                          Country <span style={{ color: "red" }}>*</span>
                                        </>
                                      }
                                      InputLabelProps={{ shrink: !!getStudentData?.country || isDirty }}
                                      error={!!error}
                                      helperText={error?.message}
                                    >
                                      <MenuItem value="">Select Country</MenuItem>
                                      {countries.map((countryOption) => (
                                        <MenuItem key={countryOption} value={countryOption}>
                                          {countryOption}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  name="state"
                                  control={control}
                                  rules={{ required: "State is required" }}
                                  render={({ field, fieldState: { error } }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      select
                                      label={
                                        <>
                                          State <span style={{ color: "red" }}>*</span>
                                        </>
                                      }
                                      InputLabelProps={{ shrink: !!getStudentData?.state || isDirty }}
                                      error={!!error}
                                      helperText={error?.message}
                                      disabled={!country}
                                    >
                                      <MenuItem value="">Select State</MenuItem>
                                      {states.map((stateOption) => (
                                        <MenuItem key={stateOption} value={stateOption}>
                                          {stateOption}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  name="city"
                                  control={control}
                                  rules={{ required: "City is required" }}
                                  render={({ field, fieldState: { error } }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      select
                                      label={
                                        <>
                                          City <span style={{ color: "red" }}>*</span>
                                        </>
                                      }
                                      InputLabelProps={{ shrink: !!getStudentData?.city || isDirty }}
                                      error={!!error}
                                      helperText={error?.message}
                                      disabled={!state}
                                    >
                                      <MenuItem value="">Select City</MenuItem>
                                      {cities.map((cityOption) => (
                                        <MenuItem key={cityOption} value={cityOption}>
                                          {cityOption}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Description"
                                  multiline
                                  rows={3}
                                  InputLabelProps={{ shrink: !!getStudentData?.description || isDirty }}
                                  {...register("description")}
                                  error={!!personalForm.formState.errors.description}
                                  helperText={personalForm.formState.errors.description?.message}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                  <Button type="submit" variant="contained">
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => reset()}
                                  >
                                    Reset
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </form>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabIndex} index={1}>
                          <form onSubmit={handleEducationSubmit(handleEducationSave)}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      College/School Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.institution_name || isEducationDirty }}
                                  {...registerEducation("institution_name", {
                                    required: "Institution name is required",
                                  })}
                                  error={!!educationForm.formState.errors.institution_name}
                                  helperText={educationForm.formState.errors.institution_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Qualification <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.qualification || isEducationDirty }}
                                  {...registerEducation("qualification", {
                                    required: "Qualification is required",
                                  })}
                                  error={!!educationForm.formState.errors.qualification}
                                  helperText={educationForm.formState.errors.qualification?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Total Percentage/CGPA <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  type="number"
                                  fullWidth
                                  InputLabelProps={{ shrink: getStudentData?.cgpa !== null || isEducationDirty }}
                                  {...registerEducation("cgpa", {
                                    required: "CGPA is required",
                                    pattern: {
                                      value: /^[1-9]$|^10$/,
                                      message: "CGPA must be an integer between 1 and 10",
                                    },
                                    validate: (value) => {
                                      if (!value) return "CGPA is required";
                                      const num = parseInt(value, 10);
                                      return (num >= 1 && num <= 10) || "CGPA must be an integer between 1 and 10";
                                    },
                                    setValueAs: (value) => (value ? String(parseInt(value, 10)) : ""),
                                  })}
                                  inputProps={{ min: 1, max: 10, step: 1 }}
                                  error={!!educationForm.formState.errors.cgpa}
                                  helperText={educationForm.formState.errors.cgpa?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Location <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.location || isEducationDirty }}
                                  {...registerEducation("location", {
                                    required: "Location is required",
                                  })}
                                  error={!!educationForm.formState.errors.location}
                                  helperText={educationForm.formState.errors.location?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Major Subject <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.major_subject || isEducationDirty }}
                                  {...registerEducation("major_subject", {
                                    required: "Major subject is required",
                                  })}
                                  error={!!educationForm.formState.errors.major_subject}
                                  helperText={educationForm.formState.errors.major_subject?.message}
                                />
                              </Grid>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={12} sm={6}>
                                  <Controller
                                    name="passedout"
                                    control={educationControl}
                                    rules={{
                                      required: "Year of passing is required",
                                      validate: (date) => {
                                        if (!date) return "Date is required";
                                        const year = new Date(date).getFullYear();
                                        const currentYear = new Date().getFullYear() + 1;
                                        if (year < 1900) return "Enter a valid year";
                                        if (year > currentYear) return "Cannot be in the future";
                                        return true;
                                      },
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                      <DatePicker
                                        label="Year of Passed Out"
                                        views={["year"]}
                                        value={field.value || null}
                                        onChange={(date) => field.onChange(date)}
                                        slotProps={{
                                          textField: {
                                            fullWidth: true,
                                            error: !!error,
                                            helperText: error?.message,
                                            InputLabelProps: { shrink: !!getStudentData?.passedout || isEducationDirty },
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                              </LocalizationProvider>
                              <Grid item xs={12}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                >
                                  Save
                                </Button>
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  type="button"
                                  variant="outlined"
                                  fullWidth
                                  color="primary"
                                  onClick={() => resetEducation()}
                                >
                                  Reset
                                </Button>
                              </Grid>
                            </Grid>
                          </form>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabIndex} index={2}>
                          <form onSubmit={handleBankingSubmit(handleFinalSubmit)}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Account Holder Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.account_holder_name || isDirty }}
                                  {...registerBanking("account_holder_name", {
                                    required: "Account holder name is required",
                                    pattern: {
                                      value: /^[A-Za-z\s]+$/,
                                      message: "Only letters and spaces are allowed",
                                    },
                                  })}
                                  error={!!bankingForm.formState.errors.account_holder_name}
                                  helperText={bankingForm.formState.errors.account_holder_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Bank Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.bank_name || isDirty }}
                                  {...registerBanking("bank_name", {
                                    required: "Bank name is required",
                                  })}
                                  error={!!bankingForm.formState.errors.bank_name}
                                  helperText={bankingForm.formState.errors.bank_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Account Number <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.account_number || isDirty }}
                                  {...registerBanking("account_number", {
                                    required: "Account number is required",
                                    pattern: {
                                      value: /^[0-9]{9,18}$/,
                                      message: "Account number should be 9 to 18 digits",
                                    },
                                  })}
                                  error={!!bankingForm.formState.errors.account_number}
                                  helperText={bankingForm.formState.errors.account_number?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      IFSC Code <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.ifsc_code || isDirty }}
                                  {...registerBanking("ifsc_code", {
                                    required: "IFSC code is required",
                                    pattern: {
                                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                      message: "Enter a valid IFSC code",
                                    },
                                  })}
                                  error={!!bankingForm.formState.errors.ifsc_code}
                                  helperText={bankingForm.formState.errors.ifsc_code?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Branch Name <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.branch_name || isDirty }}
                                  {...registerBanking("branch_name", {
                                    required: "Branch name is required",
                                  })}
                                  error={!!bankingForm.formState.errors.branch_name}
                                  helperText={bankingForm.formState.errors.branch_name?.message}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label={
                                    <>
                                      Bank Location <span style={{ color: "red" }}>*</span>
                                    </>
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: !!getStudentData?.bank_location || isDirty }}
                                  {...registerBanking("bank_location", {
                                    required: "Bank location is required",
                                  })}
                                  error={!!bankingForm.formState.errors.bank_location}
                                  helperText={bankingForm.formState.errors.bank_location?.message}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                >
                                  Submit
                                </Button>
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  type="button"
                                  variant="outlined"
                                  fullWidth
                                  onClick={() => resetBanking()}
                                >
                                  Reset
                                </Button>
                              </Grid>
                            </Grid>
                          </form>
                        </CustomTabPanel>
                      </CardContent>
                    </Card>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  