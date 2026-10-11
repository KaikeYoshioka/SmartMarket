import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { observarProdutos } from '../services/produtosService';
import { cores } from '../theme';
import { calcularResumo, formatarMoeda, subtotal } from '../utils/format';

export default function ResumoScreen({ route }) {
  const { listaId, nomeLista } = route.params;
  const { user } = useAuth();
  const [produtos, setProdutos] = useState(null);

  useEffect(() => {
    return observarProdutos(user.uid, listaId, setProdutos, (e) =>
      Alert.alert('Erro', 'Não foi possível carregar o resumo.\n' + e.message)
    );
  }, [user.uid, listaId]);

  const resumo = useMemo(() => calcularResumo(produtos ?? []), [produtos]);

  if (!produtos) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  const progresso = resumo.totalGeral > 0 ? resumo.totalComprado / resumo.totalGeral : 0;
  const comprados = produtos.filter((p) => p.comprado);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>{nomeLista}</Text>

      <View style={styles.destaque}>
        <Text style={styles.destaqueRotulo}>Gasto total da lista</Text>
        <Text style={styles.destaqueValor}>{formatarMoeda(resumo.totalGeral)}</Text>
      </View>

      <View style={styles.grade}>
        <Info rotulo="Produtos na lista" valor={resumo.itens} />
        <Info rotulo="Unidades no total" valor={formatarQtd(resumo.totalUnidades)} />
        <Info rotulo="Itens comprados" valor={resumo.itensComprados} />
        <Info rotulo="Itens pendentes" valor={resumo.itens - resumo.itensComprados} />
      </View>

      <View style={styles.card}>
        <Linha rotulo="Já no carrinho" valor={formatarMoeda(resumo.totalComprado)} destaque />
        <Linha rotulo="Falta comprar" valor={formatarMoeda(resumo.totalGeral - resumo.totalComprado)} />
        <View style={styles.barraFundo}>
          <View style={[styles.barraPreenchida, { width: `${Math.round(progresso * 100)}%` }]} />
        </View>
        <Text style={styles.progressoTexto}>{Math.round(progresso * 100)}% do valor já comprado</Text>
      </View>

      {comprados.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.secao}>Itens comprados</Text>
          {comprados.map((p) => (
            <Linha key={p.id} rotulo={`${formatarQtd(p.quantidade)}× ${p.nomeProduto}`} valor={formatarMoeda(subtotal(p))} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const formatarQtd = (n) => String(Math.round(n * 1000) / 1000).replace('.', ',');

function Info({ rotulo, valor }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoValor}>{valor}</Text>
      <Text style={styles.infoRotulo}>{rotulo}</Text>
    </View>
  );
}

function Linha({ rotulo, valor, destaque }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaRotulo} numberOfLines={1}>
        {rotulo}
      </Text>
      <Text style={[styles.linhaValor, destaque && { color: cores.primaria }]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 40 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  titulo: { fontSize: 22, fontWeight: '800', color: cores.texto, marginBottom: 12 },
  destaque: { backgroundColor: cores.primariaEscura, borderRadius: 14, padding: 20, marginBottom: 12 },
  destaqueRotulo: { color: '#C8E6C9', fontSize: 14 },
  destaqueValor: { color: '#FFF', fontSize: 34, fontWeight: '800', marginTop: 4 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  info: {
    width: '48.5%',
    backgroundColor: cores.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  infoValor: { fontSize: 26, fontWeight: '800', color: cores.primaria },
  infoRotulo: { fontSize: 13, color: cores.textoSecundario, marginTop: 2 },
  card: {
    backgroundColor: cores.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  secao: { fontSize: 16, fontWeight: '700', color: cores.texto, marginBottom: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  linhaRotulo: { flex: 1, fontSize: 15, color: cores.texto, marginRight: 12 },
  linhaValor: { fontSize: 15, fontWeight: '700', color: cores.texto },
  barraFundo: { height: 10, backgroundColor: cores.primariaClara, borderRadius: 5, marginTop: 12, overflow: 'hidden' },
  barraPreenchida: { height: '100%', backgroundColor: cores.primaria },
  progressoTexto: { fontSize: 13, color: cores.textoSecundario, marginTop: 6 },
});
