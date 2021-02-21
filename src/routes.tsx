import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import AuthContext from './contexts/auth';
import Home from './pages/Home';
import Register from './pages/Register';
import RoutesTab from './routes-tab';

const AppStack = createStackNavigator();

const Routes = () => {
    const { signed } = useContext(AuthContext);
    return (
        <NavigationContainer>
            {!signed ?
                <AppStack.Navigator headerMode='none' screenOptions={{ cardStyle: { backgroundColor: '#f0f0f5', } }}>
                    <AppStack.Screen name='Home' component={Home} />
                    <AppStack.Screen name='Registrar' component={Register} />
                    <AppStack.Screen name='Visitar' component={RoutesTab} />
                </AppStack.Navigator>
                :
                <RoutesTab />
            }
        </NavigationContainer>
    );
};

export default Routes;