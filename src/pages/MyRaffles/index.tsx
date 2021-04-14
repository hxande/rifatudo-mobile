import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, Pressable, Modal, TextInput } from 'react-native';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { MaterialIcons as Icon2 } from '@expo/vector-icons';
import AuthContext from '../../contexts/auth';
import IRaffle from '../../models/Raffle';
import IQuota from '../../models/Quota';
import IStatement from '../../models/Statement';
import MyRaffle from '../../components/MyRaffle';
import Ticket from '../../components/Ticket';
import api from '../../services/api';

interface IWithdrawDTO {
    owner: number | undefined;
    valor: number;
}

const MyRaffles = () => {
    const { user } = useContext(AuthContext);
    const [quotas, setQuotas] = useState<IQuota[]>([]);
    const [myRaffles, setMyRaffles] = useState<IRaffle[]>([]);

    const [statements, setStatements] = useState<IStatement[]>([]);

    const [total, setTotal] = useState<number>(0);
    const [tabsRifas, setTabsRifas] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [withdrawValue, setWithdrawValue] = useState<string>('');

    useEffect(() => {
        async function getQuotas() {
            try {
                const response = await api.get(`/users/${user!.id}/quotas`);
                setQuotas(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getQuotas();

        async function getMyRaffles() {
            try {
                const response = await api.get(`/raffles/users/${user!.id}`);
                if (response.data[0].id !== null) {
                    setMyRaffles(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMyRaffles();
    }, []);

    // useEffect(() => {
    //     setModalVisible(true);
    // }, [transacoes]);

    function handleChangeTabs() {
        setTabsRifas(!tabsRifas);
    }

    async function handleHistory() {
        try {
            const response = await api.get('/statements');
            if (response.status === 200) {
                setStatements(response.data);
                setModalVisible(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleWithdraw() {
        if (total <= 0) {
            Alert.alert('Você não possui saldo!');
            return;
        }

        setModalVisible2(true);
    }

    async function handleConfirm() {
        const parsedValue = withdrawValue.replace(',', '.');

        if (+parsedValue > total) {
            Alert.alert('Valor solicitado maior que na carteira!');
            return;
        }

        const data = {} as IWithdrawDTO;
        data.valor = -parsedValue;
        data.owner = user?.id;
        const response = await api.post('/statements/types/3', data);
        if (response.status === 200) {
            Alert.alert(
                'Saque solicitado!',
                'Aguarde até 2 dias úteis para confirmação.',
                [
                    {
                        text: 'OK',
                        onPress: () => setModalVisible2(!modalVisible2),
                        style: 'default',
                    },
                ]
            );
        }
    }

    function getStatusName(status: number): string {
        let statusName = '';
        switch (status) {
            case 1:
                statusName = 'Compra';
                break;
            case 2:
                statusName = 'Venda';
                break;
            case 3:
                statusName = 'Saque';
                break;
            default:
                statusName = '?';
        }
        return statusName;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Histórico de Transações</Text>
                        {
                            statements.map(statement => (
                                <View key={statement.id} style={{ width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ width: '25%' }}>Rifa: {statement.id_raffle}</Text>
                                    <Text style={{ width: '25%' }}>{getStatusName(statement.kind)}</Text>
                                    <Text style={[statement.kind === 2 ? { color: 'blue' } : { color: 'red' }, { width: '20%' }]}>{statement.value}</Text>
                                    <Text style={{ width: '30%' }}>{new Date(statement.created_at).toLocaleDateString('pt-BR')}</Text>
                                </View>
                            ))
                        }
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Fechar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible2(!modalVisible2);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Informe o valor a ser sacado:</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType='numeric'
                            placeholder='Valor'
                            placeholderTextColor='#fff'
                            value={withdrawValue}
                            onChangeText={setWithdrawValue}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={handleConfirm}
                            >
                                <Text style={styles.textStyle}>Confirmar</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible2(!modalVisible2)}
                            >
                                <Text style={styles.textStyle}>Fechar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Minhas Rifas</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TouchableOpacity
                        style={{ marginLeft: 5, backgroundColor: '#fb5b5a', height: 30, width: 80, marginBottom: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleHistory}
                    >
                        <Text style={{ color: '#fff' }}>Histórico</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Icon style={{ fontSize: 20 }} name='money-bill-wave' size={20} color='#00802b' />
                        <Text style={{ color: 'black', fontSize: 20, marginHorizontal: 10 }}>Saldo:</Text>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: '700' }}>R${total.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ marginRight: 5, backgroundColor: '#fb5b5a', height: 30, width: 80, marginBottom: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleWithdraw}
                    >
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
                                    myRaffles && myRaffles.map(raffle => {
                                        return raffle.status < 3 ?
                                            <MyRaffle key={raffle.id} num={raffle.id!} title={raffle.title} finishDate={raffle.updated_at!} duration={raffle.duration} status={raffle.status} />
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
                                    myRaffles && myRaffles.map(raffle => {
                                        return raffle.status > 2 ?
                                            <MyRaffle key={raffle.id} num={raffle.id!} title={raffle.title} finishDate={raffle.updated_at!} duration={raffle.duration} status={raffle.status} />
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
                                quotas && quotas.map(quota =>
                                    <Ticket key={quota.id} raffle={quota.id_raffle} num={quota.num} status={quota.status} value={quota.value} buyer={user!.id} />
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
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    button: {
        width: '48%',
        backgroundColor: '#34cb79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonConfirm: {
        marginRight: 5,
    },

    buttonClose: {
        marginLeft: 5,
        backgroundColor: '#2196F3',
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    modalText: {
        marginBottom: 15,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    modalInput: {
        marginBottom: 15,
        textAlign: 'center',
        backgroundColor: '#66c2ff',
        width: 200,
        height: 50,
        borderRadius: 25,
        fontSize: 20,
    },
});

export default MyRaffles;
