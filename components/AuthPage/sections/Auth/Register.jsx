import { Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';

import styles from '../CarouselAuthWrapper/CarouselAuthWrapper.module.css';

const Register = () => {

    const [showPass, setShowPass] = useState(false);

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full Name is required'),
        countryCode: Yup.string().required('Country code is required'),
        phoneNumber: Yup.number().typeError("Invalid phone number").required("Mobile Number is required"),
        password: Yup.string().required('Password is required'),
        gender: Yup.string().required('Gender is required'),
        country: Yup.number().required('Country is required')
    });

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const handlePass = () => {
        setShowPass(!showPass);
    }

    const countryCodeOptions = [
        {
            value: "+91",
            label: "+91 (IND)"
        }
    ]

    const genderOptions = [
        {
            value: 'male',
            label: 'Male'
        },
        {
            value: 'female',
            label: 'Female'
        },
        {
            value: 'other',
            label: 'Other'
        }
    ];

    const countryOptions = [
        {
            value: 101,
            label: "India"
        }
    ];

    const onSubmit = (values) => {
        console.log(values);
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formHeader}>
                Sign Up!
            </div>
            <div className={styles.formHeaderCaption}>
                Use your mobile number for registration
            </div>
            <Row className='mt-3'>
                <Col>
                    <Form.Label>Full Name</Form.Label>
                    <FormControl {...register("fullName")} isInvalid={!!errors.fullName?.message} placeholder='Full Name' />
                    <Form.Control.Feedback type="invalid">
                        {errors.fullName?.message}
                    </Form.Control.Feedback>
                    <div style={{marginTop: "10px"}} />
                    <Form.Label>Mobile Number</Form.Label>
                    <Row>
                        <Col xs="4">
                            <Controller defaultValue={countryCodeOptions[0].value} name={"countryCode"} control={control} render={({ field: { onChange, value, name, ref }}) => (
                                <Select name={name} inputRef={ref} value={countryCodeOptions.find((c) => c.value === value)} options={countryCodeOptions} className='f-14' onChange={(selectedOption) => {
                                    onChange(selectedOption.value)
                                }} />
                            )} />
                            <Form.Control.Feedback type="invalid">
                                {errors.countryCode?.message}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xs="8">
                            <FormControl {...register("phoneNumber")} isInvalid={!!errors.phoneNumber?.message} placeholder='Mobile Number' />
                            <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber?.message}
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                    <div style={{marginTop: "10px"}} />
                    <Form.Label>Create Password</Form.Label>
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
                    <Row>
                        <Col xs="6">
                            <Form.Label>Gender</Form.Label>
                            <Controller defaultValue={genderOptions[0].value} name={"gender"} control={control} render={({ field: { onChange, value, name, ref }}) => (
                                <Select name={name} inputRef={ref} value={genderOptions.find((c) => c.value === value)} options={genderOptions} className='f-14' onChange={(selectedOption) => {
                                    onChange(selectedOption.value)
                                }} />
                            )} />
                            <Form.Control.Feedback type="invalid">
                                {errors.gender?.message}
                            </Form.Control.Feedback>
                        </Col>
                        <Col xs="6">
                            <Form.Label>Country</Form.Label>
                            <Controller defaultValue={countryOptions[0].value} name={"country"} control={control} render={({ field: { onChange, value, name, ref }}) => (
                                <Select name={name} inputRef={ref} options={countryOptions} value={countryOptions.find((c) => c.value === value)} className='f-14' onChange={(selectedOption) => {
                                    onChange(selectedOption.value)
                                }} />
                            )} />
                            <Form.Control.Feedback type="invalid">
                                {errors.country?.message}
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                    <div style={{marginTop: "10px"}} />
                    <div style={{fontSize: "10px", paddingTop: "8px"}}>
                        <p>By signing up, I agree to <Link href="/"><a style={{color: "#14bef0", textDecoration: "none"}}>terms</a></Link></p>
                    </div>
                    <div style={{marginTop: "10px"}} id="recaptcha-container"></div>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col>
                    <Button type='submit' className='cv-btn-primary w-100'>Send OTP</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default Register;