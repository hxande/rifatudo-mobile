import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import axios from 'axios';
import api from '../../services/api';

interface IRifa {
    ID: number;
    id_usuario: string;
    titulo: string;
    descricao: string;
    id_categoria: string;
    uf: string;
    cidade: string;
    status: string;
    valor: string;
    qtd_cotas: string;
    qtd_cotas_g: string;
    qtd_cotas_m: string;
    qtd_ganhadores: string;
    duracao: string;
    sqltime: string;
}

interface IRifaCotas {
    ID: number;
    id_usuario: string;
    titulo: string;
    uf: string;
    cidade: string;
    valor: string;
    qtd_cotas: string;
    qtd_compradas: string;
    duracao: string;
    image_url: string;
}

interface ISorteioFederal {
    dataApuracao: string;
    dezenasSorteadasOrdemSorteio: string[];
}

const Raffles = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [rifas, setRifas] = useState<IRifa[]>([]);
    const [rifasCotas, setRifasCotas] = useState<IRifaCotas[]>([]);

    const [sorteioFederal, setSorteioFederal] = useState<ISorteioFederal>({ dataApuracao: '', dezenasSorteadasOrdemSorteio: [] });

    const [page, setPage] = useState<number>(1);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [endData, setEndData] = useState<boolean>(false);


    async function getMoreRaffles() {
        if (!scrolled || endData) {
            return;
        }

        const response = await api.get(`/raffles/pages/${page + 1}`);
        if (response.data.length === 0) {
            setEndData(true);
        }

        setPage(page + 1);
        setRifas([...rifas, ...response.data]);
    }

    function onScroll() {
        setScrolled(true);
    }

    useEffect(() => {
        async function getRifas() {
            const response = await api.get(`/raffles/pages/${page}`);
            setRifas(response.data);
        }
        getRifas();

        async function getLotteryResult() {
            const response = await axios.get('https://lotericas.io/api/v1/jogos/federal/lasted');
            setSorteioFederal(response.data.data[0]);
        }
        getLotteryResult();
    }, []);

    useEffect(() => {
        let arrayTemp: IRifaCotas[] = [];
        rifas.forEach(async (rifa, index) => {
            try {
                const numCotasDisponiveis = await api.get(`/rifas/${rifa.ID}/cotas/status/0/contagem`);
                const numCotasCompradas = await api.get(`/rifas/${rifa.ID}/cotas/status/1/contagem`);
                let data: IRifaCotas = {} as IRifaCotas;
                data.ID = rifa.ID;
                data.id_usuario = rifa.id_usuario;
                data.titulo = rifa.titulo;
                data.valor = rifa.valor;
                data.uf = rifa.uf;
                data.cidade = rifa.cidade;
                data.qtd_compradas = String(numCotasCompradas.data[0].contador);
                data.qtd_cotas = String(numCotasDisponiveis.data[0].contador + numCotasCompradas.data[0].contador);
                data.duracao = rifa.duracao;
                const response = await api.get(`/rifas/${rifa.ID}/imagens`);
                data.image_url = response.data[0].image_url;
                arrayTemp.push(data);
                if (index === (rifas.length - 1)) {
                    setRifasCotas(arrayTemp);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }, [rifas]);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate('Detalhe', {
            raffle_id: id
        });
    }

    const renderItem: ListRenderItem<IRifaCotas> = ({ item }) => (
        <TouchableOpacity
            key={item.ID}
            style={styles.item}
            onPress={() => handleNavigateToDetail(item.ID)}
            activeOpacity={0.6}
        >
            <Image style={styles.image} source={{ uri: item.image_url }} />
            <View style={{ marginLeft: 10, justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.itemTitle}>{item.titulo}</Text>
                    <Text style={styles.itemPrice}>R$ {item.valor}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 30 }}>
                    <Text style={styles.itemLocation}>{item.cidade}, {item.uf} - 22/10/2020</Text>
                    <Text style={styles.itemLocation}>{item.qtd_compradas}/{item.qtd_cotas}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#666' />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Buscar'
                />
                <TouchableOpacity style={styles.filter} onPress={handleNavigateBack}>
                    <Icon style={{ fontSize: 30 }} name='filter' size={20} color='#fb5b5a' />
                </TouchableOpacity>
            </View>

            <View style={styles.lotteryContainer}>
                <View style={styles.lotteryInfoContainer}>
                    <Text style={{ fontSize: 16 }}>Último Sorteio: </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{sorteioFederal.dataApuracao}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {
                        sorteioFederal.dezenasSorteadasOrdemSorteio.map(dezena =>
                            <Text key={dezena} style={styles.lotteryNumbersText}>{dezena}</Text>
                        )
                    }
                </View>
                <View style={styles.lotteryInfoContainer}>
                    <Text style={{ fontSize: 16 }}>Próximo Sorteio: </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{sorteioFederal.dataApuracao}</Text>
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <FlatList
                    data={rifasCotas}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.ID)}
                    onScroll={onScroll}
                    onEndReached={getMoreRaffles}
                    onEndReachedThreshold={0}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    loadingContainer: {
        flex: 1,
        justifyContent:
            'center',
        alignItems: 'center'
    },

    container: {
        flex: 1,
    },

    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    lotteryContainer: {
        height: 80,
        borderRadius: 10,
        margin: 8,
        backgroundColor: '#fff',
        alignItems: 'center'
    },

    lotteryInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },

    lotteryNumbersText: {
        marginRight: 5,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#ffcc33'
    },

    searchInput: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        width: Dimensions.get('window').width - 64,
    },

    filter: {
        marginRight: 20,
    },

    itemsContainer: {
        marginTop: 8,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
    },

    image: {
        width: 120,
        height: 120
    },

    itemTitle: {
        width: Dimensions.get('window').width - 140,
        fontSize: 20,
    },

    itemPrice: {
        fontWeight: 'bold',
        fontSize: 24,
    },

    itemLocation: {
        fontSize: 14,
    },
});

export default Raffles;