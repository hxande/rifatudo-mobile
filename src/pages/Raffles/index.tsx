import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions, TextInput, FlatList, ListRenderItem, Pressable, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import { Feather as Icon } from '@expo/vector-icons';
import IRaffle from '../../models/Raffle';
import api from '../../services/api';

const logoCaixa = require('../../../assets/loterias-caixa-logo-1.png')
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

    const mockRaffles = [{
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "data:image/jpeg;base64,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",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    }, {
        "city": "Acrelândia",
        "created_at": "2021-06-17T03:03:40.475Z",
        "deadline": "2021-06-18T00:00:00.000Z",
        "description": "Sas",
        "duration": 1,
        "id": 51,
        "id_category": 1,
        "id_user": 1,
        "imageUrl": "https://cdn-motorshow-ssl.akamaized.net/wp-content/uploads/sites/2/2020/12/ferrari-458-speciale-blindada-2.jpg",
        "qtt": 11,
        "qttBuyed": "0",
        "qtt_free": 1,
        "qtt_min": 1,
        "qtt_winners": 0,
        "status": 1,
        "title": "SAS",
        "uf": "AC",
        "updated_at": "2021-06-17T03:03:40.475Z",
        "value": "111",
    },]


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

        setRaffles(mockRaffles);
        setLoading(false);

        async function getRifas() {
            try {
                const response = await api.get(`/raffles/pages/${page}`);
                setRaffles(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        // getRifas();

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

    function headerListRaffles() {
        return (
            <View style={styles.item}>
                <View style={styles.lotteryContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '50%', padding: 5 }}>
                            <Image
                                style={{ width: 130, height: 40 }}
                                source={logoCaixa}
                            />
                        </View>
                        <View style={{ width: '50%' }}>
                            <View style={styles.lotteryInfoContainer}>
                                <Text style={{ fontSize: 13 }}>Último Sorteio: </Text>
                                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{sorteioFederal[0].data}</Text>
                            </View>
                            <View style={styles.lotteryInfoContainer}>
                                <Text style={{ fontSize: 13 }}>Próximo Sorteio: </Text>
                                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{sorteioFederal[0].data}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#FFEB64', width: '100%', padding: 4, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                        <Text style={{ color: '#FF6161', fontWeight: 'bold', fontSize: 15 }}>111111  222222 333333 444444 555555</Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderItem: ListRenderItem<IRaffleInfo> = ({ item }) => (
        <View
            key={item.id}
            style={styles.item}
        >

            <View style={{ flexDirection: 'column' }}>
                <View style={{
                    height: 50,
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    flexDirection: 'row'
                }}>
                    <View style={{ width: '70%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 17, color: '#898989' }}>FERRARI 488 PISTA SPIDER </Text>
                    </View>
                    <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon style={{ fontSize: 17 }} name='star' size={17} color='#fb5b5a' />
                        <Icon style={{ fontSize: 17 }} name='star' size={17} color='#fb5b5a' />
                        <Icon style={{ fontSize: 17 }} name='star' size={17} color='#fb5b5a' />
                        <Icon style={{ fontSize: 17 }} name='star' size={17} color='#fb5b5a' />
                        <Icon style={{ fontSize: 17 }} name='star' size={17} color='#fb5b5a' />
                    </View>
                </View>

                <View style={{
                    height: 'auto',
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 10
                }}>
                    <View>
                        <Image style={{ width: '100%', height: 150 }} source={{ uri: item.imageUrl }} />
                    </View>
                </View>

                <View style={{
                    height: 80,
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 10,
                    flexDirection: 'row'
                }}>
                    <View style={{ width: '30%', borderRightWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginTop: 5, flexDirection: 'row', paddingLeft: 5 }}>
                                <View style={{ bottom: 0 }}>
                                    <Text style={{ fontSize: 13, textAlign: 'left', color: '#898989' }}>R$</Text>
                                </View>
                                <Text style={{ fontSize: 19, textAlign: 'left', paddingTop: 10, color: '#898989', fontWeight: 'bold' }}>55,00</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5, flexDirection: 'row' }}>
                                <View style={{ bottom: 0 }}>
                                    <Text style={{ fontSize: 16, textAlign: 'left', color: '#898989' }}> 50 </Text>
                                </View>
                                <Text style={{ fontSize: 11, textAlign: 'left', color: '#898989' }}>Comentários</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ width: '70%', padding: 5 }}>
                        <Text style={{ fontSize: 13, textAlign: 'justify', color: '#898989' }}>tur adipiscing elit adipiscing elit adipiscing elit adipiscing elit, adipiscing elit adipiscing elit</Text>
                    </View>
                </View>

                <Pressable style={styles.button} onPress={() => handleNavigateToDetail(item.id!)}>
                    <Text style={styles.text}>COMPRAR RIFA</Text>
                </Pressable>

            </View>
        </View>
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

            <View style={styles.itemsContainer}>
                {/* <Carousel
                    data={raffles}
                    renderItem={renderItem}
                    sliderWidth={400}
                    itemWidth={300}
                    layout={'tinder'} layoutCardOffset={`9`}
                /> */}
                <FlatList
                    data={raffles}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    onScroll={onScroll}
                    onEndReached={getMoreRaffles}
                    ListHeaderComponent={headerListRaffles}
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
        backgroundColor: '#3d014c',
    },

    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 7
    },

    lotteryContainer: {
        height: 'auto',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 5
    },

    lotteryInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 8,
        margin: 15,
        marginBottom: 8,
        flexDirection: 'row',
        padding: 10,
        height: 'auto'
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

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#fb5b5a',
    },

    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default Raffles;