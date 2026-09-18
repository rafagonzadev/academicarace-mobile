import { View, Text, StyleSheet } from 'react-native';

export default function Chat() {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Chat</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    texto: {
        fontSize: 24,
        color: '#4db6ac',
        fontWeight: 'bold',
    },
});