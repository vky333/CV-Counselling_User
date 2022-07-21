import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { BsTelephone } from 'react-icons/bs';
import { useState } from '@hookstate/core';

import styles from './Header.module.css';
import store from '../../../../utils/store';

const Header = () => {

    const globalStore = useState(store);

    const changeAuthType = (e) => {
        globalStore.authType.set(!globalStore.authType.get());

        e.currentTarget.blur();
    }

    return (
        <Navbar className={styles.main_wrapper} variant='light' expand='lg' fixed='top'>
            <Container>
                <Navbar.Brand>
                    <Link href="/">
                        <a className='d-flex'>
                            <Image src="/images/logo.png" width={110} height={59} />
                            <span className={styles.com}>com</span>
                        </a>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Nav>
                    <div className={styles.round_solid_bg}>
                        <BsTelephone fontSize={20} color="#14bef1" />
                    </div>
                    <div className='ms-2'>
                        <Link href="tel:18002081155" passHref>
                            <a className={styles.toll_free_number}>
                                1800 208 1155
                            </a>
                        </Link>
                        <div className={styles.toll_free_timings}>
                            10 AM to 8 PM (Monday - Sunday)
                        </div>
                    </div>
                    <div className='ms-4'>
                        {globalStore.authType.get() ?
                        <Button onClick={(e) => changeAuthType(e)} variant='outline-primary' className='cv-btn-primary-outline'>REGISTER</Button>
                        :
                        <Button onClick={(e) => changeAuthType(e)} variant='outline-primary' className='cv-btn-primary-outline'>LOGIN</Button>
                        }
                    </div>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header;