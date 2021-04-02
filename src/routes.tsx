import React, { useContext } from 'react';
import { Text } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import AuthContext from './contexts/auth';
import Home from './pages/Home';
import Register from './pages/Register';
import RoutesTab from './routes-tab';

const AppStack = createStackNavigator();
const prefix = Linking.createURL('/', { scheme: 'rifatudo' });
const config = {
    screens: {
        Home: 'home',
        Registrar: 'registrar',
        Visitar: {
            screens: {
                Inicio: {
                    screens: {
                        Rifa: 'rifa',
                        Detalhe: 'detalhe',
                        Checkout: 'checkout',
                        Pagamento: 'pagamento'
                    }
                },
                CriarRifa: 'criarrifa',
                Perfil: {
                    screens: {
                        Perfil: 'perfil2',
                        MinhasInformacoes: 'minhasinformacoes',
                        MinhasRifas: 'minhasrifas',
                        TermosCondicoes: 'termoscondicoes'
                    }
                }
            }
        },
    }
}

const Routes = () => {
    const linking = {
        prefixes: [prefix],
        config,
    };
    const { signed } = useContext(AuthContext);

    return (
        <NavigationContainer linking={linking} fallback={<Text>Carregando...</Text>}>
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