import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MenuItem from "@mui/material/MenuItem";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import GMT_Logo_white from "../../assets/Logo_WHITE.png";
import { useNavigate } from "react-router-dom";
import { trainerSignup, sendOtp, verifyOtp } from "../../services/authApi";
import "./trainerSubmitForm.css";

// Yup schema with simplified validations
const trainerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .matches(
      /^[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/,
      "Username must be 8-12 characters including letters, numbers, or symbols"
    ),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  first_name: yup
    .string()
    .required("First Name is required")
    .matches(/^[A-Za-z\s]+$/, "First name must contain only letters and spaces")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  last_name: yup
    .string()
    .required("Last Name is required")
    .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  date_of_birth: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of birth cannot be in the future")
    .nullable(),
  gender: yup.string().required("Gender is required"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?\d{10,12}$/, "Phone number must be 10-12 digits, optionally starting with +"),
  highest_qualification: yup
    .string()
    .required("Highest qualification is required")
    .min(2, "Qualification must be at least 2 characters")
    .max(100, "Qualification must be at most 100 characters"),
  specialization: yup
    .string()
    .required("Specialization is required")
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must be at most 100 characters"),
  total_experience_years: yup
    .number()
    .typeError("Experience must be a number")
    .required("Total experience is required")
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  current_organization: yup
    .string()
    .max(100, "Organization name must be at most 100 characters")
    .optional(),
  previous_teaching_experience: yup
    .string()
    .required("Previous teaching experience is required")
    .min(10, "Experience description must be at least 10 characters")
    .max(500, "Experience description must be at most 500 characters"),
  certifications: yup
    .string()
    .max(500, "Certifications must be at most 500 characters")
    .optional(),
  available_days: yup
    .string()
    .required("Available days are required")
    .min(5, "Available days must be at least 5 characters")
    .max(100, "Available days must be at most 100 characters"),
  resume: yup
    .mixed()
    .required("Resume is required")
    .test("fileType", "Resume must be a PDF", (value) => value && value[0] && value[0].type === "application/pdf")
    .test("fileSize", "Resume must be less than 5MB", (value) => value && value[0] && value[0].size <= 5 * 1024 * 1024),
  idProof: yup
    .mixed()
    .required("ID proof is required")
    .test("fileType", "ID proof must be PDF, JPG, or PNG", (value) =>
      value && value[0] && ["application/pdf", "image/jpeg", "image/png"].includes(value[0].type)
    )
    .test("fileSize", "ID proof must be less than 5MB", (value) => value && value[0] && value[0].size <= 5 * 1024 * 1024),
  educationalCertificates: yup
    .mixed()
    .required("Educational certificates are required")
    .test("fileType", "Certificates must be PDF, JPG, or PNG", (value) =>
      value && value[0] && Array.from(value).every((file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type))
    )
    .test("fileSize", "Each certificate must be less than 5MB", (value) =>
      value && value[0] && Array.from(value).every((file) => file.size <= 5 * 1024 * 1024)
    ),
  profilePicture: yup
    .mixed()
    .optional()
    .test("fileType", "Profile picture must be JPG or PNG", (value) =>
      !value || !value[0] || ["image/jpeg", "image/png"].includes(value[0].type)
    )
    .test("fileSize", "Profile picture must be less than 2MB", (value) =>
      !value || !value[0] || value[0].size <= 2 * 1024 * 1024
    ),
  popup_value: yup.string().matches(/^\d{6}$/, "OTP must be 6 digits").optional(),
});

