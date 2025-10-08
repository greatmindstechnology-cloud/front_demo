import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Login.css";
import GitHubLoginButton from "../assets/js/GitHubLoginButton";
import { login } from "../services/authApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import GMT_Logo_white from "../assets/Logo_WHITE.png";
import { Card, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Regex for username validation
const usernameRegex = /^[a-zA-Z0-9]{3,}$/;

// Yup validation schema
const schema = yup.object({
  identifier: yup
    .string()
    .required("Username or email is required")
    .test(
      "username-or-email",
      "Must be a valid email or username",
      function (value) {
        const isEmail = yup.string().email().isValidSync(value);
        const isUsername = usernameRegex.test(value || "");
        return isEmail || isUsername;
      }
    ),
  password: yup.string().required("Password is required"),
});

const RECAPTCHA_SITE_KEY = "6LeleCErAAAAAIKPm-gCLCoip16yAw3TiWfnccU1";

const Login = () => {
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await axios.post(
        "https://backend-demo-esqk.onrender.com/api/google-login/",
        {
          token: token,
        }
      );
      console.log("Backend Login Success:", response.data);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      setLoading(true);
      const response = await login(data);

      console.log("Response:", response);
      console.log("Status:", response?.status);

      const loginStatus = response?.status?.trim().toLowerCase();
      if (loginStatus === "login success") {
        sessionStorage.setItem("token", "dummy_token_xyz");

        if (response) {
          sessionStorage.setItem("user", JSON.stringify(response));
        }

        if (response.email) {
          localStorage.setItem("userEmail", response.email);
          console.log("Stored email in localStorage:", response.email);
        }

        if (response.role) {
          localStorage.setItem("role", response.role);
          console.log("Stored role in localStorage:", response.role);
        }
        if (response.student_name) {
          localStorage.setItem("studentName", response.student_name);
          console.log("Stored student name in localStorage:", response.student_name);
        }
        if (response.id) {
          localStorage.setItem("vendorId", response.id);
          console.log("Stored vendor ID in localStorage:", response.id);
        }
        const role = response.role?.toLowerCase();
        if (role === "student") {
          navigate("/dashboard");
        } else if (role === "trainer") {
          navigate("/dashboard/trainer");
        } else if (role === "vendor") {
          navigate("/dashboard/vendor");
        } else if (role === "admin") {
          navigate("/dashboard/admin");
        } else if (role === "super_admin") {  
          navigate("/sdashboard/sadmin");
        } else {
          navigate("/login");
        }
      } else {
        const errorMessage = response?.error || "Ingutu Invalid credentials";
        alert(errorMessage);
        console.error("Login failed:", errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Invalid credentials";
      console.error("Login error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="Login_parent auth-page-wrapper d-flex flex-column min-vh-70 overflow-hidden">
      <div className="auth-page-content justify-content-center align-items-center m-5 pt-0">
          <Card elevation={8}>
            <div className="row">
              <div className="col-lg-12 col-xl-12">
                <div
                  className="card overflow-hidden"
                  style={{ border: "none" }}
                >
                  <div className="row m-8 " >
                    {/* Left side */}
                    <div className="col-lg-6 col-xl-6 Login_leftSide">
                      <div className="p-lg-5 p-xl-5 p-4 h-100 auth-one-bg">
                        <div className="bg-overlay"></div>
                        <div className="Login_left_icon">
                          <img
                            src={GMT_Logo_white}
                            alt=""
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="position-relative h-100 d-flex flex-column">
                          <div className="mt-auto">
                            <div className="mb-3">
                              <i className="ri-double-quotes-l display-4 text-success"></i>
                            </div>
                            <div
                              id="qoutescarouselIndicators"
                              className="carousel slide"
                              data-bs-ride="carousel"
                              data-bs-interval="4000"
                            >
                              <div className="carousel-indicators">
                                <button
                                  type="button"
                                  data-bs-target="#qoutescarouselIndicators"
                                  data-bs-slide-to="0"
                                  className="active"
                                ></button>
                                <button
                                  type="button"
                                  data-bs-target="#qoutescarouselIndicators"
                                  data-bs-slide-to="1"
                                ></button>  
                              </div>
                              <div className="carousel-inner text-center text-white-50 pb-5">
                                <div className="carousel-item active">
                                  <p className="fs-15 fst-italic">
                                    "Great Minds discuss ideas; Average minds
                                    discuss events; Small minds discuss people."
                                  </p>
                                </div>
                                
                                <div className="carousel-item">
                                  <p className="fs-15 fst-italic">
                                    " Great! Clean code, clean design, easy for
                                    customization. Thanks very much!"
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="col-lg-6 col-xl-6">
                      <div className="p-lg-5 p-xl-5 p-5">

                        <div className="mt-4">
                          <Container maxWidth="sm">
                        <div className="text-center mb-4">
                          <h3 className="text-primary">Welcome Back!</h3>
                          <p className="text-muted">
                            Sign in to continue to Great Minds.
                          </p>
                        </div>
                            <Box
                              component="form"
                              onSubmit={handleSubmit(onSubmit)}
                              sx={{
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "none",
                              }}
                            >
                              <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                                LOGIN
                              </Typography>

                              <TextField
                                label="Username or Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...register("identifier")}
                                error={!!errors.identifier}
                                helperText={errors.identifier?.message}
                              />

                              <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                              />

                              <Box mt={2} mb={2}>
                                <ReCAPTCHA
                                  sitekey={RECAPTCHA_SITE_KEY}
                                  onChange={(token) => setRecaptchaToken(token)}
                                />
                              </Box>

                              <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting || loading}
                              >
                                {isSubmitting || loading
                                  ? "Logging in..."
                                  : "Login"}
                              </Button>
                            </Box>
                          </Container>

                          <div className="flex flex-col mt-4 text-center gap-3">
                            <h5 className="fs-13 mb-4 title">Sign In with</h5>
                            <GoogleLogin 
                              className="basis-28"
                              onSuccess={handleLoginSuccess}
                              onError={() => console.log("Login Failed")}
                            />
                            <GitHubLoginButton className="basis-28 items-center"/>
                          </div>
                        </div>

                        <div className="mt-2 text-center">
                          <p className="mb-0">
                            Don't have an account?
                            <a
                              onClick={() => navigate("/Signup")}
                              className="fw-semibold text-primary text-decoration-underline"
                              style={{ cursor: "pointer" }}
                            >
                              {" "}
                              Signup
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
      </div>
    </div>
  );
};

export default Login;
