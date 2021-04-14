import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, Modal, Pressable } from 'react-native';
import { Feather as Icon, MaterialCommunityIcons as Icon2 } from '@expo/vector-icons';
import api from '../../services/api';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    raffle: number;
    num: number;
    buyer: number | undefined;
    status: number;
    value: number;
}

interface IDisputesDTO {
    id_comprador: String;
    id_vendedor: String;
    id_rifa: String;
    id_cota: String;
}

const Ticket: React.FC<Props> = ({ raffle, buyer, num, status, value }) => {

    const [title, setTitle] = useState<string>('');
    const [menu, setMenu] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        async function getRaffle() {
            try {
                const response = await api.get(`/raffles/${raffle}`);
                setTitle(response.data[0].title);
            } catch (error) {
                console.log(error);
            }
        }
        getRaffle();
    }, []);

    async function handleDisputes() {
        const dto: IDisputesDTO = {} as IDisputesDTO;
        dto.id_comprador = String(buyer);
        dto.id_rifa = String(raffle);
        dto.id_cota = String(num);

        try {
            const response = await api.post('/disputes', { data: dto });
            if (response.status === 200) {
                await api.put(`/raffles/${raffle}/quotas/${num}/status/2`, {});
                setModalVisible(!modalVisible);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleReceived() {
        Alert.alert('Recebimento confirmado!');
    }

    function getStatusName(status: number): string {
        let statusName = '';
        switch (status) {
            case 0:
                statusName = 'Aberta';
                break;
            case 1:
                statusName = 'Aguardando';
                break;
            case 2:
                statusName = 'Em disputa';
                break;
            case 3:
                statusName = 'Paga';
                break;
            case 4:
                statusName = 'Vencedora';
                break;
            default:
                statusName = '?';
        }
        return statusName;
    }

    return (
        <>
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
                        <Text style={styles.modalText}>Confirmar operação?</Text>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => handleDisputes()}
                            >
                                <Text style={styles.textStyle}>Confirmar</Text>
                            </Pressable>
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

            {
                status === 4 || status === 2 ?
                    <View style={{ backgroundColor: '#d6d6c2', height: 30, width: '70%', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginLeft: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='star' style={{ fontSize: 20, color: 'green' }} />
                        <Text style={{ marginLeft: 5 }}>PARABÉNS - VOCÊ GANHOU</Text>
                    </View>
                    :
                    <></>
            }

            <View style={{ backgroundColor: '#d6d6c2', height: 120, borderRadius: 10, flexDirection: 'row', paddingLeft: 5, marginBottom: 10 }}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Situação:</Text>
                            <Text>{getStatusName(status)}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setMenu(!menu)}>
                                <Icon name='menu' style={{ fontSize: 25, marginRight: 5 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 2, backgroundColor: '#e0e0d1', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>Preço</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003d99' }}>R${value}</Text>
                </View>
            </View>
            {
                menu && status === 4 ?
                    <View style={{ backgroundColor: '#e0e0d1', flex: 1, height: 50, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', backgroundColor: '#fff', height: 35, width: 150, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                                onPress={handleReceived}
                            >
                                <Icon2 name='truck-check' style={{ fontSize: 20, marginRight: 5 }} />
                                <View>
                                    <Text style={{ fontSize: 14 }}>CONFIRMAR</Text>
                                    <Text style={{ fontSize: 14 }}>RECEBIMENTO</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', backgroundColor: '#fff', height: 35, width: 150, marginLeft: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Icon name='phone-call' style={{ fontSize: 20, marginRight: 5 }} />
                                <Text style={{ fontSize: 14 }}>ABRIR DISPUTA</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <></>
            }
        </>
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

    modalText: {
        marginBottom: 15,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Ticket;
