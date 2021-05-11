import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as Icon } from '@expo/vector-icons';

import AuthContext from './contexts/auth';
import RoutesStack from './routes-stack';
import NewRaffle from './pages/NewRaffle';
import RoutesStackUser from './routes-stack-user';

const AppTab = createBottomTabNavigator();

const RoutesTab = () => {
    const { signed } = useContext(AuthContext);

    return (
        <AppTab.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, focused, size }: Props) => {
                    let iconName;

                    if (route.name === 'Inicio') {
                        iconName = `home`;
                    } else if (route.name === 'Perfil') {
                        iconName = 'user';
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={25} color='#fb5b5a' />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#3b5998',
                inactiveTintColor: 'gray',
                showLabel: true, // hide labels
                style: {
                    backgroundColor: '#FAFAFA', // TabBar background
                },
            }}
        >
            <AppTab.Screen name="Inicio" component={RoutesStack} />
            {
                signed ?
                    <AppTab.Screen name="CriarRifa" component={NewRaffle} />
                    :
                    <>
                    </>
            }
            <AppTab.Screen name="Perfil" component={RoutesStackUser} />
        </AppTab.Navigator >
    );
};

export default RoutesTab;