import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Raffles from './pages/Raffles';
import RaffleDetail from './pages/RaffleDetail';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';

const AppStack = createStackNavigator();

const RoutesStack = () => {
    return (
        <AppStack.Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: '#f0f0f5', } }}>
            <AppStack.Screen name="Rifa" component={Raffles} />
            <AppStack.Screen name="Detalhe" component={RaffleDetail} />
            <AppStack.Screen name="Checkout" component={Checkout} />
            <AppStack.Screen name="Pagamento" component={Payment} />
        </AppStack.Navigator>
    );
};

export default RoutesStack;