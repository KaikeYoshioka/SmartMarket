import { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { criarProduto, editarProduto } from '../services/produtosService';
import FormContainer from '../components/FormContainer';
import Botao from '../components/Botao';
import { cores, estilosComuns } from '../theme';
import { formatarMoeda, parseNumero } from '../utils/format';

const paraTexto = (n) => (n === undefined || n === null ? '' : String(n).replace('.', ','));

export default function ProdutoFormScreen({ navigation, route }) {
  const { listaId, produto } = route.params;
  const editando = !!produto;
  const { user } = useAuth();

  const [nomeProduto, setNomeProduto] = useState(produto?.nomeProduto ?? '');
  const [quantidade, setQuantidade] = useState(editando ? paraTexto(produto.quantidade) : '1');
  const [precoUnitario, setPrecoUnitario] = useState(paraTexto(produto?.precoUnitario));
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: editando ? 'Editar produto' : 'Novo produto' });
  }, [navigation, editando]);

  const qtd = parseNumero(quantidade);
  const preco = parseNumero(precoUnitario);
  const previa = Number.isFinite(qtd) && Number.isFinite(preco) ? qtd * preco : 0;

  function validar() {
    const novosErros = {};
    if (!nomeProduto.trim()) novosErros.nomeProduto = 'Informe o nome do produto.';
    if (!Number.isFinite(qtd) || qtd <= 0) novosErros.quantidade = 'Informe uma quantidade maior que zero.';
    if (!Number.isFinite(preco) || preco < 0) novosErros.precoUnitario = 'Informe um preço válido (ex.: 4,99).';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvar() {
    if (!validar()) return;
    setSalvando(true);
    const dados = { nomeProduto, quantidade: qtd, precoUnitario: preco };
    try {
      if (editando) await editarProduto(user.uid, listaId, produto.id, dados);
      else await criarProduto(user.uid, listaId, dados);
      navigation.goBack();
    } catch (e) {
      setSalvando(false);
      Alert.alert('Erro', 'Não foi possível salvar o produto.\n' + e.message);
    }
  }

  return (
    <FormContainer>
      <Text style={estilosComuns.label}>Nome do produto *</Text>
      <TextInput
        style={[estilosComuns.input, erros.nomeProduto && styles.inputErro]}
        placeholder="Ex.: Arroz 5kg"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        autoFocus={!editando}
      />
      {!!erros.nomeProduto && <Text style={styles.erro}>{erros.nomeProduto}</Text>}

      <View style={styles.linha}>
        <View style={styles.coluna}>
          <Text style={estilosComuns.label}>Quantidade *</Text>
          <TextInput
            style={[estilosComuns.input, erros.quantidade && styles.inputErro]}
            placeholder="1"
            keyboardType="decimal-pad"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          {!!erros.quantidade && <Text style={styles.erro}>{erros.quantidade}</Text>}
        </View>
        <View style={styles.coluna}>
          <Text style={estilosComuns.label}>Preço unitário (R$) *</Text>
          <TextInput
            style={[estilosComuns.input, erros.precoUnitario && styles.inputErro]}
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={precoUnitario}
            onChangeText={setPrecoUnitario}
          />
          {!!erros.precoUnitario && <Text style={styles.erro}>{erros.precoUnitario}</Text>}
        </View>
      </View>

      <View style={styles.previa}>
        <Text style={styles.previaRotulo}>Total do produto</Text>
        <Text style={styles.previaValor}>{formatarMoeda(previa)}</Text>
      </View>

      <Botao titulo={editando ? 'Salvar alterações' : 'Adicionar à lista'} onPress={salvar} carregando={salvando} />
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 12 },
  coluna: { flex: 1 },
  inputErro: { borderColor: cores.erro },
  erro: { color: cores.erro, fontSize: 13, marginTop: -6, marginBottom: 10 },
  previa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.primariaClara,
    borderRadius: 10,
    padding: 16,
    marginVertical: 12,
  },
  previaRotulo: { fontSize: 15, color: cores.primariaEscura, fontWeight: '600' },
  previaValor: { fontSize: 22, color: cores.primariaEscura, fontWeight: '800' },
});
