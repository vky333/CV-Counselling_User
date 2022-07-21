import { Col, Container, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { useState } from '@hookstate/core';

import styles from './CarouselAuthWrapper.module.css';
import store from '../../../../utils/store';
import Login from '../Auth/Login';
import Register from '../Auth/Register';

const CarouselAuthWrapper = () => {

    const globalStore = useState(store);

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="auth-carousel '+className+'"></span>'
        }
    };

    const videos = [
        {
            id: 0,
            url: "https://www.youtube.com/embed/FjhbTx_8CEI"
        },
        {
            id: 1,
            url: "https://www.youtube.com/embed/rA6P6CQBn_g"
        },
        {
            id: 2,
            url: "https://www.youtube.com/embed/cOvPOEwGOZc"
        },
    ];

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.main_bg}>
                <Container>
                    <Row className={`align-items-center justify-content-around`}>
                        <Col lg="5">
                            <div>
                                <div>
                                    <div className={styles.landing_text}>Quickly search the best insurance product for your customers and sell online.</div>
                                    <p className={styles.landing_text_caption}>Zero investment required</p>
                                </div>
                            </div>
                            <div className={styles.swiper_container}>
                                <Swiper pagination={pagination} modules={[Pagination]}>
                                    {videos.map(video =>
                                        <SwiperSlide key={video.id} style={{paddingBottom: "45px"}}>
                                            <iframe style={{borderRadius: "10px"}} width="100%" height="300px" src={video.url} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </SwiperSlide>
                                    )}
                                </Swiper>
                            </div>
                        </Col>
                        <Col lg="5">
                            <div className={styles.authForm}>
                                {globalStore.authType.get() ?
                                <Login />
                                :
                                <Register />
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default CarouselAuthWrapper;