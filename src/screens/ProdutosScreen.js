import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { alternarComprado, excluirProduto, observarProdutos } from '../services/produtosService';
import ProdutoItem from '../components/ProdutoItem';
import TotalBar from '../components/TotalBar';
import { cores } from '../theme';
import { calcularResumo } from '../utils/format';

export default function ProdutosScreen({ navigation, route }) {
  const { listaId, nomeLista } = route.params;
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // onSnapshot mantém a lista (e o total) sincronizados em tempo real com o Firestore
    const unsubscribe = observarProdutos(
      user.uid,
      listaId,
      (dados) => {
        setProdutos(dados);
        setCarregando(false);
      },
      (e) => {
        setCarregando(false);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.\n' + e.message);
      }
    );
    return unsubscribe;
  }, [user.uid, listaId]);

  // Pendentes primeiro, comprados no final (mantendo a ordem de adição)
  const produtosOrdenados = useMemo(
    () => [...produtos].sort((a, b) => Number(a.comprado) - Number(b.comprado)),
    [produtos]
  );
  const resumo = useMemo(() => calcularResumo(produtos), [produtos]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: nomeLista,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Resumo', { listaId, nomeLista })} hitSlop={10}>
          <Text style={styles.headerBotao}>Resumo</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, listaId, nomeLista]);

  function toggle(produto) {
    alternarComprado(user.uid, listaId, produto.id, !produto.comprado).catch((e) =>
      Alert.alert('Erro', 'Não foi possível atualizar o produto.\n' + e.message)
    );
  }

  function confirmarExclusao(produto) {
    Alert.alert('Excluir produto', `Remover "${produto.nomeProduto}" da lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          excluirProduto(user.uid, listaId, produto.id).catch((e) =>
            Alert.alert('Erro', 'Não foi possível excluir.\n' + e.message)
          ),
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      <FlatList
        data={produtosOrdenados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={produtos.length === 0 ? styles.vazioContainer : styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🛒</Text>
            <Text style={styles.vazioTexto}>Lista vazia</Text>
            <Text style={styles.vazioDica}>Toque em "+" para adicionar produtos.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProdutoItem
            produto={item}
            onToggle={() => toggle(item)}
            onEditar={() => navigation.navigate('ProdutoForm', { listaId, produto: serializar(item) })}
            onExcluir={() => confirmarExclusao(item)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ProdutoForm', { listaId })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <TotalBar resumo={resumo} />
    </SafeAreaView>
  );
}

// Params de navegação devem ser serializáveis (Timestamp do Firestore não é)
function serializar({ id, nomeProduto, quantidade, precoUnitario }) {
  return { id, nomeProduto, quantidade, precoUnitario };
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.primariaEscura },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  headerBotao: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  lista: { padding: 16, paddingBottom: 90, backgroundColor: cores.fundo, flexGrow: 1 },
  vazioContainer: { flexGrow: 1, justifyContent: 'center', backgroundColor: cores.fundo },
  vazio: { alignItems: 'center', padding: 24 },
  vazioEmoji: { fontSize: 48 },
  vazioTexto: { fontSize: 17, fontWeight: '600', color: cores.texto, marginTop: 12 },
  vazioDica: { color: cores.textoSecundario, marginTop: 6 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 110,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabTexto: { color: '#FFF', fontSize: 32, fontWeight: '400', marginTop: -2 },
});
