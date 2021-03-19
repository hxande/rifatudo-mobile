import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

interface Props {
    num: number;
    title: string;
    qtt: number;
    finishDate: string;
    status: string;
    value: number;
}

const MyRaffle: React.FC<Props> = ({ num, title, qtt, finishDate, status, value }) => {

    return (
        <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
            <View style={{ flex: 3, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>#{num} - {title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Quantidade de Rifas Vendidas:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{qtt}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Data de Encerramento:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{finishDate}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Situação:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{+status === 0 ? 'Nova' : 'Ativa'}</Text>
                </View>
            </View>
            <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>Total Arrecadado</Text>
                    <Icon style={{ fontSize: 20 }} name='attach-money' size={20} color='#00802b' />
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R${value.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
});

export default MyRaffle;
