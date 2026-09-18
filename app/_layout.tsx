import { Stack } from 'expo-router';
import { Keyboard, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { RegistroDraftProvider } from '../context/RegistroDraftContext';

export default function Layout() {
    const conteudo = (
        <RegistroDraftProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </RegistroDraftProvider>
    );

    // No celular, tocar fora de um campo de texto fecha o teclado — sem isso
    // era preciso achar um botão "Voltar" ou apertar Enter pra fechar.
    if (Platform.OS === 'web') {
        return conteudo;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>{conteudo}</View>
        </TouchableWithoutFeedback>
    );
}
