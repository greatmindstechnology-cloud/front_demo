import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import GMT_Logo_white from "../../assets/Logo_WHITE.png";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Grid,
  Snackbar,
  Alert,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { vendorSignup, sendOtp, verifyOtp } from "../../services/authApi";
import "./vendorSubmitForm.css";

// Yup schema with enhanced validations
const vendorSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .matches(
      /^[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/,
      "Username must be 8-12 characters including letters, numbers, or symbols"
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be a valid format (e.g., example@domain.com)"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  firstname: yup
    .string()
    .required("First Name is required")
    .matches(/^[A-Za-z\s]+$/, "First name must contain only letters and spaces")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastname: yup
    .string()
    .required("Last Name is required")
    .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  business_name: yup
    .string()
    .required("Business Name is required")
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name must be at most 100 characters"),
  business_type: yup.string().required("Business Type is required"),
  gst_number: yup
    .string()
    .required("GST Number is required")
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Enter a valid GST number"),
  registration_number: yup
    .string()
    .required("Registration Number is required")
    .min(5, "Registration number must be at least 5 characters")
    .max(50, "Registration number must be at most 50 characters"),
  year_of_establishment: yup
    .number()
    .typeError("Year must be a number")
    .required("Year of Establishment is required")
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), `Year cannot be in the future`),
  contact_phone: yup
    .string()
    .required("Phone Number is required")
    .matches(/^\+\d{1,4}\d{6,14}$/, "Phone number must be 7-14 digits"),
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters"),
  country: yup
    .string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters"),
  gst_certificate: yup
    .mixed()
    .required("GST Certificate is required")
    .test("fileType", "Only PDF, JPG, or PNG files are allowed", (value) =>
      value && value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type)
    )
    .test("fileSize", "File size must be less than 5MB", (value) =>
      value && value[0] && value[0].size <= 5 * 1024 * 1024
    ),
  business_license: yup
    .mixed()
    .required("Business License is required")
    .test("fileType", "Only PDF, JPG, or PNG files are allowed", (value) =>
      value && value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type)
    )
    .test("fileSize", "File size must be less than 5MB", (value) =>
      value && value[0] && value[0].size <= 5 * 1024 * 1024
    ),
  pan_card: yup
    .mixed()
    .required("PAN Card is required")
    .test("fileType", "Only PDF, JPG, or PNG files are allowed", (value) =>
      value && value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type)
    )
    .test("fileSize", "File size must be less than 5MB", (value) =>
      value && value[0] && value[0].size <= 5 * 1024 * 1024
    ),
  event_type: yup.string().optional(),
  event_history: yup
    .string()
    .max(1000, "Event history must be at most 1000 characters")
    .optional(),
  popup_value: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .optional(),
});

