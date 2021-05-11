import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Terms from '../../components/Terms';
import { Header } from 'react-native-elements';


function handleNavigateBack() {
    navigation.goBack();
}

const TermsConditions = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Header
                backgroundColor="rgb(187,130,45)"
                leftComponent={{ icon: 'chevron-left', color: '#fff' }}
                centerComponent={{ text: 'Termo e condições', style: { color: '#fff', fontSize: 16 } }}
            />
            <ScrollView>
                <Terms />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#380744',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TermsConditions;
