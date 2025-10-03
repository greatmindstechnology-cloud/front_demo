import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
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
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendOtp, verifyOtp, studentSignup } from "../services/authApi";
import "./Signup.css";
import GMT_Logo_white from "../assets/Logo_WHITE.png";

// Yup schema with corrected validations
const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .matches(
      /^[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/,
      "Username must be 8-12 characters including letters, numbers, or symbols"
    ),
  firstname: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z\s]+$/, "First name must contain only letters and spaces")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastname: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
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
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  gender: yup.string().required("Gender is required"),
  countryCode: yup.string().required("Country code is required"),
  contact_number: yup
    .string()
    .required("Contact number is required")
    .matches(/^\d{10,12}$/, "Contact number must be 10-12 digits"),
  father_name: yup
    .string()
    .matches(/^[A-Za-z\s]+$|^$/, "Father's name must contain only letters and spaces or be empty")
    .max(50, "Father's name must be at most 50 characters"),
  mother_name: yup
    .string()
    .matches(/^[A-Za-z\s]+$|^$/, "Mother's name must contain only letters and spaces or be empty")
    .max(50, "Mother's name must be at most 50 characters"),
  door_number: yup
    .string()
    .required("House number is required")
    .min(1, "House number must be at least 1 character")
    .max(50, "House number must be at most 50 characters"),
  street_name: yup
    .string()
    .required("Street name is required")
    .min(3, "Street name must be at least 3 characters")
    .max(100, "Street name must be at most 100 characters"),
  city: yup
    .string()
    .required("City is required")
    .min(3, "City must be at least 3 characters")
    .max(100, "City must be at most 100 characters"),
  state: yup
    .string()
    .required("State is required")
    .min(3, "State must be at least 3 characters")
    .max(100, "State must be at most 100 characters"),
  country: yup
    .string()
    .required("Country is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  date_of_birth: yup
    .date()
    .nullable()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  institution_name: yup
    .string()
    .required("Institution name is required")
    .min(3, "Institution name must be at least 3 characters")
    .max(100, "Institution name must be at most 100 characters"),
  location: yup
    .string()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must be at most 100 characters"),
  passedout: yup
    .number()
    .typeError("Passed out year must be a valid number")
    .required("Passed out year is required")
    .min(1900, "Passed out year must be after 1900")
    .max(new Date().getFullYear(), `Passed out year cannot be later than ${new Date().getFullYear()}`)
    .transform((value, originalValue) => (originalValue === "" ? null : Number(value))),
  popup_value: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
  role: yup.string().default("student"),
});

// Sample country codes and country/city data
const countryCodes = [
  { code: "+1", label: "+1 (USA)" },
  { code: "+91", label: "+91 (India)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+81", label: "+81 (Japan)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+33", label: "+33 (France)" },
  { code: "+86", label: "+86 (China)" },
  { code: "+7", label: "+7 (Russia)" },
  { code: "+55", label: "+55 (Brazil)" },
  { code: "+27", label: "+27 (South Africa)" },
  { code: "+34", label: "+34 (Spain)" },
  { code: "+39", label: "+39 (Italy)" },
  { code: "+64", label: "+64 (New Zealand)" },
  { code: "+52", label: "+52 (Mexico)" },
  { code: "+62", label: "+62 (Indonesia)" },
  { code: "+82", label: "+82 (South Korea)" },
  { code: "+47", label: "+47 (Norway)" },
  { code: "+46", label: "+46 (Sweden)" },
  { code: "+31", label: "+31 (Netherlands)" },
  { code: "+41", label: "+41 (Switzerland)" },
  { code: "+48", label: "+48 (Poland)" },
  { code: "+32", label: "+32 (Belgium)" },
  { code: "+45", label: "+45 (Denmark)" },
  { code: "+420", label: "+420 (Czech Republic)" },
  { code: "+351", label: "+351 (Portugal)" },
  { code: "+90", label: "+90 (Turkey)" },
  { code: "+20", label: "+20 (Egypt)" },
  { code: "+971", label: "+971 (United Arab Emirates)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+94", label: "+94 (Sri Lanka)" },
  { code: "+880", label: "+880 (Bangladesh)" },
  { code: "+92", label: "+92 (Pakistan)" },
  { code: "+54", label: "+54 (Argentina)" },
  { code: "+56", label: "+56 (Chile)" },
  { code: "+593", label: "+593 (Ecuador)" },
  { code: "+51", label: "+51 (Peru)" },
  { code: "+58", label: "+58 (Venezuela)" },
  { code: "+63", label: "+63 (Philippines)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+66", label: "+66 (Thailand)" },
  { code: "+60", label: "+60 (Malaysia)" },
];

