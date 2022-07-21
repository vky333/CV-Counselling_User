import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { isAuthenticated } from '../../utils/auth';
import DashboardWrapper from '../../components/Dashboard/DashboardWrapper/DashboardWrapper';
import Overview from '../../components/Dashboard/children/Overview/Overview';
import { useState } from '@hookstate/core';
import store from '../../utils/store';

const Dashboard = () => {

    const router = useRouter();

    const globalStore = useState(store);
    const [authenticated, setAuthenticated] = React.useState(false);

    useEffect(() => {
        globalStore.pathname.set("/dashboard");
    }, []);

    useEffect(() => {
        if(isAuthenticated()) {
            globalStore.activeSidebarItem.set("");
            setAuthenticated(true);
        }
        else {
            router.push("/");
        }
    }, [isAuthenticated]);

    return (
        <>
        {authenticated ?
            <DashboardWrapper>
                <Overview />
            </DashboardWrapper>
        :
            null
        }
        </>
    )
}

export default Dashboard;