import React from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Alert,
  Container,
  Label,
} from "reactstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";

import logodark from "../../assets/images/diigii.webp";
import logolight from "../../assets/images/diigii.webp";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ READ TOKEN

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token, // ✅ backend expects this
            newPassword: values.newPassword, // ✅ backend expects this
          }),
        }
      );

      const res_data = await response.json();

      if (response.ok && res_data.success) {
        toast.success("Password reset successfully!");
        navigate("/auth/login");
      } else {
        setErrors({ submit: res_data.message || "Failed to reset password" });
      }
    } catch (error) {
      setErrors({ submit: "Server error. Please try again later." });
    }

    setSubmitting(false);
  };

  

  return (
   
        <Col lg={4}>
          <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
            <div className="w-100">
              <Row className="justify-content-center">
                <Col lg={9}>
                  <div className="text-center">
                    <Link to="/">
                      <img src={logodark} height="35" alt="logo" />
                    </Link>
                    <h4 className="font-size-18 mt-4">Reset Password</h4>
                    <p className="text-muted">Enter your new password.</p>
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
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <Label>New Password</Label>
                          <Input
                            type="password"
                            name="newPassword"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.newPassword}
                          />
                          {touched.newPassword && errors.newPassword && (
                            <small className="text-danger">
                              {errors.newPassword}
                            </small>
                          )}
                        </div>

                        <div className="mb-4">
                          <Label>Confirm Password</Label>
                          <Input
                            type="password"
                            name="confirmPassword"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                          />
                          {touched.confirmPassword &&
                            errors.confirmPassword && (
                              <small className="text-danger">
                                {errors.confirmPassword}
                              </small>
                            )}
                        </div>

                        <Button
                          color="primary"
                          className="w-100"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Reset Password
                        </Button>

                        {errors.submit && (
                          <div className="mt-2 text-danger text-center">
                            {errors.submit}
                          </div>
                        )}
                      </form>
                    )}
                  </Formik>

                  <div className="mt-4 text-center">
                    <Link to="/login">Back to Login</Link>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        
  );
};

export default ResetPasswordPage;
