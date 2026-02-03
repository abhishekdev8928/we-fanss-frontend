import { Row, Col, Input, Button, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import logodark from "../../assets/images/diigii.webp";
import logolight from "../../assets/images/diigii.webp";

const LoginForm = () => {
  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email("Invalid email format").trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const data = await login(values.email, values.password);

     
      toast.success(data.message || "OTP sent to your email!");

      
      navigate("/auth/verify-otp", { replace: true });
    } catch (error) {
      
      setErrors({ submit: error });
      toast.error(error);
    } finally {
      setSubmitting(false);
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
                <h4 className="font-size-18 mt-4">Welcome Back!</h4>
                <p className="text-muted">Sign in to continue to We Fanss.</p>
              </div>

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={toFormikValidationSchema(loginSchema)}
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
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="auth-form-group-custom mb-4">
                      <i className="ri-user-2-line auti-custom-input-icon"></i>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        disabled={isSubmitting}
                      />
                      {touched.email && errors.email && (
                        <small className="text-danger">{errors.email}</small>
                      )}
                    </div>

                    <div className="auth-form-group-custom mb-4">
                      <i className="ri-lock-2-line auti-custom-input-icon"></i>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        disabled={isSubmitting}
                      />
                      {touched.password && errors.password && (
                        <small className="text-danger">{errors.password}</small>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <Button
                        color="primary"
                        className="w-full"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging in..." : "Log In"}
                      </Button>
                    </div>

                    {errors.submit && (
                      <div
                        className="mt-3 alert alert-danger text-center"
                        role="alert"
                      >
                        {errors.submit}
                      </div>
                    )}

                    <div className="mt-4 text-center">
                      <Link to="/auth/forgot-password" className="text-muted">
                        <i className="mdi mdi-lock me-1"></i> Forgot your
                        password?
                      </Link>
                    </div>
                  </form>
                )}
              </Formik>

              <div className="mt-5 text-center">
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

export default LoginForm;