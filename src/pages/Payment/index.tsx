import React, { useState, useEffect } from 'react';
import { Alert, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { MainContainer, Title, HeaderCheckout } from './styles';

interface Params {
    total: number;
}

const Payment = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const [idPagamento, setIdPagamento] = useState("1");
    const [emailPagamento, setEmailPagamento] = useState("meuemail@gmail.com");
    const [descricaoPagamento, setDescricaoPagamento] = useState("Venda de produto digital");
    const [vlrPagamento, setVlrPagamento] = useState("5.00");
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        setVlrPagamento(String(routeParams.total));
    }, []);

    function stateChange(state: any) {
        switch (state.title) {
            case 'success':
                setShowCheckout(false)
                Alert.alert("Pagamento aprovado!", `Recebemos seu pagamento de ${vlrPagamento}`)
                break;
            case 'pending':
                setShowCheckout(false)
                Alert.alert("Pagamento pendente!", `Seu pagamento de ${vlrPagamento} está pendente de processamento, assim que for processado seguiremos com o pedido!`)
                break;
            case 'failure':
                setShowCheckout(false)
                Alert.alert("Pagamento não aprovado!", 'Verifique os dados e tente novamente')
                break;
        }
    }

    function handleNavigateBack() {
        navigation.goBack();
    }

    return (
        <MainContainer>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <HeaderCheckout>
                    <TouchableOpacity onPress={() => handleNavigateBack()}>
                        <Icon name='arrow-left' size={20} color='#fff' />
                    </TouchableOpacity>
                    <Title>Pagamento do Pedido</Title>
                </HeaderCheckout>
                <WebView
                    source={{ uri: `http://192.168.0.10:3333/payments/checkout/${idPagamento}/${emailPagamento}/${descricaoPagamento}/${vlrPagamento}` }}
                    onNavigationStateChange={state => stateChange(state)}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator size='large' color='#fff' style={{ marginBottom: 15, paddingTop: 10 }}></ActivityIndicator>}
                />
            </View>
        </MainContainer>
    )
};

export default Payment;