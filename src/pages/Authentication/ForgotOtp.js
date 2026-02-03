import React from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Alert,
  Label,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";

import logodark from "../../assets/images/diigii.webp";
import logolight from "../../assets/images/diigii.webp";

const VerifyForgotOtpPage = () => {
  const navigate = useNavigate();

  const initialValues = { otp: "" };

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, "Enter a valid 6-digit OTP")
      .required("OTP is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const email = localStorage.getItem("forgotOtpEmail"); // ✅ use forgot OTP email
      if (!email) {
        toast.error("No email found. Please try again.");
        return navigate("/forgot-password");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-forgot-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: values.otp }),
        }
      );

      const res_data = await response.json();

      if (response.ok && res_data.success) {
        toast.success("OTP verified successfully!");
        // Redirect to reset password page
        navigate("/reset-password");
      } else {
        toast.error(res_data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Forgot OTP verification error:", error);
      toast.error("Server error. Please try again later.");
    }
    setSubmitting(false);
  };
const handleResendOtp = async () => {
  try {
    const email = localStorage.getItem("forgotOtpEmail");
    if (!email) {
      toast.error("No email found. Please try again.");
      return navigate("/forgot-password");
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/resend-forgot-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const res_data = await response.json();

    if (response.ok && res_data.success) {
      toast.success("New OTP has been sent successfully!");
    } else {
      toast.error(res_data.message || "Failed to resend OTP");
    }
  } catch (error) {
    console.error("Resend OTP Error:", error);
    toast.error("Server error. Please try again later.");
  }
};
  return (
    
        <Col lg={4}>
          <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
            <div className="w-100">
              <Row className="justify-content-center">
                <Col lg={9}>
                  <div className="text-center">
                    <Link to="/">
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
                      Enter the OTP sent for your password reset.
                    </p>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
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
                    }) => (
                      <form
                        className="form-horizontal"
                        onSubmit={handleSubmit}
                      >
                        <Alert color="info" className="mb-4 text-center">
                          Please enter the 6-digit OTP to reset your password.
                        </Alert>

                        <div className="auth-form-group-custom mb-4">
                          <i className="ri-lock-2-line auti-custom-input-icon"></i>
                          <Label htmlFor="otp">OTP</Label>
                          <Input
                            type="text"
                            name="otp"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            onChange={(e) => {
                              const onlyNums = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              ); // allow only numbers
                              handleChange({
                                target: {
                                  name: "otp",
                                  value: onlyNums,
                                },
                              });
                            }}
                            onBlur={handleBlur}
                            value={values.otp}
                          />
                          {touched.otp && errors.otp && (
                            <small className="text-danger">{errors.otp}</small>
                          )}
                        </div>

                        <div className="mt-4 text-center">
                          <Button
                            color="primary"
                            className="w-md"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            Verify OTP
                          </Button>
                        </div>

                        {/* ✅ Resend OTP Button */}
                        <div className="mt-3 text-center">
                          <Button
                            color="link"
                            className="text-muted p-0"
                            onClick={handleResendOtp}
                          >
                            Didn’t get the OTP? <strong>Resend</strong>
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>

                  <div className="mt-5 text-center">
                    <p>
                      <Link
                        to="/login"
                        className="fw-medium text-primary"
                      >
                        Back to Login
                      </Link>
                    </p>
                    <p>
                      © {new Date().getFullYear()}{" "}
                      <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                      >
                        We Fans  
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

export default VerifyForgotOtpPage;