const VendorDetailsForm = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(vendorSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    validateOnBlur: true,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      business_name: "",
      business_type: "",
      gst_number: "",
      registration_number: "",
      year_of_establishment: "",
      contact_phone: "",
      address: "",
      country: "",
      gst_certificate: null,
      business_license: null,
      pan_card: null,
      event_type: "",
      event_history: "",
      popup_value: "",
    },
  });

  const email = watch("email");

  // Debug form errors only
  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  // Reset OTP verification if email changes
  useEffect(() => {
    if (email !== verifiedEmail) {
      setSuccess(false);
      setVerifiedEmail("");
    }
  }, [email, verifiedEmail]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSendOtp = async (email) => {
    try {
      await sendOtp(email);
      setDialogOpen(true);
      setSnackbar({ open: true, message: "OTP sent to your email", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to send OTP", severity: "error" });
    }
  };

  const handleVerifyOtp = async () => {
    const otp = getValues("popup_value");
    const email = getValues("email");
    try {
      await verifyOtp(email, otp);
      setSuccess(true);
      setVerifiedEmail(email);
      setDialogOpen(false);
      setSnackbar({ open: true, message: "OTP verified successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Invalid OTP", severity: "error" });
    }
  };

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    console.log("Form errors:", errors);
    if (!success || verifiedEmail !== data.email) {
      setSnackbar({
        open: true,
        message: "Please verify OTP for the current email",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (value && key !== "popup_value") {
        formData.append(key, value);
      }
    });

    try {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      await vendorSignup(formData);
      setSnackbar({
        open: true,
        message: "Details submitted successfully! Awaiting super admin approval.",
        severity: "success",
      });
      navigate("/login");
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to submit vendor details. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box className="vendorParent" display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box width="35%" height="90vh" className="signupLeftSide" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Box mb={4}>
          <img src={GMT_Logo_white} alt="GMT Logo" style={{ width: "40%", margin: "0 auto" }} />
        </Box>
        <div
          id="qoutescarouselIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
          style={{ width: "80%", textAlign: "center" }}
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#qoutescarouselIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#qoutescarouselIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#qoutescarouselIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner text-center text-white-50 pb-5">
            <div className="carousel-item active">
              <p className="fs-15 fst-italic">
                "Great Minds discuss ideas; Average minds discuss events; Small minds discuss people."
              </p>
            </div>
            <div className="carousel-item">
              <p className="fs-15 fst-italic">
                "The only way to do great work is to love what you do."
              </p>
            </div>
            <div className="carousel-item">
              <p className="fs-15 fst-italic">
                "Great! Clean code, clean design, easy for customization. Thanks very much!"
              </p>
            </div>
          </div>
        </div>
      </Box>
      <Box width="35%" boxShadow={3} p={4} className="vendorRightside" maxHeight="90vh" overflow="auto">
        <Typography variant="h5" textAlign="center" mb={2}>
          Vendor Signup
        </Typography>
        <Container maxWidth="md">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Business Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Controller
              name="business_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Business Name *"
                  fullWidth
                  margin="normal"
                  error={!!errors.business_name}
                  helperText={errors.business_name?.message}
                  aria-required="true"
                  aria-describedby={errors.business_name ? "business-name-error" : undefined}
                  InputProps={{
                    id: "business-name",
                    "aria-describedby": errors.business_name ? "business-name-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("business_name");
                  }}
                />
              )}
            />
            <FormControl fullWidth margin="normal" error={!!errors.business_type}>
              <InputLabel id="business-type-label">Business Type *</InputLabel>
              <Controller
                name="business_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="business-type-label"
                    label="Business Type *"
                    aria-required="true"
                    aria-describedby={errors.business_type ? "business-type-error" : undefined}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("business_type");
                    }}
                  >
                    <MenuItem value="eventOrganizer">Event Organizer</MenuItem>
                    <MenuItem value="internshipProvider">Internship Provider</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText id="business-type-error">{errors.business_type?.message}</FormHelperText>
            </FormControl>
            <Controller
              name="gst_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="GST Number *"
                  fullWidth
                  margin="normal"
                  error={!!errors.gst_number}
                  helperText={errors.gst_number?.message}
                  aria-required="true"
                  aria-describedby={errors.gst_number ? "gst-number-error" : undefined}
                  InputProps={{
                    id: "gst-number",
                    "aria-describedby": errors.gst_number ? "gst-number-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("gst_number");
                  }}
                />
              )}
            />
            <Controller
              name="registration_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Registration Number / License Number *"
                  fullWidth
                  margin="normal"
                  error={!!errors.registration_number}
                  helperText={errors.registration_number?.message}
                  aria-required="true"
                  aria-describedby={errors.registration_number ? "registration-number-error" : undefined}
                  InputProps={{
                    id: "registration-number",
                    "aria-describedby": errors.registration_number ? "registration-number-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("registration_number");
                  }}
                />
              )}
            />
            <Controller
              name="year_of_establishment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Year of Establishment *"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.year_of_establishment}
                  helperText={errors.year_of_establishment?.message}
                  aria-required="true"
                  aria-describedby={errors.year_of_establishment ? "year-of-establishment-error" : undefined}
                  InputProps={{
                    id: "year-of-establishment",
                    "aria-describedby": errors.year_of_establishment ? "year-of-establishment-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("year_of_establishment");
                  }}
                />
              )}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Contact Person
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username *"
                  fullWidth
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  aria-required="true"
                  aria-describedby={errors.username ? "username-error" : undefined}
                  InputProps={{
                    id: "username",
                    "aria-describedby": errors.username ? "username-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("username");
                  }}
                />
              )}
            />
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name *"
                  fullWidth
                  margin="normal"
                  error={!!errors.firstname}
                  helperText={errors.firstname?.message}
                  aria-required="true"
                  aria-describedby={errors.firstname ? "firstname-error" : undefined}
                  InputProps={{
                    id: "firstname",
                    "aria-describedby": errors.firstname ? "firstname-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("firstname");
                  }}
                />
              )}
            />
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name *"
                  fullWidth
                  margin="normal"
                  error={!!errors.lastname}
                  helperText={errors.lastname?.message}
                  aria-required="true"
                  aria-describedby={errors.lastname ? "lastname-error" : undefined}
                  InputProps={{
                    id: "lastname",
                    "aria-describedby": errors.lastname ? "lastname-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("lastname");
                  }}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address *"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={
                    errors.email?.message ||
                    (success && verifiedEmail === email ? "Email verified" : "Please verify your email by requesting an OTP")
                  }
                  aria-required="true"
                  aria-describedby={errors.email ? "email-error" : "email-help"}
                  InputProps={{
                    id: "email",
                    "aria-describedby": errors.email ? "email-error" : "email-help",
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("email");
                  }}
                />
              )}
            />
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              margin="normal"
              onClick={() => {
                const email = getValues("email");
                if (!email || errors.email) {
                  setSnackbar({ open: true, message: "Enter a valid email before requesting OTP", severity: "warning" });
                } else {
                  handleSendOtp(email);
                }
              }}
            >
              Send OTP
            </Button>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  aria-required="true"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  InputProps={{
                    id: "password",
                    "aria-describedby": errors.password ? "password-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("password");
                  }}
                />
              )}
            />
            <Controller
              name="contact_phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number *"
                  fullWidth
                  margin="normal"
                  error={!!errors.contact_phone}
                  helperText={errors.contact_phone?.message}
                  aria-required="true"
                  aria-describedby={errors.contact_phone ? "contact-phone-error" : undefined}
                  InputProps={{
                    id: "contact-phone",
                    "aria-describedby": errors.contact_phone ? "contact-phone-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("contact_phone");
                  }}
                />
              )}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Location
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address *"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  aria-required="true"
                  aria-describedby={errors.address ? "address-error" : undefined}
                  InputProps={{
                    id: "address",
                    "aria-describedby": errors.address ? "address-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("address");
                  }}
                />
              )}
            />
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Country *"
                  fullWidth
                  margin="normal"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  aria-required="true"
                  aria-describedby={errors.country ? "country-error" : undefined}
                  InputProps={{
                    id: "country",
                    "aria-describedby": errors.country ? "country-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("country");
                  }}
                />
              )}
            />

          

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Events/Programs
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl fullWidth margin="normal" error={!!errors.event_type}>
              <InputLabel id="event-type-label">Type of Events/Internships Offered</InputLabel>
              <Controller
                name="event_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="event-type-label"
                    label="Type of Events/Internships Offered"
                    aria-describedby={errors.event_type ? "event-type-error" : undefined}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("event_type");
                    }}
                  >
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="seminar">Seminar</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText id="event-type-error">{errors.event_type?.message || "(Optional)"}</FormHelperText>
            </FormControl>
            <Controller
              name="event_history"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event History"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!errors.event_history}
                  helperText={errors.event_history?.message || "(Optional)"}
                  aria-describedby={errors.event_history ? "event-history-error" : undefined}
                  InputProps={{
                    id: "event-history",
                    "aria-describedby": errors.event_history ? "event-history-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("event_history");
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !success || verifiedEmail !== email}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Container>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Enter the 6-digit OTP sent to your email</DialogTitle>
          <DialogContent>
            <Controller
              name="popup_value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ex: 689465"
                  fullWidth
                  margin="normal"
                  error={!!errors.popup_value}
                  helperText={errors.popup_value?.message}
                  inputProps={{ maxLength: 6 }}
                  aria-required="true"
                  aria-describedby={errors.popup_value ? "otp-error" : undefined}
                  InputProps={{
                    id: "popup-value",
                    "aria-describedby": errors.popup_value ? "otp-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("popup_value");
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleSendOtp(getValues("email"))} color="secondary" variant="outlined">
              Resend
            </Button>
            <Button onClick={handleVerifyOtp} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default VendorDetailsForm;