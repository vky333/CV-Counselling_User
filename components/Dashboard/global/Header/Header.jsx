import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';

import { getProfileDetails } from '../../../../pages/api/counsellor';
import { getUser, removeUserAuth } from '../../../../utils/auth';
import DropdownItem from './DropdownItem';
import styles from './Header.module.css';

const Header = (props) => {

    const [counsellor, setCounsellor] = useState({
        id: -1,
        name: "",
        mobile: "",
        profile_image: ""
    });

    useEffect(() => {
        getProfileDetails(getUser()).then((response) => {
            setCounsellor(response.data.description[0]);
        })
    }, []);

    return (
        <Navbar className={styles.main_wrapper} variant='light' expand='lg' fixed='top'>
            <Container fluid>
                <Nav className='me-auto'>
                    <Navbar.Toggle onClick={() => props.handleToggle(true)} aria-controls="responsive-navbar-nav" />
                </Nav>
                <Nav>
                    <NavDropdown className='last-dropdown' title={<div className='d-flex align-items-center'>
                        <Image src={counsellor.profile_image === "" ? "/images/profile.png" : counsellor.profile_image} className={styles.userImg} height={40} width={40} />
                        <FaChevronDown fontSize={10} style={{marginTop: "4px", marginLeft: "10px"}} /></div>}>
                            <div className={`${styles.profile_item} d-flex`}>
                                <div className={styles.user_name}>
                                    <Link href="/profile">
                                        <a className={styles.u_name} >{counsellor.name}</a>
                                    </Link>
                                    <div className={styles.number}>{counsellor.mobile}</div>
                                </div>
                            </div>
                            <DropdownItem title="Account Settings" href="/dashboard/settings" new={false} />
                            <DropdownItem title="Logout" href="/" clickHandler={(e) => removeUserAuth(e)} />
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header