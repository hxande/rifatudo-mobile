import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import User from './pages/User';
import MyInformations from './pages/MyInformations';
import MyRaffles from './pages/MyRaffles';
import TermsConditions from './pages/TermsConditions';

const AppStack = createStackNavigator();

const RoutesStackUser = () => {
    return (
        <AppStack.Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: '#f0f0f5', } }}>
            <AppStack.Screen name="Perfil" component={User} />
            <AppStack.Screen name="MinhasInformacoes" component={MyInformations} />
            <AppStack.Screen name="MinhasRifas" component={MyRaffles} />
            <AppStack.Screen name="TermosCondicoes" component={TermsConditions} />
        </AppStack.Navigator>
    );
};

export default RoutesStackUser;