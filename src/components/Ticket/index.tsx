import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import api from '../../services/api';

interface Props {
    raffle: number;
    num: number;
    status: number;
    value: number;
}

const Ticket: React.FC<Props> = ({ raffle, num, status, value }) => {

    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        async function getRaffle() {
            try {
                const response = await api.get(`/rifas/${raffle}`);
                setTitle(response.data[0].titulo);
            } catch (error) {
                console.log(error);
            }
        }
        getRaffle();
    }, []);

    return (
        <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginVertical: 10 }}>
            <View style={{ flex: 3, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>#{raffle} - {title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Número:</Text>
                    <View style={{ backgroundColor: '#fff', height: 30, width: 30, borderRadius: 15, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#806600', fontSize: 18 }}>{num}</Text>
                    </View>
                </View>
                <View>
                    <Text>Data de Encerramento:</Text>
                    <Text style={{ color: '#ff1a1a' }}>23/02/2021</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Situação:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{status === 1 ? 'Pendente' : 'Paga'}</Text>
                </View>
            </View>
            <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>Preço</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R${value.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ticketImage: {
        height: 250,
        width: 250,
        tintColor: '#fff'
    },

    ticketRaffleNumText: {
        marginTop: 0,
        marginLeft: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },

    ticketNumContainer: {
        height: 70,
        width: 70,
        marginLeft: 70,
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    ticketNumText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
});

export default Ticket;
