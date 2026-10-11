import { StyleSheet } from 'react-native';

export const cores = {
  primaria: '#2E7D32',
  primariaEscura: '#1B5E20',
  primariaClara: '#E8F5E9',
  fundo: '#F5F7F5',
  card: '#FFFFFF',
  texto: '#1C1C1C',
  textoSecundario: '#6B6B6B',
  borda: '#DDE3DD',
  erro: '#C62828',
};

export const estilosComuns = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  input: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
    marginBottom: 12,
  },
  label: { fontSize: 14, color: cores.textoSecundario, marginBottom: 6, fontWeight: '600' },
  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  link: { color: cores.primaria, fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 16 },
  erro: { color: cores.erro, marginBottom: 12, textAlign: 'center' },
});
