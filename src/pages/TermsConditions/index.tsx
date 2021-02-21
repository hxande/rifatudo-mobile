import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Terms from '../../components/Terms';

const TermsConditions = () => {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Terms />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TermsConditions;
