import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { MaterialIcons as Icon2 } from '@expo/vector-icons';
import AuthContext from '../../contexts/auth';
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

const MyRaffles = () => {
    const { user } = useContext(AuthContext);
    const [cotas, setCotas] = useState<ICota[]>([]);
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
    }, []);

    function handleChangeTabs() {
        setTabsRifas(!tabsRifas);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Minhas Rifas</Text>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Icon style={{ fontSize: 20 }} name='money-bill-wave' size={20} color='#00802b' />
                    <Text style={{ color: 'black', fontSize: 20, marginHorizontal: 10 }}>Saldo:</Text>
                    <Text style={{ color: 'black', fontSize: 20, fontWeight: '700' }}>R$10,00</Text>
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
                                <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
                                    <View style={{ flex: 3, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>#0000174 - Rifa da Bicicleta do Doido</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Quantidade de Rifas Vendidas:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>1150</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Data de Encerramento:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>23/02/2021</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Situação:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>Entregue</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Total Arrecadado</Text>
                                            <Icon2 style={{ fontSize: 20 }} name='attach-money' size={20} color='#00802b' />
                                        </View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R$2350,00</Text>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
                                    <View style={{ flex: 3, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>#0000174 - Rifa da Bicicleta do Doido</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Quantidade de Rifas Vendidas:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>1150</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Data de Encerramento:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>23/02/2021</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Situação:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>Entregue</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Total Arrecadado</Text>
                                            <Icon2 style={{ fontSize: 20 }} name='attach-money' size={20} color='#00802b' />
                                        </View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R$2350,00</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ color: '#fb5b5a', textAlign: 'center', fontSize: 30, marginVertical: 10 }}>Finalizadas</Text>
                            <ScrollView style={{ flex: 1 }}>
                                <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
                                    <View style={{ flex: 3, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>#0000174 - Rifa da Bicicleta do Doido</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Quantidade de Rifas Vendidas:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>1150</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Data de Encerramento:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>23/02/2021</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Situação:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>Entregue</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Total Arrecadado</Text>
                                            <Icon2 style={{ fontSize: 20 }} name='attach-money' size={20} color='#00802b' />
                                        </View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R$2350,00</Text>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
                                    <View style={{ flex: 3, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>#0000174 - Rifa da Bicicleta do Doido</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Quantidade de Rifas Vendidas:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>1150</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Data de Encerramento:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>23/02/2021</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Situação:</Text>
                                            <Text style={{ color: '#ff1a1a' }}>Entregue</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Total Arrecadado</Text>
                                            <Icon2 style={{ fontSize: 20 }} name='attach-money' size={20} color='#00802b' />
                                        </View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R$2350,00</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    :
                    <View>
                        <ScrollView showsVerticalScrollIndicator={true} pagingEnabled indicatorStyle='white' scrollIndicatorInsets={{ right: 0 }}>
                            {
                                cotas && cotas.map(cota =>
                                    <Ticket key={cota.ID} raffle={+cota.id_rifa} num={+cota.num} />
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
