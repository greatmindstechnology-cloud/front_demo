import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  FormHelperText,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import profilePhoto from "../../assets/emptyprofile.png";
import EditBanner from "../../assets/educational_banner.jpg";
import "../studentEditForm.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgressWithLabel from "../progressBar";

// Yup schema for validation, aligned with VendorDetailsForm
const vendorEditSchema = yup.object().shape({
  business_name: yup
    .string()
    .required("Business Name is required")
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name must be at most 100 characters"),
  registration_number: yup
    .string()
    .required("Registration Number is required")
    .min(5, "Registration number must be at least 5 characters")
    .max(50, "Registration number must be at most 50 characters"),
  contact_person: yup
    .string()
    .required("Contact person name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
  contact_email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  contact_phone: yup
    .string()
    .required("Phone Number is required")
    .matches(/^\+\d{1,4}\d{6,14}$/, "Phone number must be 7-14 digits"),
  alternate_contact: yup
    .string()
    .matches(/^\+\d{1,4}\d{6,14}$/, "Invalid phone number (7-14 digits)")
    .optional(),
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters"),
  bank_name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .optional(),
  account_number: yup
    .string()
    .matches(/^[0-9]{9,18}$/, "Invalid account number (9-18 digits)")
    .optional(),
  account_holder_name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .optional(),
  ifsc_code: yup
    .string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
    .optional(),
  gst_number: yup
    .string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Enter a valid GST number")
    .optional(),
  website: yup
    .string()
    .matches(/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL")
    .optional(),
  events_type: yup.string().optional(),
  event_history: yup
    .string()
    .max(1000, "Event history must be at most 1000 characters")
    .optional(),
  business_type: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .optional(),
  year_of_establishment: yup
    .number()
    .typeError("Year must be a number")
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), `Year cannot be in the future`)
    .optional(),
  city: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .optional(),
  state: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .optional(),
  country: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .optional(),
  landmark: yup
    .string()
    .matches(/^[A-Za-z0-9\s]+$/, "Only letters, numbers, and spaces are allowed")
    .optional(),
  door_number: yup
    .string()
    .matches(/^[A-Za-z0-9\s\/-]+$/, "Invalid door number")
    .optional(),
  pincode: yup
    .string()
    .matches(/^[0-9]{5,10}$/, "Invalid pincode (5-10 digits)")
    .optional(),
  gst_certificate: yup
    .mixed()
    .test("fileType", "Only PDF, JPG, or PNG files are allowed", (value) =>
      !value || (value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type))
    )
    .test("fileSize", "File size must be less than 5MB", (value) =>
      !value || (value[0] && value[0].size <= 5 * 1024 * 1024)
    )
    .optional(),
  business_license: yup
    .mixed()
    .test("fileType", "Only PDF, JPG, or PNG files are allowed", (value) =>
      !value || (value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type))
    )
    .test("fileSize", "File size must be less than 5MB", (value) =>
      !value || (value[0] && value[0].size <= 5 * 1024 * 1024)
    )
    .optional(),
  pan_card: yup
    .mixed()
    .test("fileType", "Only PDF, JPG, or PNG files are allowed", (value) =>
      !value || (value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type))
    )
    .test("fileSize", "File size must be less than 5MB", (value) =>
      !value || (value[0] && value[0].size <= 5 * 1024 * 1024)
    )
    .optional(),
});

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

