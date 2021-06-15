import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, FlatList, ListRenderItem } from 'react-native';
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
    const [loadingMore, setLoadingMore] = useState(true);

    useEffect(() => {
        async function getRaffles() {
            try {
                const response = await api.get(`/raffles/pages/${page}`);
                setRaffles(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        getRaffles();

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

    async function fetchRaffles() {
        const { data } = await api.get(`/raffles/pages/${page}`);

        if (!data) {
            return setLoading(true);
        }

        if (page > 1) {
            setRaffles(oldValue => [...oldValue!, ...data]);
            // setFilteredPlants(oldValue => [...oldValue!, ...data]);
        } else {
            setRaffles(data);
            // setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1) {
            return;
        }

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchRaffles();
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
            <View style={styles.itemInfoContainer}>
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
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.filter} onPress={handleNavigateBack}>
                    <Icon style={{ fontSize: 30 }} name='filter' size={20} color='rgb(187,112,25)' />
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
                    keyExtractor={item => String(item.id)}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => {
                        handleFetchMore(distanceFromEnd);
                    }}
                    ListFooterComponent={
                        loadingMore
                            ? <ActivityIndicator color='#380744' />
                            : <></>
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginVertical: 5,
    },
    
    lotteryNumbersText: {
        marginRight: 5,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#ffcc33'
    },

    itemsContainer: {
        flex: 1,
    },

    item: {
        backgroundColor: '#e0ebeb',
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

    itemInfoContainer: {
        marginLeft: 10,
        justifyContent: 'space-between',
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