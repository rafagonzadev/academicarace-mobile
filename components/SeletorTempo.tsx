import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    minutos: number;
    onChange: (minutos: number) => void;
};

export default function SeletorTempo({ minutos, onChange }: Props) {
    const [horas, setHoras] = useState(Math.floor(minutos / 60));
    const [mins, setMins] = useState(minutos % 60);

    // Ressincroniza se o valor mudar por fora (ex: reset do rascunho).
    useEffect(() => {
        if (horas * 60 + mins !== minutos) {
            setHoras(Math.floor(minutos / 60));
            setMins(minutos % 60);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minutos]);

    const atualizar = (novasHoras: number, novosMins: number) => {
        setHoras(novasHoras);
        setMins(novosMins);
        onChange(novasHoras * 60 + novosMins);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardLabel}>Insira o tempo</Text>
            <View style={styles.seletores}>
                <Campo label="Hora" valor={horas} onChange={(v) => atualizar(v, mins)} max={23} />
                <Text style={styles.doisPontos}>:</Text>
                <Campo label="Minuto" valor={mins} onChange={(v) => atualizar(horas, v)} max={59} />
            </View>
            <View style={styles.setinhas}>
                <Setinhas valor={horas} onChange={(v) => atualizar(v, mins)} max={23} />
                <View style={{ width: 40 }} />
                <Setinhas valor={mins} onChange={(v) => atualizar(horas, v)} max={59} />
            </View>
        </View>
    );
}

function Campo({ label, valor, onChange, max }: { label: string; valor: number; onChange: (v: number) => void; max: number }) {
    const [texto, setTexto] = useState(String(valor).padStart(2, '0'));
    const [focado, setFocado] = useState(false);

    // Sincroniza quando o valor muda por fora (setinhas), mas nunca reformata
    // enquanto a pessoa está digitando.
    useEffect(() => {
        if (!focado) {
            setTexto(String(valor).padStart(2, '0'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valor]);

    const handleChangeText = (novoTexto: string) => {
        const digitos = novoTexto.replace(/[^0-9]/g, '').slice(0, 2);
        setTexto(digitos);
        if (digitos !== '') {
            onChange(Math.min(max, parseInt(digitos, 10)));
        }
    };

    const handleBlur = () => {
        setFocado(false);
        const numero = texto === '' ? 0 : Math.min(max, parseInt(texto, 10));
        onChange(numero);
        setTexto(String(numero).padStart(2, '0'));
    };

    return (
        <View style={styles.campo}>
            <TextInput
                style={[styles.campoInput, focado && styles.campoInputFocado]}
                value={texto}
                onFocus={() => setFocado(true)}
                onChangeText={handleChangeText}
                onBlur={handleBlur}
                selectTextOnFocus
                keyboardType="number-pad"
                maxLength={2}
            />
            <Text style={styles.campoLabel}>{label}</Text>
        </View>
    );
}

function Setinhas({ valor, onChange, max }: { valor: number; onChange: (v: number) => void; max: number }) {
    return (
        <View style={styles.setinhasColuna}>
            <TouchableOpacity onPress={() => onChange(valor >= max ? max : valor + 1)}>
                <Ionicons name="chevron-up" size={20} color="#4db6ac" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChange(valor <= 0 ? 0 : valor - 1)}>
                <Ionicons name="chevron-down" size={20} color="#4db6ac" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 13,
        color: '#888',
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    seletores: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    campo: {
        alignItems: 'center',
    },
    campoInput: {
        backgroundColor: '#e0f2f1',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 12,
        width: 76,
        height: 64,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    campoInputFocado: {
        borderColor: '#4db6ac',
    },
    campoLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
    },
    doisPontos: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    setinhas: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    setinhasColuna: {
        alignItems: 'center',
        gap: 4,
    },
});