const countryCityData = {
  USA: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco"],
  India: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
  UK: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Leeds"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart"],
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Hiroshima", "Fukuoka"],
  China: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Chengdu", "Wuhan"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Curitiba"],
  SouthAfrica: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
  Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Florence"],
  Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Nizhny Novgorod"],
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Cancún"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah"],
  SouthKorea: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Bilbao"],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Adana", "Gaziantep"],
};

const Signup = () => {
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    validateOnBlur: true,
    defaultValues: {
      role: "student",
      countryCode: "+91",
      country: "",
      city: "",
      passedout: "", // Initialize as empty string to avoid undefined
    },
  });

  const email = watch("email");
  const country = watch("country");
  const passedout = watch("passedout");

  // Debug form errors and passedout value
  useEffect(() => {
    console.log("Form errors:", errors);
    console.log("Passed out value:", passedout);
  }, [errors, passedout]);

  // Reset OTP verification if email changes
  useEffect(() => {
    if (email && verifiedEmail && email.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
      setSuccess(false);
      setVerifiedEmail("");
    }
  }, [email, verifiedEmail]);

  // Update city dropdown when country changes
  useEffect(() => {
    setValue("city", "");
  }, [country, setValue]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSendOtp = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Sending OTP to:", normalizedEmail);
    try {
      await sendOtp(normalizedEmail);
      setDialogOpen(true);
      setSnackbar({ open: true, message: "OTP sent to your email", severity: "success" });
    } catch (error) {
      console.error("Send OTP error:", error);
      setSnackbar({ open: true, message: "Failed to send OTP", severity: "error" });
    }
  };

  const handleVerifyOtp = async () => {
    const otp = getValues("popup_value");
    const email = getValues("email").trim().toLowerCase();
    console.log("Verifying OTP:", otp, "for email:", email);
    try {
      await verifyOtp(email, otp);
      setSuccess(true);
      setVerifiedEmail(email);
      setDialogOpen(false);
      setSnackbar({ open: true, message: "OTP verified successfully", severity: "success" });
    } catch (error) {
      console.error("OTP verification error:", error);
      setSnackbar({ open: true, message: "Invalid OTP", severity: "error" });
    }
  };

  const prepareDataForSubmit = (data) => {
    const formattedData = { ...data };
    if (formattedData.date_of_birth) {
      const d = new Date(formattedData.date_of_birth);
      if (!isNaN(d)) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        formattedData.date_of_birth = `${yyyy}-${mm}-${dd}`;
      } else {
        delete formattedData.date_of_birth;
      }
    }
    formattedData.contact_number = `${formattedData.countryCode}${formattedData.contact_number}`;
    if (formattedData.alt_contact) {
      formattedData.alt_contact = `${formattedData.countryCode}${formattedData.alt_contact}`;
    }
    // Ensure passedout is a number
    formattedData.passedout = Number(formattedData.passedout);
    return formattedData;
  };

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    console.log("Form errors:", errors);
    if (!success || verifiedEmail.toLowerCase() !== data.email.trim().toLowerCase()) {
      setSnackbar({
        open: true,
        message: "Please verify OTP for the current email",
        severity: "warning",
      });
      console.log("Verified Mail:", verifiedEmail, "Data Email:", data.email);
      return;
    }
    try {
      const formattedData = prepareDataForSubmit(data);
      console.log("Formatted data for signup:", formattedData);
      await studentSignup(formattedData);
      setSnackbar({ open: true, message: "Signup successful!", severity: "success" });
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      setSnackbar({ open: true, message: `Signup failed: ${error.message}`, severity: "error" });
    }
  };

  return (
    <Box display="flex" className="studentParent" justifyContent="center" alignItems="center" height="100vh">
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
      <Box width="35%" className="studentRightside" boxShadow={3} p={4} maxHeight="90vh" overflow="auto">
        <Typography variant="h5" textAlign="center" mb={2}>
          Student Signup
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Username *"
            fullWidth
            margin="normal"
            type="text"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            aria-required="true"
            aria-describedby={errors.username ? "username-error" : undefined}
            InputProps={{
              id: "username",
              "aria-describedby": errors.username ? "username-error" : undefined,
            }}
          />
          <TextField
            label="First Name *"
            fullWidth
            margin="normal"
            type="text"
            {...register("firstname")}
            error={!!errors.firstname}
            helperText={errors.firstname?.message}
            aria-required="true"
            aria-describedby={errors.firstname ? "firstname-error" : undefined}
            InputProps={{
              id: "firstname",
              "aria-describedby": errors.firstname ? "firstname-error" : undefined,
            }}
          />
          <TextField
            label="Last Name *"
            fullWidth
            margin="normal"
            type="text"
            {...register("lastname")}
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
            aria-required="true"
            aria-describedby={errors.lastname ? "lastname-error" : undefined}
            InputProps={{
              id: "lastname",
              "aria-describedby": errors.lastname ? "lastname-error" : undefined,
            }}
          />
          <TextField
            label="Email *"
            fullWidth
            margin="normal"
            type="text"
            {...register("email")}
            error={!!errors.email}
            helperText={
              errors.email?.message ||
              (success && verifiedEmail.toLowerCase() === email?.trim().toLowerCase()
                ? "Email verified"
                : "Please verify your email by requesting an OTP")
            }
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : "email-help"}
            InputProps={{
              id: "email",
              "aria-describedby": errors.email ? "email-error" : "email-help",
              readOnly: success && verifiedEmail.toLowerCase() === email?.trim().toLowerCase(),
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => {
              const email = getValues("email");
              if (!email || errors.email) {
                setSnackbar({ open: true, message: "Enter a valid email before requesting OTP", severity: "warning" });
              } else {
                handleSendOtp(email);
              }
            }}
            disabled={success && verifiedEmail.toLowerCase() === email?.trim().toLowerCase()}
          >
            Send OTP
          </Button>
          <TextField
            label="Password *"
            fullWidth
            margin="normal"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            aria-required="true"
            aria-describedby={errors.password ? "password-error" : undefined}
            InputProps={{
              id: "password",
              "aria-describedby": errors.password ? "password-error" : undefined,
            }}
          />
          <TextField
            label="Confirm Password *"
            fullWidth
            margin="normal"
            type="password"
            {...register("confirmpassword")}
            error={!!errors.confirmpassword}
            helperText={errors.confirmpassword?.message}
            aria-required="true"
            aria-describedby={errors.confirmpassword ? "confirmpassword-error" : undefined}
            InputProps={{
              id: "confirmpassword",
              "aria-describedby": errors.confirmpassword ? "confirmpassword-error" : undefined,
            }}
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
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              )}
            />
            <FormHelperText id="gender-error">{errors.gender?.message}</FormHelperText>
          </FormControl>
          <Controller
            name="date_of_birth"
            control={control}
            render={({ field }) => (
              <TextField
                label="Date Of Birth *"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
                aria-required="true"
                aria-describedby={errors.date_of_birth ? "date-of-birth-error" : undefined}
                InputProps={{
                  id: "date-of-birth",
                  "aria-describedby": errors.date_of_birth ? "date-of-birth-error" : undefined,
                }}
              />
            )}
          />
          <Box display="flex" gap={2}>
            <FormControl fullWidth margin="normal" error={!!errors.countryCode}>
              <InputLabel id="country-code-label">Country Code *</InputLabel>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="country-code-label"
                    label="Country Code *"
                    aria-required="true"
                    aria-describedby={errors.countryCode ? "country-code-error" : undefined}
                  >
                    {countryCodes.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText id="country-code-error">{errors.countryCode?.message}</FormHelperText>
            </FormControl>
            <TextField
              label="Contact Number *"
              fullWidth
              margin="normal"
              type="text"
              {...register("contact_number")}
              error={!!errors.contact_number}
              helperText={errors.contact_number?.message}
              aria-required="true"
              aria-describedby={errors.contact_number ? "contact-number-error" : undefined}
              InputProps={{
                id: "contact-number",
                "aria-describedby": errors.contact_number ? "contact-number-error" : undefined,
              }}
            />
          </Box>
          <TextField
            label="Alternate Contact"
            fullWidth
            margin="normal"
            type="text"
            {...register("alt_contact")}
            error={!!errors.alt_contact}
            helperText={errors.alt_contact?.message}
            aria-describedby={errors.alt_contact ? "alt-contact-error" : undefined}
            InputProps={{
              id: "alt-contact",
              "aria-describedby": errors.alt_contact ? "alt-contact-error" : undefined,
            }}
          />
          <TextField
            label="Father's Name"
            fullWidth
            margin="normal"
            type="text"
            {...register("father_name")}
            error={!!errors.father_name}
            helperText={errors.father_name?.message}
            aria-describedby={errors.father_name ? "father-name-error" : undefined}
            InputProps={{
              id: "father-name",
              "aria-describedby": errors.father_name ? "father-name-error" : undefined,
            }}
          />
          <TextField
            label="Mother's Name"
            fullWidth
            margin="normal"
            type="text"
            {...register("mother_name")}
            error={!!errors.mother_name}
            helperText={errors.mother_name?.message}
            aria-describedby={errors.mother_name ? "mother-name-error" : undefined}
            InputProps={{
              id: "mother-name",
              "aria-describedby": errors.mother_name ? "mother-name-error" : undefined,
            }}
          />
          <TextField
            label="House Number *"
            fullWidth
            margin="normal"
            type="text"
            {...register("door_number")}
            error={!!errors.door_number}
            helperText={errors.door_number?.message}
            aria-required="true"
            aria-describedby={errors.door_number ? "house-no-error" : undefined}
            InputProps={{
              id: "door-number",
              "aria-describedby": errors.door_number ? "house-no-error" : undefined,
            }}
          />
          <TextField
            label="Street Name *"
            fullWidth
            margin="normal"
            type="text"
            {...register("street_name")}
            error={!!errors.street_name}
            helperText={errors.street_name?.message}
            aria-required="true"
            aria-describedby={errors.street_name ? "street-name-error" : undefined}
            InputProps={{
              id: "street-name",
              "aria-describedby": errors.street_name ? "street-name-error" : undefined,
            }}
          />
          <FormControl fullWidth margin="normal" error={!!errors.country}>
            <InputLabel id="country-label">Country *</InputLabel>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="country-label"
                  label="Country *"
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedCountry(e.target.value);
                  }}
                  aria-required="true"
                  aria-describedby={errors.country ? "country-error" : undefined}
                >
                  {Object.keys(countryCityData).map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText id="country-error">{errors.country?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal" error={!!errors.city}>
            <InputLabel id="city-label">City *</InputLabel>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="city-label"
                  label="City *"
                  aria-required="true"
                  disabled={!selectedCountry}
                  aria-describedby={errors.city ? "city-error" : undefined}
                >
                  {selectedCountry &&
                    countryCityData[selectedCountry]?.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
            <FormHelperText id="city-error">{errors.city?.message}</FormHelperText>
          </FormControl>
          <TextField
            label="State *"
            fullWidth
            margin="normal"
            type="text"
            {...register("state")}
            error={!!errors.state}
            helperText={errors.state?.message}
            aria-required="true"
            aria-describedby={errors.state ? "state-error" : undefined}
            InputProps={{
              id: "state",
              "aria-describedby": errors.state ? "state-error" : undefined,
            }}
          />
          <TextField
            label="Pincode *"
            fullWidth
            margin="normal"
            type="text"
            {...register("pincode")}
            error={!!errors.pincode}
            helperText={errors.pincode?.message}
            aria-required="true"
            aria-describedby={errors.pincode ? "pincode-error" : undefined}
            InputProps={{
              id: "pincode",
              "aria-describedby": errors.pincode ? "pincode-error" : undefined,
            }}
          />
          <TextField
            label="Institution Name *"
            fullWidth
            margin="normal"
            type="text"
            {...register("institution_name")}
            error={!!errors.institution_name}
            helperText={errors.institution_name?.message}
            aria-required="true"
            aria-describedby={errors.institution_name ? "institution-name-error" : undefined}
            InputProps={{
              id: "institution-name",
              "aria-describedby": errors.institution_name ? "institution-name-error" : undefined,
            }}
          />
          <TextField
            label="Location *"
            fullWidth
            margin="normal"
            type="text"
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message}
            aria-required="true"
            aria-describedby={errors.location ? "location-error" : undefined}
            InputProps={{
              id: "location",
              "aria-describedby": errors.location ? "location-error" : undefined,
            }}
          />
          <TextField
            label="Passed Out Year *"
            fullWidth
            margin="normal"
            type="number"
            {...register("passedout", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            error={!!errors.passedout}
            helperText={errors.passedout?.message}
            aria-required="true"
            aria-describedby={errors.passedout ? "passedout-error" : undefined}
            InputProps={{
              id: "passedout",
              "aria-describedby": errors.passedout ? "passedout-error" : undefined,
              inputProps: {
                min: 1900,
                max: new Date().getFullYear(),
                step: 1,
              },
            }}
          />
          <input type="hidden" {...register("role")} value="student" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting || !success || verifiedEmail.toLowerCase() !== email?.trim().toLowerCase()}
          >
            Signup
          </Button>
        </form>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Enter the 6-digit OTP sent to your email</DialogTitle>
          <DialogContent>
            <Controller
              name="popup_value"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Ex: 689465"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={!!errors.popup_value}
                  helperText={errors.popup_value?.message}
                  inputProps={{ maxLength: 6 }}
                  aria-required="true"
                  aria-describedby={errors.popup_value ? "otp-error" : undefined}
                  InputProps={{
                    id: "popup-value",
                    "aria-describedby": errors.popup_value ? "otp-error" : undefined,
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

export default Signup;