export default function VendorEditProfile() {
  const [tabValue, setTabValue] = useState(0);
  const [vendorData, setVendorData] = useState({});
  const [progress, setProgress] = useState(10);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
    trigger,
  } = useForm({
    resolver: yupResolver(vendorEditSchema),
    mode: "onChange",
    defaultValues: {
      business_name: "",
      registration_number: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      alternate_contact: "",
      address: "",
      bank_name: "",
      account_number: "",
      account_holder_name: "",
      ifsc_code: "",
      gst_number: "",
      website: "",
      events_type: "",
      event_history: "",
      business_type: "",
      year_of_establishment: "",
      city: "",
      state: "",
      country: "",
      landmark: "",
      door_number: "",
      pincode: "",
      gst_certificate: null,
      business_license: null,
      pan_card: null,
    },
  });

  const BASE_URL = "http://localhost:8000";

  const fetchData = async () => {
    try {
      const vendorEmail = localStorage.getItem("userEmail");
      if (!vendorEmail) {
        throw new Error("Vendor email not found in localStorage. Please log in again.");
      }

      console.log("Fetching vendor data for email:", vendorEmail);
      const response = await fetch(`${BASE_URL}/admin_gmt/vendor/?email=${vendorEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vendor data: ${response.status} ${response.statusText}`);
      }

      const vendorDataResponse = await response.json();
      console.log("Parsed Vendor Data:", vendorDataResponse);

      if (vendorDataResponse.status !== "success" || !vendorDataResponse.data) {
        throw new Error("Invalid response from server");
      }

      const vendor = vendorDataResponse.data;
      const formData = {
        business_name: vendor.business_name || "",
        registration_number: vendor.registration_number || "",
        contact_person: `${vendor.firstname || ""} ${vendor.lastname || ""}`.trim() || "",
        contact_email: vendor.email || "",
        contact_phone: vendor.contact_phone || "",
        alternate_contact: vendor.alternate_contact || "",
        address: `${vendor.door_number || ""} ${vendor.street_Name || ""}`.trim() || "",
        bank_name: vendor.bank_name || "",
        account_number: vendor.account_number || "",
        account_holder_name: vendor.account_holder_name || "",
        ifsc_code: vendor.ifsc_code || "",
        gst_number: vendor.gst_number || "",
        website: vendor.website || "",
        events_type: vendor.event_type || "",
        event_history: vendor.event_history || "",
        business_type: vendor.business_type || "",
        year_of_establishment: vendor.year_of_establishment ? String(vendor.year_of_establishment) : "",
        city: vendor.city || "",
        state: vendor.state || "",
        country: vendor.country || "",
        landmark: vendor.landmark || "",
        door_number: vendor.door_number || "",
        pincode: vendor.pincode || "",
        gst_certificate: null || "",
        business_license: null,
        pan_card: null,
      };

      setVendorData({
        ...vendor,
        gst_certificate: vendor.gst_certificate ? { name: vendor.gst_certificate_name, url: `${BASE_URL}${vendor.gst_certificate}` } : null,
        business_license: vendor.business_license ? { name: vendor.business_license_name, url: `${BASE_URL}${vendor.business_license}` } : null,
        pan_card: vendor.pan_card ? { name: vendor.pan_card_name, url: `${BASE_URL}${vendor.pan_card}` } : null,
      });
      reset(formData);
      console.log("Vendor Data set to form:", formData);

      const profilePicture = vendor.profile_picture ? `${BASE_URL}${vendor.profile_picture}` : null;
      setImage(profilePicture);
      if (profilePicture) {
        setProgress((prev) => Math.min(prev + 20, 100));
      }

      localStorage.setItem(
        "vendorData",
        JSON.stringify({
          ...vendor,
          image: profilePicture,
          gst_certificate: vendor.gst_certificate ? { name: vendor.gst_certificate_name, url: `${BASE_URL}${vendor.gst_certificate}` } : null,
          business_license: vendor.business_license ? { name: vendor.business_license_name, url: `${BASE_URL}${vendor.business_license}` } : null,
          pan_card: vendor.pan_card ? { name: vendor.pan_card_name, url: `${BASE_URL}${vendor.pan_card}` } : null,
        })
      );

      return vendor;
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setError(error.message);
      return null;
    }
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("vendorData") || "{}");
    if (savedData && Object.keys(savedData).length > 0) {
      const formData = {
        business_name: savedData.business_name || "",
        registration_number: savedData.registration_number || "",
        contact_person: `${savedData.firstname || ""} ${savedData.lastname || ""}`.trim() || "",
        contact_email: savedData.email || "",
        contact_phone: savedData.contact_phone || "",
        alternate_contact: savedData.alternate_contact || "",
        address: `${savedData.door_number || ""} ${savedData.street_Name || ""}`.trim() || "",
        bank_name: savedData.bank_name || "",
        account_number: savedData.account_number || "",
        account_holder_name: savedData.account_holder_name || "",
        ifsc_code: savedData.ifsc_code || "",
        gst_number: savedData.gst_number || "",
        website: savedData.website || "",
        events_type: savedData.event_type || "",
        event_history: savedData.event_history || "",
        business_type: savedData.business_type || "",
        year_of_establishment: savedData.year_of_establishment ? String(savedData.year_of_establishment) : "",
        city: savedData.city || "",
        state: savedData.state || "",
        country: savedData.country || "",
        landmark: savedData.landmark || "",
        door_number: savedData.door_number || "",
        pincode: savedData.pincode || "",
        gst_certificate: null,
        business_license: null,
        pan_card: null,
      };
      reset(formData);
      setVendorData(savedData);
      if (savedData.image) {
        setImage(savedData.image);
        setProgress((prev) => Math.min(prev + 20, 100));
      }
    }

    fetchData();
  }, [reset]);

  const handleVendorSubmit = async (data) => {
    try {
      console.log("Submitting data:", data);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        } else if (value) {
          formData.append(key, value);
        }
      });
      if (image && image.startsWith("data:")) {
        const blob = await fetch(image).then((r) => r.blob());
        formData.append("profile_picture", blob, "profile.jpg");
      }

      const response = await fetch(`${BASE_URL}/admin_gmt/update/vendor/?id=${vendorData.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update vendor: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Vendor updated successfully:", result);

      // Update vendorData with new file URLs if provided by the backend
      const updatedVendorData = {
        ...vendorData,
        ...data,
        gst_certificate: result.data.gst_certificate ? { name: result.data.gst_certificate_name, url: `${BASE_URL}${result.data.gst_certificate}` } : vendorData.gst_certificate,
        business_license: result.data.business_license ? { name: result.data.business_license_name, url: `${BASE_URL}${result.data.business_license}` } : vendorData.business_license,
        pan_card: result.data.pan_card ? { name: result.data.pan_card_name, url: `${BASE_URL}${result.data.pan_card}` } : vendorData.pan_card,
      };
      setVendorData(updatedVendorData);
      localStorage.setItem("vendorData", JSON.stringify(updatedVendorData));

      // Reset form with submitted data to retain values
      reset({ ...data, gst_certificate: null, business_license: null, pan_card: null });
      alert("Vendor updated successfully!");
      setProgress((prev) => Math.min(prev + 20, 100));
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert(`Error updating vendor: ${error.message}`);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setProgress((prev) => Math.min(prev + 20, 100));
        localStorage.setItem(
          "vendorData",
          JSON.stringify({ ...vendorData, image: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancel = () => {
    reset({
      business_name: "",
      registration_number: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      alternate_contact: "",
      address: "",
      bank_name: "",
      account_number: "",
      account_holder_name: "",
      ifsc_code: "",
      gst_number: "",
      website: "",
      events_type: "",
      event_history: "",
      business_type: "",
      year_of_establishment: "",
      city: "",
      state: "",
      country: "",
      landmark: "",
      door_number: "",
      pincode: "",
      gst_certificate: null,
      business_license: null,
      pan_card: null,
    });
    setImage(null);
    setProgress(10);
    localStorage.removeItem("vendorData");
    setVendorData({});
  };

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div className="EditStudentDetails">
          <img
            src={EditBanner}
            style={{ width: "100%", height: "220px", objectFit: "cover" }}
            alt="Banner"
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
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <Avatar
                            src={image || profilePhoto}
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
                        <h6>{vendorData.business_name || "Vendor"}</h6>
                        <small>{vendorData.business_type || "Vendor Role"}</small>
                      </div>
                      <div>
                        <List aria-label="mailbox folders">
                          <ListItem>
                            <ListItemText primary="Profile Status" />
                            <Box>
                              <CircularProgressWithLabel value={progress} />
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Contracts Completed" />
                            <Box>
                              <Typography style={{ color: "red" }}>Pending</Typography>
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Active Contracts" />
                            <Box>
                              <Typography>{vendorData.active_contracts || 5}</Typography>
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
                      <Tabs value={tabValue} onChange={handleTabChange} aria-label="form tabs">
                        <Tab label="Vendor Details" {...a11yProps(0)} />
                        <Tab label="Documents Upload" {...a11yProps(1)} />
                      </Tabs>
                    </Box>

                    <CardContent>
                      <CustomTabPanel value={tabValue} index={0}>
                        <form onSubmit={handleSubmit(handleVendorSubmit)} noValidate>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Business Name <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !!vendorData.business_name || isDirty }}
                                {...register("business_name", {
                                  required: "Business name is required",
                                  pattern: {
                                    value: /^[A-Za-z0-9\s&,.()-]+$/,
                                    message: "Invalid business name",
                                  },
                                })}
                                error={!!errors.business_name}
                                helperText={errors.business_name?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Registration Number <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !!vendorData.registration_number || isDirty }}
                                {...register("registration_number", {
                                  required: "Registration number is required",
                                  pattern: {
                                    value: /^[A-Za-z0-9-]+$/,
                                    message: "Invalid registration number",
                                  },
                                })}
                                error={!!errors.registration_number}
                                helperText={errors.registration_number?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Contact Person <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !vendorData.contact_person || isDirty }}
                                {...register("contact_person", {
                                  required: "Contact person name is required",
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.contact_person}
                                helperText={errors.contact_person?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Contact Email <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                type="email"
                                InputLabelProps={{ shrink: !!vendorData.contact_email || isDirty }}
                                {...register("contact_email", {
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                  },
                                })}
                                error={!!errors.contact_email}
                                helperText={errors.contact_email?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Contact Phone <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                type="tel"
                                InputLabelProps={{ shrink: !!vendorData.contact_phone || isDirty }}
                                {...register("contact_phone", {
                                  required: "Phone number is required",
                                  pattern: {
                                    value: /^\+?\d{10,15}$/,
                                    message: "Invalid phone number (10-15 digits, optional +)",
                                  },
                                })}
                                error={!!errors.contact_phone}
                                helperText={errors.contact_phone?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Alternate Contact"
                                type="tel"
                                InputLabelProps={{ shrink: !!vendorData.alternate_contact || isDirty }}
                                {...register("alternate_contact", {
                                  pattern: {
                                    value: /^\+?\d{10,15}$/,
                                    message: "Invalid phone number (10-15 digits, optional +)",
                                  },
                                })}
                                error={!!errors.alternate_contact}
                                helperText={errors.alternate_contact?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Door Number"
                                InputLabelProps={{ shrink: !!vendorData.door_number || isDirty }}
                                {...register("door_number", {
                                  pattern: {
                                    value: /^[A-Za-z0-9\s\/-]+$/,
                                    message: "Invalid door number",
                                  },
                                })}
                                error={!!errors.door_number}
                                helperText={errors.door_number?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Landmark"
                                InputLabelProps={{ shrink: !!vendorData.landmark || isDirty }}
                                {...register("landmark", {
                                  pattern: {
                                    value: /^[A-Za-z0-9\s]+$/,
                                    message: "Only letters, numbers, and spaces are allowed",
                                  },
                                })}
                                error={!!errors.landmark}
                                helperText={errors.landmark?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="City"
                                InputLabelProps={{ shrink: !!vendorData.city || isDirty }}
                                {...register("city", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="State"
                                InputLabelProps={{ shrink: !!vendorData.state || isDirty }}
                                {...register("state", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.state}
                                helperText={errors.state?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Country"
                                InputLabelProps={{ shrink: !!vendorData.country || isDirty }}
                                {...register("country", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.country}
                                helperText={errors.country?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Pincode"
                                type="text"
                                InputLabelProps={{ shrink: !!vendorData.pincode || isDirty }}
                                {...register("pincode", {
                                  pattern: {
                                    value: /^[0-9]{5,10}$/,
                                    message: "Invalid pincode (5-10 digits)",
                                  },
                                })}
                                error={!!errors.pincode}
                                helperText={errors.pincode?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Bank Name"
                                InputLabelProps={{ shrink: !!vendorData.bank_name || isDirty }}
                                {...register("bank_name", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.bank_name}
                                helperText={errors.bank_name?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Account Holder Name"
                                InputLabelProps={{ shrink: !!vendorData.account_holder_name || isDirty }}
                                {...register("account_holder_name", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.account_holder_name}
                                helperText={errors.account_holder_name?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Account Number"
                                InputLabelProps={{ shrink: !!vendorData.account_number || isDirty }}
                                {...register("account_number", {
                                  pattern: {
                                    value: /^[0-9]{9,18}$/,
                                    message: "Invalid account number (9-18 digits)",
                                  },
                                })}
                                error={!!errors.account_number}
                                helperText={errors.account_number?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="IFSC Code"
                                InputLabelProps={{ shrink: !!vendorData.ifsc_code || isDirty }}
                                {...register("ifsc_code", {
                                  pattern: {
                                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                    message: "Invalid IFSC code",
                                  },
                                })}
                                error={!!errors.ifsc_code}
                                helperText={errors.ifsc_code?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="GST Number"
                                InputLabelProps={{ shrink: !!vendorData.gst_number || isDirty }}
                                {...register("gst_number", {
                                  pattern: {
                                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                    message: "Invalid GST number",
                                  },
                                })}
                                error={!!errors.gst_number}
                                helperText={errors.gst_number?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Company Website"
                                InputLabelProps={{ shrink: !!vendorData.website || isDirty }}
                                {...register("website", {
                                  pattern: {
                                    value: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
                                    message: "Invalid URL",
                                  },
                                })}
                                error={!!errors.website}
                                helperText={errors.website?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Business Type"
                                InputLabelProps={{ shrink: !!vendorData.business_type || isDirty }}
                                {...register("business_type", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!errors.business_type}
                                helperText={errors.business_type?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Year of Establishment"
                                type="number"
                                InputLabelProps={{ shrink: !!vendorData.year_of_establishment || isDirty }}
                                {...register("year_of_establishment", {
                                  pattern: {
                                    value: /^[0-9]{4}$/,
                                    message: "Enter a valid 4-digit year",
                                  },
                                  validate: (value) =>
                                    !value ||
                                    (value >= 1900 && value <= new Date().getFullYear()) ||
                                    "Year must be between 1900 and current year",
                                })}
                                error={!!errors.year_of_establishment}
                                helperText={errors.year_of_establishment?.message}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Events Type"
                                InputLabelProps={{ shrink: !!vendorData.events_type || isDirty }}
                                {...register("events_type")}
                                error={!!errors.events_type}
                                helperText={errors.events_type?.message}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Event History"
                                InputLabelProps={{ shrink: !!vendorData.event_history || isDirty }}
                                {...register("event_history")}
                                error={!!errors.event_history}
                                helperText={errors.event_history?.message}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                  Update
                                </Button>
                                <Button
                                  type="button"
                                  variant="outlined"
                                  color="info"
                                  fullWidth
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </form>
                      </CustomTabPanel>
                      <CustomTabPanel value={tabValue} index={1}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography>
                              GST Certificate (PDF/Image)
                            </Typography>
                            <Typography
                              sx={{ mb: 1, color: vendorData.gst_certificate ? 'green' : 'red' }}
                            >
                              Status: {vendorData.gst_certificate ? 'Approved' : 'Not Approved'}
                            </Typography>
                            {vendorData.gst_certificate && (
                              <Typography sx={{ mb: 1 }}>
                                Current File:{" "}
                                <a
                                  href={vendorData.gst_certificate.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {vendorData.gst_certificate.name || "View GST Certificate"}
                                </a>
                              </Typography>
                            )}
                            <Controller
                              name="gst_certificate"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => {
                                      field.onChange(e.target.files);
                                      trigger("gst_certificate");
                                    }}
                                    style={{ marginBottom: 8 }}
                                    id="gst-certificate"
                                    aria-describedby={errors.gst_certificate ? "gst-certificate-error" : undefined}
                                  />
                                  <FormHelperText id="gst-certificate-error" error={!!errors.gst_certificate}>
                                    {errors.gst_certificate?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                            <Typography>
                              Business License/Registration Certificate (PDF/Image)
                            </Typography>
                            <Typography
                              sx={{ mb: 1, color: vendorData.business_license ? 'green' : 'red' }}
                            >
                              Status: {vendorData.business_license ? 'Approved' : 'Not Approved'}
                            </Typography>
                            {vendorData.business_license && (
                              <Typography sx={{ mb: 1 }}>
                                Current File:{" "}
                                <a
                                  href={vendorData.business_license.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {vendorData.business_license.name || "View Business License"}
                                </a>
                              </Typography>
                            )}
                            <Controller
                              name="business_license"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => {
                                      field.onChange(e.target.files);
                                      trigger("business_license");
                                    }}
                                    style={{ marginBottom: 8 }}
                                    id="business-license"
                                    aria-describedby={errors.business_license ? "business-license-error" : undefined}
                                  />
                                  <FormHelperText id="business-license-error" error={!!errors.business_license}>
                                    {errors.business_license?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography>
                              PAN Card (PDF/Image)
                            </Typography>
                            <Typography
                              sx={{ mb: 1, color: vendorData.pan_card ? 'green' : 'red' }}
                            >
                              Status: {vendorData.pan_card ? 'Approved' : 'Not Approved'}
                            </Typography>
                            {vendorData.pan_card && (
                              <Typography sx={{ mb: 1 }}>
                                Current File:{" "}
                                <a
                                  href={vendorData.pan_card.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {vendorData.pan_card.name || "View PAN Card"}
                                </a>
                              </Typography>
                            )}
                            <Controller
                              name="pan_card"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => {
                                      field.onChange(e.target.files);
                                      trigger("pan_card");
                                    }}
                                    style={{ marginBottom: 8 }}
                                    id="pan-card"
                                    aria-describedby={errors.pan_card ? "pan-card-error" : undefined}
                                  />
                                  <FormHelperText id="pan-card-error" error={!!errors.pan_card}>
                                    {errors.pan_card?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit(handleVendorSubmit)}
                              >
                                Update Documents
                              </Button>
                              <Button
                                type="button"
                                variant="outlined"
                                color="info"
                                fullWidth
                                onClick={handleCancel}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CustomTabPanel>

                    </CardContent>
                  </Card>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}