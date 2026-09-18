import React, { createContext, useContext, useState, useMemo } from 'react';

type RegistroDraft = {
    titulo: string;
    descricao: string;
    fotoUri: string | null;
    metodoId: number | null;
    metodoNome: string | null;
    duracaoMinutos: number | null;
};

const draftInicial: RegistroDraft = {
    titulo: '',
    descricao: '',
    fotoUri: null,
    metodoId: null,
    metodoNome: null,
    duracaoMinutos: null,
};

type RegistroDraftContextValue = RegistroDraft & {
    setTitulo: (titulo: string) => void;
    setDescricao: (descricao: string) => void;
    setFotoUri: (uri: string | null) => void;
    setMetodo: (id: number | null, nome: string | null) => void;
    setDuracaoMinutos: (minutos: number | null) => void;
    reset: () => void;
};

const RegistroDraftContext = createContext<RegistroDraftContextValue | null>(null);

export function RegistroDraftProvider({ children }: { children: React.ReactNode }) {
    const [draft, setDraft] = useState<RegistroDraft>(draftInicial);

    const value = useMemo<RegistroDraftContextValue>(() => ({
        ...draft,
        setTitulo: (titulo) => setDraft((d) => ({ ...d, titulo })),
        setDescricao: (descricao) => setDraft((d) => ({ ...d, descricao })),
        setFotoUri: (fotoUri) => setDraft((d) => ({ ...d, fotoUri })),
        setMetodo: (metodoId, metodoNome) => setDraft((d) => ({ ...d, metodoId, metodoNome })),
        setDuracaoMinutos: (duracaoMinutos) => setDraft((d) => ({ ...d, duracaoMinutos })),
        reset: () => setDraft(draftInicial),
    }), [draft]);

    return (
        <RegistroDraftContext.Provider value={value}>
            {children}
        </RegistroDraftContext.Provider>
    );
}

export function useRegistroDraft() {
    const context = useContext(RegistroDraftContext);
    if (!context) {
        throw new Error('useRegistroDraft precisa ser usado dentro de RegistroDraftProvider');
    }
    return context;
}
