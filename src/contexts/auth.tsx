import React, { createContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface IUser {
    id: number;
    name: string;
    surname: string;
    email: string;
}

interface IAuthContext {
    signed: boolean;
    user: IUser | null;
    logar(username: string, password: string): Promise<void>;
    sair(): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);
export default AuthContext;

export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageItem() {
            const storageUser = await AsyncStorage.getItem('@RNAuth:user');
            const storageToken = await AsyncStorage.getItem('@RNAuth:token');
            if (storageUser && storageToken) {
                setUser(JSON.parse(storageUser));
                api.defaults.headers['Authorization'] = `Bearer ${storageToken}`;
            }
            setLoading(false);
        }

        loadStorageItem();
    }, []);

    async function logar(username: string, password: string) {
        let data = {
            username,
            password
        };

        try {
            const response = await api.post('/users/auth', data);
            const { token } = response.data;
            setUser(response.data.user);

            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.data.user));
            await AsyncStorage.setItem('@RNAuth:token', token);
        } catch (error) {
            console.log('AUTH CONTEXT -> ', error);
        }
    }

    function sair() {
        console.log('Desloguei!');
        AsyncStorage.clear().then(() => {
            setUser(null);
        });
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='#666' />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, logar, sair }}>
            {children}
        </AuthContext.Provider>
    );
};