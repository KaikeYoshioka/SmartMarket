import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { criarLista, excluirLista, observarListas, renomearLista } from '../services/listasService';
import NomeModal from '../components/NomeModal';
import { cores, estilosComuns } from '../theme';

export default function ListasScreen({ navigation }) {
  const { user } = useAuth();
  const [listas, setListas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  // null = modal fechado; { id: null } = nova lista; { id, nome } = renomear
  const [editando, setEditando] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={confirmarSair} hitSlop={10}>
          <Text style={styles.sair}>Sair</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = observarListas(
      user.uid,
      (dados) => {
        setListas(dados);
        setCarregando(false);
      },
      (e) => {
        setCarregando(false);
        Alert.alert('Erro', 'Não foi possível carregar suas listas.\n' + e.message);
      }
    );
    return unsubscribe;
  }, [user.uid]);

  function confirmarSair() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut(auth) },
    ]);
  }

  async function salvarLista(nome) {
    const alvo = editando;
    setEditando(null);
    try {
      if (alvo.id) await renomearLista(user.uid, alvo.id, nome);
      else await criarLista(user.uid, nome);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a lista.\n' + e.message);
    }
  }

  function opcoesLista(lista) {
    Alert.alert(lista.nome, 'O que deseja fazer?', [
      { text: 'Renomear', onPress: () => setEditando({ id: lista.id, nome: lista.nome }) },
      { text: 'Excluir', style: 'destructive', onPress: () => confirmarExclusao(lista) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function confirmarExclusao(lista) {
    Alert.alert('Excluir lista', `Excluir "${lista.nome}" e todos os seus produtos?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          excluirLista(user.uid, lista.id).catch((e) => Alert.alert('Erro', 'Não foi possível excluir.\n' + e.message)),
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
    <SafeAreaView style={estilosComuns.tela} edges={['bottom']}>
      <Text style={styles.ola}>Olá, {user.email}</Text>
      <FlatList
        data={listas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listas.length === 0 ? styles.vazioContainer : styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>📝</Text>
            <Text style={styles.vazioTexto}>Você ainda não tem listas.</Text>
            <Text style={styles.vazioDica}>Toque em "+ Nova lista" para começar.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Produtos', { listaId: item.id, nomeLista: item.nome })}
            onLongPress={() => opcoesLista(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitulo}>{item.nome}</Text>
            <TouchableOpacity onPress={() => opcoesLista(item)} hitSlop={12}>
              <Text style={styles.mais}>⋮</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setEditando({ id: null, nome: '' })} activeOpacity={0.8}>
        <Text style={styles.fabTexto}>+ Nova lista</Text>
      </TouchableOpacity>

      <NomeModal
        visivel={!!editando}
        titulo={editando?.id ? 'Renomear lista' : 'Nova lista'}
        valorInicial={editando?.nome ?? ''}
        onConfirmar={salvarLista}
        onCancelar={() => setEditando(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  sair: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  ola: { paddingHorizontal: 16, paddingTop: 14, color: cores.textoSecundario },
  lista: { padding: 16, paddingBottom: 100 },
  vazioContainer: { flexGrow: 1, justifyContent: 'center' },
  vazio: { alignItems: 'center', padding: 24 },
  vazioEmoji: { fontSize: 48 },
  vazioTexto: { fontSize: 17, fontWeight: '600', color: cores.texto, marginTop: 12 },
  vazioDica: { color: cores.textoSecundario, marginTop: 6 },
  card: {
    backgroundColor: cores.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cardTitulo: { flex: 1, fontSize: 17, fontWeight: '600', color: cores.texto },
  mais: { fontSize: 22, color: cores.textoSecundario, paddingHorizontal: 6 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: cores.primaria,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabTexto: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
