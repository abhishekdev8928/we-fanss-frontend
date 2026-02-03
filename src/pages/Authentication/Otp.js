import React from "react";
import { Row, Col, Input, Button, Alert, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import { verifyOtp, resendOtp } from "../../api/authApi";
import { useAuthStore, useLoginEmail } from "../../config/store/authStore";

import logodark from "../../assets/images/diigii.webp";
import logolight from "../../assets/images/diigii.webp";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const loginEmail = useLoginEmail();

  // Redirect if no loginEmail (direct access without login)
  React.useEffect(() => {
    if (!loginEmail) {
      toast.warning("Please login first");
      navigate("/auth/login", { replace: true });
    }
  }, [loginEmail, navigate]);

  const verifyOtpSchema = z.object({
    otp: z
      .string()
      .min(6, "Code must be at least 6 characters")
      .max(8, "Code must be less than 8 characters")
      .trim(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!loginEmail) {
      toast.error("Email not found. Please login again.");
      navigate("/auth/login", { replace: true });
      return;
    }

    try {
      const data = await verifyOtp(loginEmail, values.otp);

      toast.success(data.message || "Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrors({ otp: error });
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async (setFieldValue, setSubmitting) => {
    if (!loginEmail) {
      toast.error("Email not found. Please login again.");
      navigate("/auth/login", { replace: true });
      return;
    }

    setSubmitting(true);
    try {
      const data = await resendOtp(loginEmail);
      toast.success(data.message || "New OTP sent successfully!");
      // Clear OTP field on successful resend
      setFieldValue("otp", "");
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    useAuthStore.getState().clearLoginFlow();
    navigate("/auth/login", { replace: true });
  };

  // Show nothing if no email (while redirecting)
  if (!loginEmail) {
    return null;
  }

  return (
    <Col lg={4}>
      <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
        <div className="w-100">
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="text-center">
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToLogin();
                  }}
                >
                  <img
                    src={logodark}
                    height="35"
                    className="auth-logo logo-dark mx-auto"
                    alt="dark"
                  />
                  <img
                    src={logolight}
                    height="35"
                    className="auth-logo logo-light mx-auto"
                    alt="light"
                  />
                </Link>
                <h4 className="font-size-18 mt-4">OTP Verification</h4>
                <p className="text-muted">
                  Enter the 6-digit code sent to <strong>{loginEmail}</strong>
                </p>
              </div>

              <Formik
                initialValues={{ otp: "" }}
                validationSchema={toFormikValidationSchema(verifyOtpSchema)}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  setSubmitting,
                }) => (
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <Alert color="info" className="mb-4 text-center">
                      <i className="ri-information-line me-2"></i>
                      You can use either <strong>Email OTP</strong> or{" "}
                      <strong>Google Authenticator</strong>
                    </Alert>

                    <div className="auth-form-group-custom mb-4">
                      <i className="ri-shield-keyhole-line auti-custom-input-icon"></i>
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        type="text"
                        name="otp"
                        placeholder="Enter 6-digit code"
                        maxLength={8}
                        onChange={(e) => {
                          // Allow only alphanumeric, auto-uppercase
                          const onlyAlphaNum = e.target.value
                            .replace(/[^A-Z0-9]/gi, "")
                            .toUpperCase();
                          handleChange({
                            target: { name: "otp", value: onlyAlphaNum },
                          });
                        }}
                        onBlur={handleBlur}
                        value={values.otp}
                        disabled={isSubmitting}
                        autoFocus
                      />
                      {touched.otp && errors.otp && (
                        <small className="text-danger">{errors.otp}</small>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <Button
                        color="primary"
                        className="w-full"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Verifying..." : "Verify Code"}
                      </Button>
                    </div>

                    <div className="mt-3 text-center">
                      <Button
                        color="link"
                        className="text-muted p-0"
                        onClick={() =>
                          handleResendOtp(setFieldValue, setSubmitting)
                        }
                        type="button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Didn't receive the code?{" "}
                            <strong>Resend OTP</strong>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>

              <div className="mt-5 text-center">
                <p>
                  <Button
                    color="link"
                    className="fw-medium text-primary p-0"
                    onClick={handleBackToLogin}
                  >
                    <i className="ri-arrow-left-line me-1"></i> Back to Login
                  </Button>
                </p>
                <p>
                  © {new Date().getFullYear()}{" "}
                  <a href="#" target="_blank" rel="noreferrer">
                    We Fanss
                  </a>
                  .
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default VerifyOtpPage;