import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions, TextInput, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import IRaffle from '../../models/Raffle';
import api from '../../services/api';

interface IRaffleInfo extends IRaffle {
    qttBuyed?: string;
    deadline?: Date;
    imageUrl?: string;
}

interface IResult {
    ID: number;
    data: string;
    sorteio1: string;
    sorteio2: string;
    sorteio3: string;
    sorteio4: string;
    sorteio5: string;
    sorteio6: string;
    sqltime: string;
}

const Raffles = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [raffles, setRaffles] = useState<IRaffleInfo[]>([]);

    const [sorteioFederal, setSorteioFederal] = useState<IResult[]>([
        {
            "ID": 1,
            "data": "20/04/2021",
            "sorteio1": "111111",
            "sorteio2": "222222",
            "sorteio3": "333333",
            "sorteio4": "444444",
            "sorteio5": "555555",
            "sorteio6": "666666",
            "sqltime": "2021-04-05 18:44:16"
        }
    ]);

    const [page, setPage] = useState<number>(1);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [endData, setEndData] = useState<boolean>(false);

    useEffect(() => {
        Linking.getInitialURL().then(url => {
            // console.warn(url);
        });

        async function getRifas() {
            try {
                const response = await api.get(`/raffles/pages/${page}`);
                setRaffles(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        getRifas();

        async function getResults() {
            try {
                const response = await api.get('/results');
                setSorteioFederal(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getResults();
    }, []);

    async function getMoreRaffles() {
        if (!scrolled || endData) {
            return;
        }

        try {
            const response = await api.get(`/raffles/pages/${page + 1}`);
            if (response.data.length === 0) {
                setEndData(true);
            }
            setPage(page + 1);
            setRaffles([...raffles, ...response.data]);
        } catch (error) {
            console.log(error);
        }
    }

    function onScroll() {
        setScrolled(true);
    }

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate('Detalhe', {
            raffle_id: id
        });
    }

    const renderItem: ListRenderItem<IRaffleInfo> = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => handleNavigateToDetail(item.id!)}
            activeOpacity={0.6}
        >
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
            <View style={{ marginLeft: 10, justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemPrice}>R$ {item.value}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 30 }}>
                    <Text style={styles.itemLocation}>{item.city}, {item.uf} | </Text>
                    <Text>{item.status == 2 ? item.deadline!.toLocaleString('pt-BR').slice(0, 10) : ''}</Text>
                    <Text style={styles.itemLocation}>{item.qttBuyed}/{item.qtt}</Text>
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
                    <Text style={{ fontSize: 16 }}>Último Sorteio:  </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{sorteioFederal[0].data}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.lotteryNumbersText}>{sorteioFederal[0].sorteio1}</Text>
                    <Text style={styles.lotteryNumbersText}>{sorteioFederal[0].sorteio2}</Text>
                    <Text style={styles.lotteryNumbersText}>{sorteioFederal[0].sorteio3}</Text>
                    <Text style={styles.lotteryNumbersText}>{sorteioFederal[0].sorteio4}</Text>
                    <Text style={styles.lotteryNumbersText}>{sorteioFederal[0].sorteio5}</Text>
                </View>
                <View style={styles.lotteryInfoContainer}>
                    <Text style={{ fontSize: 16 }}>  Próximo Sorteio: </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{sorteioFederal[0].data}</Text>
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <FlatList
                    data={raffles}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
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
        backgroundColor: '#380744',
    },

    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    lotteryContainer: {
        height: 'auto',
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
        margin: 6,
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