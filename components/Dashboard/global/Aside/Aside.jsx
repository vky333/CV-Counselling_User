import { Menu, MenuItem, ProSidebar, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import Image from 'next/image';
import { BiLike, BiFoodMenu, BiPieChart } from 'react-icons/bi';
import { BsCalendar2Minus, BsChatLeftText, BsGear } from 'react-icons/bs';
import { CgLogOff } from 'react-icons/cg';
import Link from 'next/link';
import { useState } from '@hookstate/core';

import styles from './Aside.module.css';
import store from '../../../../utils/store';
import { removeUserAuth } from '../../../../utils/auth';

const Aside = (props) => {

    const globalStore = useState(store);

    const handleMouseEnter = () => {
        props.handleCollapse(false);
    }

    const handleMouseLeave = () => {
        props.handleCollapse(true);
    }

    return (
        <ProSidebar className={styles.sidebar_main} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} image={false} rtl={false} collapsed={props.collapsed} breakPoint="md" toggled={props.toggled} onToggle={props.handleToggle}>
            <SidebarHeader className={styles.sidebar_header}>
                <div className='d-flex align-items-center'>
                    <Link href="/dashboard">
                        <a>
                            <Image src="/images/logo.png" width={110} height={59} />
                        </a>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <Menu iconShape="circle">
                    <MenuItem className={globalStore.activeSidebarItem.get() === "calendar" ? 'active' : ''} icon={<BsCalendar2Minus fontSize={18} />} suffix={<span className={styles.badge_red}>3</span>}>
                        <Link href="/dashboard/calendar">
                            <a className={styles.sidebar_item}>
                                Calendar
                            </a>
                        </Link>
                    </MenuItem>
                    <MenuItem className={globalStore.activeSidebarItem.get() === "consultations" ? 'active' : ''} icon={<BsChatLeftText fontSize={20} />}>
                        <Link href="/dashboard/consultations">
                            <a className={styles.sidebar_item}>
                                My Consultations
                            </a>
                        </Link>
                    </MenuItem>
                    <MenuItem className={globalStore.activeSidebarItem.get() === "affiliations" ? 'active' : ''} icon={<BiFoodMenu fontSize={20} />}>
                        <Link href="/dashboard/affiliations">
                            <a className={styles.sidebar_item}>
                                Affiliations
                            </a>
                        </Link>
                    </MenuItem>
                    <MenuItem className={globalStore.activeSidebarItem.get() === "feedbacks" ? 'active' : ''} icon={<BiLike fontSize={20} />}>
                        <Link href="/dashboard/feedbacks">
                            <a className={styles.sidebar_item}>
                                Feedbacks
                            </a>
                        </Link>
                    </MenuItem>
                    <hr />
                    <MenuItem className={globalStore.activeSidebarItem.get() === "reports" ? 'active' : ''} icon={<BiPieChart fontSize={20} />}>
                        <Link href="/dashboard/reports">
                            <a className={styles.sidebar_item}>
                                Reports
                            </a>
                        </Link>
                    </MenuItem>
                    <MenuItem className={globalStore.activeSidebarItem.get() === "settings" ? 'active' : ''} icon={<BsGear fontSize={20} />}>
                        <Link href="/dashboard/settings">
                            <a className={styles.sidebar_item}>
                                Settings
                            </a>
                        </Link>
                    </MenuItem>
                </Menu>
            </SidebarContent>
            <SidebarFooter>
                <Menu>
                    <MenuItem icon={<CgLogOff fontSize={24} />}>
                        <Link href="/" passHref>
                            <a className={styles.sidebar_item} onClick={(e) => removeUserAuth(e)}>
                                Logout
                            </a>
                        </Link>
                    </MenuItem>
                </Menu>
            </SidebarFooter>
        </ProSidebar>
    )
}

export default Aside;