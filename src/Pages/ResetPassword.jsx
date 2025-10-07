import React from 'react';
import logo from '../assets/Gmt_Logo_new.png';
import GMT_Logo_white from '../assets/Logo_WHITE.png';
import "./Login.css";

const ResetPassword = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      const res = await fetch("http://localhost:5000/api/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Reset link sent to your email!");
      } else {
        alert(`❌ Error: ${data.message || "Failed to send reset link."}`);
      }
    } catch (error) {
      console.error("Error sending reset request:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="Login_leftSide">
        <div className="auth-one-bg p-lg- p-4 w-100 h-100" style={{width : '100px', height : '20  '}}>
        </div>
      </div>


\      <div className="auth-page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center mt-sm-5 mb-4 text-white-50"></div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card mt-4">
                <div className="card-body p-4">
                  <div className="text-center mt-2">
                    <img src={logo} alt="Logo" height="60px" style={{ zIndex: 0 }} />
                    <hr />
                    <h5 className="text-primary">Forgot Password?</h5>
                    <p className="text-muted">Reset password with Velzon</p>
                  </div>

                  <div className="alert border-0 alert-warning text-center mb-2 mx-2" role="alert">
                    Enter your email and instructions will be sent to you!
                  </div>

                  <div className="p-2">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter Email"
                          required
                        />
                      </div>
                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">
                          Send Reset Link
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Wait, I remember my password...
                  <a
                    href="auth-signin-basic.html"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Click here{" "}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <p className="mb-0 text-muted">
                  &copy; {new Date().getFullYear()} Velzon. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger"></i> by Themesbrand
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ResetPassword;
