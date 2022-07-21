import { Button, Col, Form, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../CarouselAuthWrapper/CarouselAuthWrapper.module.css';
import { login } from '../../../../pages/api/counsellor';
import { setUserAuth } from '../../../../utils/auth';

const Login = () => {

    const router = useRouter();

    const [showPass, setShowPass] = useState(false);
    const [isLogging, setLogging] = useState(false);

    const validationSchema = Yup.object({
        phoneNumber: Yup.number().typeError("Invalid phone number").required("Please enter your phone number"),
        password: Yup.string().required('Password is required')
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const handlePass = () => {
        setShowPass(!showPass);
    }

    const onSubmit = (values) => {
        setLogging(true);

        let formData = new FormData();
        formData.append('mobile', values.phoneNumber);
        formData.append('password', values.password);

        login(formData).then((response) => {
            
            setUserAuth(response.data.user, response.data.accessToken, response.data.refreshAccessToken);
            setLogging(false);

            if(router.query.redirect_url) {
                window.location.href = decodeURIComponent(router.query.redirect_url);
            }
            else {
                window.location.href = "/dashboard";
            }
        }).catch((error) => {
            
            setLogging(false);
            
            iziToast.error({
                title: "Login failed",
                message: error.response.data,
                timeout: "2000",
                position: "topRight"
            });
        });
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formHeader}>
                Login to your Account!
            </div>
            <div className={styles.formHeaderCaption}>
                If you have an account, sign in with your mobile number.
            </div>
            <Row className='mt-3'>
                <Col>
                    <Form.Label>Mobile Number</Form.Label>
                    <FormControl {...register("phoneNumber")} isInvalid={!!errors.phoneNumber?.message} placeholder='Mobile Number' />
                    <Form.Control.Feedback type="invalid">
                        {errors.phoneNumber?.message}
                    </Form.Control.Feedback>
                    <div style={{marginTop: "10px"}} />
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <FormControl {...register("password")} isInvalid={!!errors.password?.message} placeholder="Password" type={showPass ? 'text' : 'password'} />
                        <InputGroup.Text onClick={handlePass} style={{cursor: "pointer"}} className="password-group">
                            {showPass ?
                            <FaEyeSlash color="#7f7f7f" />
                            :
                            <FaEye color="#7f7f7f" />
                            }
                        </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                    <div style={{marginTop: "10px"}} />
                    <div className="d-flex align-items-center justify-content-between">
                        <Form.Check className="shadow-none" type="checkbox" label="Remember me" />
                        <div style={{color: "#14bef0", fontSize: "12px", marginTop: "3px", cursor: "pointer"}}>
                            Forgot Password
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col>
                    {isLogging ?
                    <Button className='cv-btn-primary w-100'><Spinner animation='border' size='sm' /></Button>
                    :
                    <Button type='submit' className='cv-btn-primary w-100'>Login</Button>
                    }
                </Col>
            </Row>
        </Form>
    )
}

export default Login;