const TrainerDetailsForm = () => {
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(trainerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    validateOnBlur: true,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      phone_number: "",
      highest_qualification: "",
      specialization: "",
      total_experience_years: "",
      current_organization: "",
      previous_teaching_experience: "",
      certifications: "",
      available_days: "",
      resume: null,
      idProof: null,
      educationalCertificates: null,
      profilePicture: null,
      popup_value: "",
    },
  });

  const email = watch("email");
  const profilePicture = watch("profilePicture");

  // Reset OTP verification if email changes
  useEffect(() => {
    if (email !== verifiedEmail) {
      setSuccess(false);
      setVerifiedEmail("");
    }
  }, [email, verifiedEmail]);

  // Update profile picture preview
  useEffect(() => {
    if (profilePicture && profilePicture.length > 0) {
      const file = profilePicture[0];
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

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
    if (!/^\d{6}$/.test(otp)) {
      setSnackbar({ open: true, message: "OTP must be 6 digits", severity: "error" });
      return;
    }
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
    if (!success || verifiedEmail !== data.email) {
      setSnackbar({ open: true, message: "Please verify OTP for the current email", severity: "warning" });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
      } else if (key === "date_of_birth" && value) {
        const d = new Date(value);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          formData.append(key, `${yyyy}-${mm}-${dd}`);
        }
      } else if (value !== undefined && value !== null && key !== "popup_value" && key !== "confirmPassword") {
        formData.append(key, value);
      }
    });

    try {
      await trainerSignup(formData);
      setSnackbar({ open: true, message: "Details submitted successfully! Awaiting super admin approval.", severity: "success" });
      navigate("/login");
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to submit details. Please try again.", severity: "error" });
    }
  };

  return (
    <Box display="flex" className="trainerParent" justifyContent="center" alignItems="center" height="100vh">
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
      <Box width="35%" className="trainerRightside" boxShadow={3} p={4} maxHeight="90vh" overflow="auto">
        <Typography variant="h5" textAlign="center" mb={2}>
          Trainer Signup
        </Typography>
        <Container maxWidth="md">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6">Account Info</Typography>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username *"
                  fullWidth
                  margin="normal"
                  type="text"
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
                  key="username"
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
                  type="email"
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
                  key="email"
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
                  fullWidth
                  margin="normal"
                  type="password"
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
                  key="password"
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password *"
                  fullWidth
                  margin="normal"
                  type="password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  aria-required="true"
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  InputProps={{
                    id: "confirmPassword",
                    "aria-describedby": errors.confirmPassword ? "confirmPassword-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("confirmPassword");
                  }}
                  key="confirmPassword"
                />
              )}
            />

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Typography variant="h6">Personal Info</Typography>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name *"
                  fullWidth
                  margin="normal"
                  type="text"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  aria-required="true"
                  aria-describedby={errors.first_name ? "first-name-error" : undefined}
                  InputProps={{
                    id: "first-name",
                    "aria-describedby": errors.first_name ? "first-name-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("first_name");
                  }}
                  key="first_name"
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name *"
                  fullWidth
                  margin="normal"
                  type="text"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  aria-required="true"
                  aria-describedby={errors.last_name ? "last-name-error" : undefined}
                  InputProps={{
                    id: "last-name",
                    "aria-describedby": errors.last_name ? "last-name-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("last_name");
                  }}
                  key="last_name"
                />
              )}
            />
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date of Birth *"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date_of_birth}
                  helperText={errors.date_of_birth?.message}
                  aria-required="true"
                  aria-describedby={errors.date_of_birth ? "date-of-birth-error" : undefined}
                  InputProps={{
                    id: "date-of-birth",
                    "aria-describedby": errors.date_of_birth ? "date-of-birth-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("date_of_birth");
                  }}
                  key="date_of_birth"
                />
              )}
            />
            <FormControl fullWidth margin="normal" error={!!errors.gender}>
              <InputLabel id="gender-label">Gender *</InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="gender-label"
                    label="Gender *"
                    aria-required="true"
                    aria-describedby={errors.gender ? "gender-error" : undefined}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger("gender");
                    }}
                    key="gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText id="gender-error">{errors.gender?.message}</FormHelperText>
            </FormControl>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number *"
                  fullWidth
                  margin="normal"
                  type="text"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  aria-required="true"
                  aria-describedby={errors.phone_number ? "phone-number-error" : undefined}
                  InputProps={{
                    id: "phone-number",
                    "aria-describedby": errors.phone_number ? "phone-number-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("phone_number");
                  }}
                  key="phone_number"
                />
              )}
            />

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Typography variant="h6">Professional Info</Typography>
            <Controller
              name="highest_qualification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Highest Qualification *"
                  fullWidth
                  margin="normal"
                  type="text"
                  error={!!errors.highest_qualification}
                  helperText={errors.highest_qualification?.message}
                  aria-required="true"
                  aria-describedby={errors.highest_qualification ? "highest-qualification-error" : undefined}
                  InputProps={{
                    id: "highest-qualification",
                    "aria-describedby": errors.highest_qualification ? "highest-qualification-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("highest_qualification");
                  }}
                  key="highest_qualification"
                />
              )}
            />
            <Controller
              name="specialization"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Specialization *"
                  fullWidth
                  margin="normal"
                  type="text"
                  error={!!errors.specialization}
                  helperText={errors.specialization?.message}
                  aria-required="true"
                  aria-describedby={errors.specialization ? "specialization-error" : undefined}
                  InputProps={{
                    id: "specialization",
                    "aria-describedby": errors.specialization ? "specialization-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("specialization");
                  }}
                  key="specialization"
                />
              )}
            />
            <Controller
              name="total_experience_years"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total Experience (Years) *"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!errors.total_experience_years}
                  helperText={errors.total_experience_years?.message}
                  aria-required="true"
                  aria-describedby={errors.total_experience_years ? "total-experience-years-error" : undefined}
                  InputProps={{
                    id: "total-experience-years",
                    "aria-describedby": errors.total_experience_years ? "total-experience-years-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("total_experience_years");
                  }}
                  key="total_experience_years"
                />
              )}
            />
            <Controller
              name="current_organization"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Organization"
                  fullWidth
                  margin="normal"
                  type="text"
                  error={!!errors.current_organization}
                  helperText={errors.current_organization?.message}
                  aria-describedby={errors.current_organization ? "current-organization-error" : undefined}
                  InputProps={{
                    id: "current-organization",
                    "aria-describedby": errors.current_organization ? "current-organization-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("current_organization");
                  }}
                  key="current_organization"
                />
              )}
            />
            <Controller
              name="previous_teaching_experience"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Previous Teaching Experience *"
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  error={!!errors.previous_teaching_experience}
                  helperText={errors.previous_teaching_experience?.message}
                  aria-required="true"
                  aria-describedby={errors.previous_teaching_experience ? "previous-teaching-experience-error" : undefined}
                  InputProps={{
                    id: "previous-teaching-experience",
                    "aria-describedby": errors.previous_teaching_experience ? "previous-teaching-experience-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("previous_teaching_experience");
                  }}
                  key="previous_teaching_experience"
                />
              )}
            />
            <Controller
              name="certifications"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Certifications"
                  multiline
                  rows={2}
                  fullWidth
                  margin="normal"
                  error={!!errors.certifications}
                  helperText={errors.certifications?.message}
                  aria-describedby={errors.certifications ? "certifications-error" : undefined}
                  InputProps={{
                    id: "certifications",
                    "aria-describedby": errors.certifications ? "certifications-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("certifications");
                  }}
                  key="certifications"
                />
              )}
            />

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Typography variant="h6">Documents Upload</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>Resume (PDF) *</Typography>
                <Controller
                  name="resume"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          trigger("resume");
                        }}
                        style={{ marginBottom: 8 }}
                        aria-required="true"
                        id="resume"
                        aria-describedby={errors.resume ? "resume-error" : undefined}
                        key="resume"
                      />
                      <FormHelperText id="resume-error" error={!!errors.resume}>
                        {errors.resume?.message}
                      </FormHelperText>
                    </>
                  )}
                />
                <Typography>ID Proof *</Typography>
                <Controller
                  name="idProof"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          trigger("idProof");
                        }}
                        style={{ marginBottom: 8 }}
                        aria-required="true"
                        id="idProof"
                        aria-describedby={errors.idProof ? "idProof-error" : undefined}
                        key="idProof"
                      />
                      <FormHelperText id="idProof-error" error={!!errors.idProof}>
                        {errors.idProof?.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Educational Certificates *</Typography>
                <Controller
                  name="educationalCertificates"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        multiple
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          trigger("educationalCertificates");
                        }}
                        style={{ marginBottom: 8 }}
                        aria-required="true"
                        id="educationalCertificates"
                        aria-describedby={errors.educationalCertificates ? "educationalCertificates-error" : undefined}
                        key="educationalCertificates"
                      />
                      <FormHelperText id="educationalCertificates-error" error={!!errors.educationalCertificates}>
                        {errors.educationalCertificates?.message}
                      </FormHelperText>
                    </>
                  )}
                />
                <Typography>Profile Picture</Typography>
                <Controller
                  name="profilePicture"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        accept=".jpg,.png"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          trigger("profilePicture");
                        }}
                        style={{ marginBottom: 8 }}
                        id="profilePicture"
                        aria-describedby={errors.profilePicture ? "profilePicture-error" : undefined}
                        key="profilePicture"
                      />
                      <FormHelperText id="profilePicture-error" error={!!errors.profilePicture}>
                        {errors.profilePicture?.message}
                      </FormHelperText>
                    </>
                  )}
                />
                {profilePreview && (
                  <Box mt={1} mb={2}>
                    <img
                      src={profilePreview}
                      alt="Profile Preview"
                      style={{ maxWidth: "150px", borderRadius: "8px" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Typography variant="h6">Availability</Typography>
            <Controller
              name="available_days"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Available Days *"
                  placeholder="e.g. Monday, Wednesday, Friday"
                  fullWidth
                  margin="normal"
                  error={!!errors.available_days}
                  helperText={errors.available_days?.message}
                  aria-required="true"
                  aria-describedby={errors.available_days ? "available-days-error" : undefined}
                  InputProps={{
                    id: "available-days",
                    "aria-describedby": errors.available_days ? "available-days-error" : undefined,
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("available_days");
                  }}
                  key="available_days"
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              margin="normal"
              disabled={isSubmitting || !success || verifiedEmail !== email}
            >
              Submit
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
                  key="popup_value"
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

export default TrainerDetailsForm;