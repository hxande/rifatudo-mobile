import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { MaterialIcons as Icon2 } from '@expo/vector-icons';
import AuthContext from '../../contexts/auth';
import MyRaffle from '../../components/MyRaffle';
import Ticket from '../../components/Ticket';
import api from '../../services/api';

interface ICota {
    ID: number;
    id_rifa: string;
    id_usuario: string;
    num: string;
    valor: string;
    status: string;
}

interface IMinhaRifa {
    ID: number;
    titulo: string;
    status: string;
    duracao: string;
    soma: number;
    contagem: number;
}

const MyRaffles = () => {
    const { user } = useContext(AuthContext);
    const [cotas, setCotas] = useState<ICota[]>([]);
    const [minhaRifa, setMinhaRifa] = useState<IMinhaRifa[]>([]);

    const [total, setTotal] = useState<number>(0);
    const [tabsRifas, setTabsRifas] = useState<boolean>(false);

    useEffect(() => {
        async function getCotas() {
            try {
                const response = await api.get(`/users/${user?.id}/cotas`);
                setCotas(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getCotas();

        async function getMinhaRifa() {
            try {
                const response = await api.get(`/rifas/${user?.id}/my`);
                if (response.data[0].ID !== null) {
                    setMinhaRifa(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMinhaRifa();
    }, []);

    useEffect(() => {
        async function getTotal() {
            try {
                const response = await api.get(`/statements/total/${user?.id}`);
                setTotal(response.data[0].total !== null ? response.data[0].total : 0);
            } catch (error) {
                console.log(error);
            }
        }
        getTotal();
    }, []);

    function handleChangeTabs() {
        setTabsRifas(!tabsRifas);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Minhas Rifas</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TouchableOpacity style={{ marginLeft: 20, backgroundColor: '#fb5b5a', height: 30, width: 100, marginBottom: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>Histórico</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Icon style={{ fontSize: 20 }} name='money-bill-wave' size={20} color='#00802b' />
                        <Text style={{ color: 'black', fontSize: 20, marginHorizontal: 10 }}>Saldo:</Text>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: '700' }}>R${total}</Text>
                    </View>
                    <TouchableOpacity style={{ marginRight: 20, backgroundColor: '#fb5b5a', height: 30, width: 100, marginBottom: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>Sacar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <TouchableOpacity
                    style={!tabsRifas ?
                        [styles.tabSelectedBtn, { borderTopRightRadius: 25, borderBottomRightRadius: 25 }]
                        :
                        styles.tabHiddenBtn} onPress={handleChangeTabs}
                >
                    <Icon style={{ fontSize: 20 }} name='chart-bar' size={20} color={!tabsRifas ? '#fff' : '#00b300'} />
                    <Text style={{ fontWeight: 'bold' }}>RIFADAS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tabsRifas ?
                    [styles.tabSelectedBtn, { borderTopLeftRadius: 25, borderBottomLeftRadius: 25 }]
                    :
                    styles.tabHiddenBtn} onPress={handleChangeTabs}
                >
                    <Icon style={{ fontSize: 20 }} name='shopping-bag' size={20} color={tabsRifas ? '#fff' : '#00b300'} />
                    <Text style={{ fontWeight: 'bold' }}>COMPRADAS</Text>
                </TouchableOpacity>
            </View>
            {
                !tabsRifas ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 2 }}>
                            <Text style={{ color: '#fb5b5a', textAlign: 'center', fontSize: 30, marginVertical: 10 }}>Em Andamento</Text>
                            <ScrollView style={{ flex: 1 }}>
                                {
                                    minhaRifa && minhaRifa.map(minha => {
                                        return +minha.status < 3 ?
                                            <MyRaffle key={minha.ID} num={minha.ID} title={minha.titulo} qtt={minha.contagem} finishDate={minha.duracao} status={minha.status} value={minha.soma} />
                                            :
                                            <></>
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ color: '#fb5b5a', textAlign: 'center', fontSize: 30, marginVertical: 10 }}>Finalizadas</Text>
                            <ScrollView style={{ flex: 1 }}>
                                {
                                    minhaRifa && minhaRifa.map(minha => {
                                        return +minha.status > 2 ?
                                            <MyRaffle key={minha.ID} num={minha.ID} title={minha.titulo} qtt={minha.contagem} finishDate={minha.duracao} status={minha.status} value={minha.soma} />
                                            :
                                            <></>
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    :
                    <View>
                        <ScrollView showsVerticalScrollIndicator={true} indicatorStyle='white' scrollIndicatorInsets={{ right: 0 }}>
                            {
                                cotas && cotas.map(cota =>
                                    <Ticket key={cota.ID} raffle={+cota.id_rifa} num={+cota.num} status={+cota.status} value={+cota.valor} />
                                )
                            }
                        </ScrollView>
                    </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
    },

    headerContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 10
    },

    title: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#fb5b5a',
        marginVertical: 20
    },

    tabSelectedBtn: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#00b300',
    },

    tabHiddenBtn: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#fff'
    }
});

export default MyRaffles;
