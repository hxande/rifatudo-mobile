import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import IQuota from '../../models/Quota';
import api from '../../services/api';

interface Props {
    num: number;
    title: string;
    finishDate: string;
    duration: number;
    status: number;
}

const MyRaffle: React.FC<Props> = ({ num, title, finishDate, duration, status }) => {

    const [quotas, setQuotas] = useState<IQuota[]>([]);
    const [totalV, setTotalV] = useState<number>(0);
    const [totalQ, setTotalQ] = useState<number>(0);
    const [raffleDeadline, setRaffleDeadline] = useState<Date>();

    useEffect(() => {
        async function getQuotas() {
            try {
                const response = await api.get(`/raffles/${num}/quotas`);
                setQuotas(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getQuotas();

        function calculateDeadline() {
            if (status < 3) {
                const deadline = new Date(finishDate.slice(0, 10));
                const deadlineAdd = deadline.setDate(deadline.getDate() + duration);
                setRaffleDeadline(new Date(deadlineAdd));
            } else {
                setRaffleDeadline(new Date(finishDate));
            }
        }

        calculateDeadline();
    }, []);

    useEffect(() => {
        calculateSold(quotas);
    }, [quotas]);

    function calculateSold(raffleQuotas: IQuota[]) {
        let totalValue = 0;
        let totalQtt = 0;
        raffleQuotas.map((quota, index) => {
            if (quota.status > 1) {
                totalValue += +quota.value;
                totalQtt += 1;
            }

            if (index === raffleQuotas.length - 1) {
                setTotalV(totalValue);
                setTotalQ(totalQtt);
            }
        });
    }

    return (
        <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
            <View style={{ flex: 3, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>#{num} - {title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Quantidade de Rifas Vendidas:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{totalQ}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Data de Encerramento:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{raffleDeadline?.toLocaleDateString('pt-BR')}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Situação:</Text>
                    <Text style={{ color: '#ff1a1a' }}>{status === 0 ? 'Nova' : 'Ativa'}</Text>
                </View>
            </View>
            <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold' }}>Total Arrecadado</Text>
                    <Icon style={{ fontSize: 20 }} name='attach-money' size={20} color='#00802b' />
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R${totalV}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
});

export default MyRaffle;
