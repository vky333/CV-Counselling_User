import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from '@hookstate/core';

import store from '../../utils/store';
import { isAuthenticated } from '../../utils/auth';
import DashboardWrapper from '../../components/Dashboard/DashboardWrapper/DashboardWrapper';
import Setting from '../../components/Dashboard/setting/Setting'

const Settings = () => {

    const router = useRouter();

    const globalStore = useState(store);
    const [authenticated, setAuthenticated] = React.useState(false);

    useEffect(() => {
        if(isAuthenticated()) {
            globalStore.activeSidebarItem.set("settings");
            setAuthenticated(true);
        }
        else {
            router.push("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        globalStore.pathname.set("/settings");
    }, []);
    
    return (
        <>
        {authenticated ?
        <DashboardWrapper>
            <Setting/>
        </DashboardWrapper>
        :
        null
        }
        </>
    );
}

export default Settings;