import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as Icon } from '@expo/vector-icons';

import AuthContext from './contexts/auth';
import RoutesStack from './routes-stack';
import RoutesStackUser from './routes-stack-user';
import NewRaffle from './pages/NewRaffle';

const AppTab = createBottomTabNavigator();

const RoutesTab = () => {
    const { signed } = useContext(AuthContext);

    return (
        <AppTab.Navigator
            initialRouteName="Inicio"
            tabBarOptions={{
                activeTintColor: '#380744',
                inactiveTintColor: '#6b6b47',
                showLabel: true,
                style: {
                    // backgroundColor: 'rgb(187,112,25)',
                },
            }}
        >
            <AppTab.Screen
                name="Inicio"
                component={RoutesStack}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <Icon
                            name='home'
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
            {
                signed ?
                    <AppTab.Screen
                        name="CriarRifa"
                        component={NewRaffle}
                        options={{
                            tabBarIcon: (({ size, color }) => (
                                <Icon
                                    name='plus'
                                    size={size}
                                    color={color}
                                />
                            ))
                        }}
                    />
                    :
                    <>
                    </>
            }
            <AppTab.Screen
                name="Perfil"
                component={RoutesStackUser}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <Icon
                            name='user'
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
        </AppTab.Navigator >
    );
};

export default RoutesTab;