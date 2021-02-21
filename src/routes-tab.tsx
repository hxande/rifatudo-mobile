import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AuthContext from './contexts/auth';
import RoutesStack from './routes-stack';
import NewRaffle from './pages/NewRaffle';
import RoutesStackUser from './routes-stack-user';

const AppTab = createBottomTabNavigator();

const RoutesTab = () => {
    const { signed } = useContext(AuthContext);

    return (
        <AppTab.Navigator initialRouteName="Início">
            <AppTab.Screen name="Início" component={RoutesStack} />
            {signed ?
                <AppTab.Screen name="Criar Rifa" component={NewRaffle} />
                :
                <>
                </>
            }
            <AppTab.Screen name="Perfil" component={RoutesStackUser} />
        </AppTab.Navigator>
    );
};

export default RoutesTab;