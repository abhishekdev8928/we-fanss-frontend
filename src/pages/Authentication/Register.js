import React, { useEffect } from "react";
import { Row, Col, Button, Alert, Container, Label, Input, FormGroup } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


import logodark from "../../assets/images/diigii.webp";

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    });

   

    const onSubmit = (data) => {
       
        console.log(data);
        
    };

    return (
        
                    <Col lg={4}>
                        <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                            <div className="w-100">
                                <Row className="justify-content-center">
                                    <Col lg={9}>
                                        <div>
                                            <div className="text-center">
                                                <div>
                                                    <Link to="#" className="logo">
                                                        <img src={logodark} height="35" alt="logo" />
                                                    </Link>
                                                </div>
                                                <h4 className="font-size-18 mt-4">Register account</h4>
                                            </div>

                                            <div className="p-2 mt-5">
                                                <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
                                                    <FormGroup className="auth-form-group-custom mb-4">
                                                        <i className="ri-mail-line auti-custom-input-icon"></i>
                                                        <Label htmlFor="useremail">Email</Label>
                                                        <Input
                                                            type="email"
                                                            id="useremail"
                                                            {...register("email", { 
                                                                required: "Email is required", 
                                                                pattern: {
                                                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                                    message: "Invalid email format"
                                                                }
                                                            })}
                                                            placeholder="Enter email"
                                                        />
                                                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                    </FormGroup>

                                                    <FormGroup className="auth-form-group-custom mb-4">
                                                        <i className="ri-user-2-line auti-custom-input-icon"></i>
                                                        <Label htmlFor="username">Username</Label>
                                                        <Input
                                                            type="text"
                                                            id="username"
                                                            {...register("username", { required: "Username is required" })}
                                                            placeholder="Enter username"
                                                        />
                                                        {errors.username && <span className="text-danger">{errors.username.message}</span>}
                                                    </FormGroup>

                                                    <FormGroup className="auth-form-group-custom mb-4">
                                                        <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                        <Label htmlFor="userpassword">Password</Label>
                                                        <Input
                                                            type="password"
                                                            id="userpassword"
                                                            {...register("password", { required: "Password is required" })}
                                                            placeholder="Enter password"
                                                        />
                                                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                                    </FormGroup>

                                                    <div className="text-center">
                                                        <Button color="primary" className="w-md waves-effect waves-light" type="submit">
                                                            Register
                                                        </Button>
                                                    </div>

                                                    <div className="mt-4 text-center">
                                                        <p className="mb-0">By registering you agree to the DiigiiHost <Link to="#" className="text-primary">Terms of Use</Link></p>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="mt-5 text-center">
                                                <p>Already have an account ? <Link to="/login" className="fw-medium text-primary"> Login</Link> </p>
                                                <p>© {new Date().getFullYear()} <a href='https://www.digihost.in/' target='_blank' rel="noopener noreferrer">DiigiiHost</a> .</p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    
    );
}

export default Register;