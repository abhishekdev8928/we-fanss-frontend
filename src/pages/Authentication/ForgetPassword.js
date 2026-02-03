import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Alert,
  Button,
  Container,
  Label,
  Input,
  Form,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logodark from "../../assets/images/diigii.webp";

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.body.classList.add("auth-body-bg");
    return () => {
      document.body.classList.remove("auth-body-bg");
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );

      // ✅ Always show success message (security best practice)
      setEmailSent(true);
    } catch (error) {
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
                    <Link to="/" className="logo">
                      <img src={logodark} height="35" alt="logo" />
                    </Link>
                  </div>

                  {/* ✅ SUCCESS STATE */}
                  {emailSent ? (
                    <div className="text-center mt-5">
                      <Alert color="success">
                        <h5 className="mb-3">Check your email</h5>
                        <p>
                          If an account exists with this email, a password reset
                          link has been sent.
                        </p>
                        <p>
                          Please check your inbox and follow the instructions.
                        </p>
                        <p className="mb-0">
                          Didn’t receive the email? Check your spam folder or
                          try again.
                        </p>
                      </Alert>

                      <Link to="/login">
                        <Button color="primary" className="mt-3">
                          Back to Login
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* 🔐 FORM */}
                      <div className="text-center mt-4">
                        <h4 className="font-size-18">Reset Password</h4>
                        <p className="text-muted">
                          Enter your email to get reset link.
                        </p>
                      </div>

                      <div className="p-2 mt-4">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                          <div className="auth-form-group-custom mb-4">
  <i className="ri-mail-line auti-custom-input-icon"></i>
  <Label>Email</Label>

  <Controller
    name="email"
    control={control}
    rules={{
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    }}
    render={({ field }) => (
      <Input
        {...field}
        type="email"
        placeholder="Enter your email"
        invalid={!!errors.email}
      />
    )}
  />

  {errors.email && (
    <small className="text-danger">
      {errors.email.message}
    </small>
  )}
</div>


                          <div className="text-center">
                            <Button
                              color="primary"
                              className="w-100"
                              type="submit"
                            >
                              Send Reset Link
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        
  );
};

export default ForgotPasswordPage;
