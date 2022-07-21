import { Children, useState } from 'react';

import Aside from '../global/Aside/Aside';
import Header from '../global/Header/Header';
import styles from './DashboardWrapper.module.css';

const DashboardWrapper = ({children}) => {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [sidebarToggled, setSidebarToggled] = useState(false);

    return (
        <div>
            <Aside collapsed={sidebarCollapsed} handleCollapse={setSidebarCollapsed} toggled={sidebarToggled} handleToggle={setSidebarToggled} />
            <Header handleToggle={setSidebarToggled} />
            <div className={styles.main_wrapper}>
                <div className={styles.secondary_wrapper}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardWrapper;