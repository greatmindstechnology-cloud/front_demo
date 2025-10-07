import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  FormHelperText,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function PersonalInformationForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      email: "",
      phone_number: "",
      role: "",
      highest_qualification: "",
      specialization: "",
      total_experience_years: "",
      current_organization: "",
      previous_teaching_experience: "",
      certifications: "",
      account_holder_name: "",
      bank_name: "",
      branch_name: "",
      bank_location: "",
      account_number: "",
      ifsc_code: "",
      available_days: "",
      available_mode: "",
      preferred_time_slots: "",
      status: "",
      login_id: "",
      door_number: "",
      street_name: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      resume: null,
      id_proof: null,
      educational_certificates: null,
    },
  });

  const [trainerEmail, setTrainerEmail] = useState("");
  const [image, setImage] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [fileLinks, setFileLinks] = useState({
    resume: "",
    id_proof: "",
    educational_certificates: "",
  });
  const inputRef = useRef();

  const formValues = watch();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    console.log("Trainer email from localStorage:", email);
    if (email) {
      setTrainerEmail(email);
    }
  }, []);

  useEffect(() => {
    if (trainerEmail) {
      fetch(`http://localhost:8000/admin_gmt/trainer/?email=${trainerEmail}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((response) => {
          console.log("Raw API response:", JSON.stringify(response, null, 2));
          const trainer = response.data;
          if (trainer) {
            let formattedDate = "";
            if (trainer.date_of_birth) {
              try {
                const date = new Date(trainer.date_of_birth);
                if (!isNaN(date.getTime())) {
                  formattedDate = date.toISOString().split("T")[0];
                } else {
                  console.warn("Invalid date format for date_of_birth:", trainer.date_of_birth);
                }
              } catch (error) {
                console.error("Error parsing date_of_birth:", error);
              }
            }
            const formData = {
              first_name: String(trainer.first_name || ""),
              last_name: String(trainer.last_name || ""),
              date_of_birth: formattedDate || "",
              gender: String(trainer.gender || ""),
              email: String(trainer.email || ""),
              phone_number: String(trainer.phone_number || ""),
              role: String(trainer.role || ""),
              highest_qualification: String(trainer.highest_qualification || ""),
              specialization: String(trainer.specialization || ""),
              total_experience_years: String(trainer.total_experience_years || ""),
              current_organization: String(trainer.current_organization || ""),
              previous_teaching_experience: String(trainer.previous_teaching_experience || ""),
              certifications: String(trainer.certifications || ""),
              account_holder_name: String(trainer.account_holder_name || ""),
              bank_name: String(trainer.bank_name || ""),
              branch_name: String(trainer.branch_name || ""),
              bank_location: String(trainer.bank_location || ""),
              account_number: String(trainer.account_number || ""),
              ifsc_code: String(trainer.ifsc_code || ""),
              available_days: String(trainer.available_days || ""),
              available_mode: String(trainer.available_mode || ""),
              preferred_time_slots: String(trainer.preferred_time_slots || ""),
              status: String(trainer.status || ""),
              login_id: String(trainer.id || ""),
              door_number: String(trainer.door_number || ""),
              street_name: String(trainer.street_Name || ""),
              landmark: String(trainer.landmark || ""),
              city: String(trainer.city || ""),
              state: String(trainer.state || ""),
              country: String(trainer.country || ""),
              pincode: String(trainer.pincode || ""),
              resume: null,
              id_proof: null,
              educational_certificates: null,
            };
            console.log("Data to reset form:", JSON.stringify(formData, null, 2));
            reset(formData);
            Object.entries(formData).forEach(([key, value]) => {
              setValue(key, value, { shouldValidate: true });
            });
            setFileLinks({
              resume: trainer.resume || "",
              id_proof: trainer.id_proof || "",
              educational_certificates: trainer.educational_certificates || "",
            });
            if (trainer.profile_picture) {
              setImage(trainer.profile_picture);
            }
            setFormKey((prev) => prev + 1);
            console.log("Trainer data fetched and reset:", trainer);
          } else {
            console.log("No trainer data found for email:", trainerEmail);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch trainer data:", err);
        });
    }
  }, [trainerEmail, reset, setValue]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  const handleFormSubmit = (data) => {
    console.log("Form Data:", JSON.stringify({ ...data, profile_image: image }, null, 2));
    alert("Form submitted successfully!");
  };

  useEffect(() => {
    console.log("Current form values:", JSON.stringify(formValues, null, 2));
  }, [formValues]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Personal Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={image}
              sx={{ width: 80, height: 80, mr: 2 }}
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={handleImageChange}
            />
            <IconButton color="primary" onClick={handleIconClick}>
              <PhotoCameraIcon />
            </IconButton>
          </Box>
          <Box component="form" key={formKey} onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name *"
                  fullWidth
                  {...register("first_name", {
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "First name must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name *"
                  fullWidth
                  {...register("last_name", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Last name must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth *"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("date_of_birth", {
                    required: "Date of birth is required",
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      return birthDate <= today || "Date of birth cannot be in the future";
                    },
                  })}
                  error={!!errors.date_of_birth}
                  helperText={errors.date_of_birth?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel id="gender-label">Gender *</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="gender-label"
                        label="Gender *"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email *"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number *"
                  fullWidth
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+\d{1,4}\d{6,14}$/,
                      message: "Phone number must be in the format +[country code][number]",
                    },
                  })}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role"
                  fullWidth
                  {...register("role")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Highest Qualification *"
                  fullWidth
                  {...register("highest_qualification", {
                    required: "Highest qualification is required",
                  })}
                  error={!!errors.highest_qualification}
                  helperText={errors.highest_qualification?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Specialization *"
                  fullWidth
                  {...register("specialization", {
                    required: "Specialization is required",
                  })}
                  error={!!errors.specialization}
                  helperText={errors.specialization?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Experience (Years) *"
                  fullWidth
                  type="number"
                  inputProps={{ step: "0.1" }}
                  {...register("total_experience_years", {
                    required: "Total experience is required",
                    validate: {
                      isNumber: (value) => !isNaN(value) || "Must be a valid number",
                      isNonNegative: (value) => parseFloat(value) >= 0 || "Experience cannot be negative",
                    },
                  })}
                  error={!!errors.total_experience_years}
                  helperText={errors.total_experience_years?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Organization"
                  fullWidth
                  {...register("current_organization")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Previous Teaching Experience"
                  fullWidth
                  {...register("previous_teaching_experience")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Certifications"
                  fullWidth
                  {...register("certifications")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Account Holder Name *"
                  fullWidth
                  {...register("account_holder_name", {
                    required: "Account holder name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Account holder name must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.account_holder_name}
                  helperText={errors.account_holder_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Name *"
                  fullWidth
                  {...register("bank_name", {
                    required: "Bank name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Bank name must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.bank_name}
                  helperText={errors.bank_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Branch Name *"
                  fullWidth
                  {...register("branch_name", {
                    required: "Branch name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Branch name must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.branch_name}
                  helperText={errors.branch_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Location *"
                  fullWidth
                  {...register("bank_location", {
                    required: "Bank location is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Bank location must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.bank_location}
                  helperText={errors.bank_location?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Account Number *"
                  fullWidth
                  {...register("account_number", {
                    required: "Account number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Account number must contain only digits",
                    },
                  })}
                  error={!!errors.account_number}
                  helperText={errors.account_number?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="IFSC Code *"
                  fullWidth
                  {...register("ifsc_code", {
                    required: "IFSC code is required",
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: "Invalid IFSC code format (e.g., SBIN0001234)",
                    },
                  })}
                  error={!!errors.ifsc_code}
                  helperText={errors.ifsc_code?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Available Days *"
                  fullWidth
                  {...register("available_days", {
                    required: "Available days are required",
                  })}
                  error={!!errors.available_days}
                  helperText={errors.available_days?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.available_mode}>
                  <InputLabel id="available-mode-label">Available Mode *</InputLabel>
                  <Controller
                    name="available_mode"
                    control={control}
                    rules={{ required: "Available mode is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="available-mode-label"
                        label="Available Mode *"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.available_mode && <FormHelperText>{errors.available_mode.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Preferred Time Slots *"
                  fullWidth
                  {...register("preferred_time_slots", {
                    required: "Preferred time slots are required",
                  })}
                  error={!!errors.preferred_time_slots}
                  helperText={errors.preferred_time_slots?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Door Number *"
                  fullWidth
                  {...register("door_number", {
                    required: "Door number is required",
                  })}
                  error={!!errors.door_number}
                  helperText={errors.door_number?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street Name *"
                  fullWidth
                  {...register("street_name", {
                    required: "Street name is required",
                    pattern: {
                      value: /^[A-Za-z0-9\s]+$/,
                      message: "Street name must contain only letters, numbers, and spaces",
                    },
                  })}
                  error={!!errors.street_name}
                  helperText={errors.street_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Landmark"
                  fullWidth
                  {...register("landmark")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City *"
                  fullWidth
                  {...register("city", {
                    required: "City is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "City must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State *"
                  fullWidth
                  {...register("state", {
                    required: "State is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "State must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country *"
                  fullWidth
                  {...register("country", {
                    required: "Country is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Country must contain only letters and spaces",
                    },
                  })}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pincode"
                  fullWidth
                  {...register("pincode", {
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Pincode must be 6 digits",
                    },
                  })}
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">Resume</Typography>
                  {fileLinks.resume ? (
                    <Link href={fileLinks.resume} target="_blank">
                      View Current Resume
                    </Link>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No resume uploaded
                    </Typography>
                  )}
                  <Controller
                    name="resume"
                    control={control}
                    render={({ field }) => (
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Upload New Resume
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      </Button>
                    )}
                  />
                  {errors.resume && <FormHelperText error>{errors.resume.message}</FormHelperText>}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">ID Proof</Typography>
                  {fileLinks.id_proof ? (
                    <Link href={fileLinks.id_proof} target="_blank">
                      View Current ID Proof
                    </Link>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No ID proof uploaded
                    </Typography>
                  )}
                  <Controller
                    name="id_proof"
                    control={control}
                    render={({ field }) => (
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Upload New ID Proof
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      </Button>
                    )}
                  />
                  {errors.id_proof && <FormHelperText error>{errors.id_proof.message}</FormHelperText>}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">Educational Certificates</Typography>
                  {fileLinks.educational_certificates ? (
                    <Link href={fileLinks.educational_certificates} target="_blank">
                      View Current Certificates
                    </Link>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No certificates uploaded
                    </Typography>
                  )}
                  <Controller
                    name="educational_certificates"
                    control={control}
                    render={({ field }) => (
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Upload New Certificates
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      </Button>
                    )}
                  />
                  {errors.educational_certificates && (
                    <FormHelperText error>{errors.educational_certificates.message}</FormHelperText>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}