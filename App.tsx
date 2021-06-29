import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';

import { AuthProvider } from './src/contexts/auth';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      {/* <StatusBar barStyle='light-content' backgroundColor='#8807a9' /> */}
      <StatusBar  style="light" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </>
  );
}