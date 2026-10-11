import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores } from '../theme';
import { formatarMoeda, subtotal } from '../utils/format';

export default function ProdutoItem({ produto, onToggle, onEditar, onExcluir }) {
  const { comprado } = produto;

  return (
    <TouchableOpacity
      style={[styles.card, comprado && styles.cardComprado]}
      onPress={onEditar}
      activeOpacity={0.7}
    >
      <TouchableOpacity onPress={onToggle} hitSlop={10} style={[styles.check, comprado && styles.checkMarcado]}>
        {comprado && <Text style={styles.checkIcone}>✓</Text>}
      </TouchableOpacity>

      <View style={[styles.info, comprado && styles.infoComprado]}>
        <Text style={[styles.nome, comprado && styles.riscado]} numberOfLines={2}>
          {produto.nomeProduto}
        </Text>
        <Text style={[styles.detalhe, comprado && styles.riscado]}>
          {produto.quantidade} × {formatarMoeda(produto.precoUnitario)}
        </Text>
      </View>

      <Text style={[styles.subtotal, comprado && styles.subtotalComprado]}>{formatarMoeda(subtotal(produto))}</Text>

      <TouchableOpacity onPress={onExcluir} hitSlop={10} style={styles.excluir}>
        <Text style={styles.excluirIcone}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cardComprado: { backgroundColor: cores.primariaClara, borderColor: '#C8E6C9' },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMarcado: { backgroundColor: cores.primaria },
  checkIcone: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  info: { flex: 1 },
  infoComprado: { opacity: 0.55 },
  nome: { fontSize: 16, fontWeight: '600', color: cores.texto },
  detalhe: { fontSize: 14, color: cores.textoSecundario, marginTop: 2 },
  riscado: { textDecorationLine: 'line-through' },
  subtotal: { fontSize: 16, fontWeight: '700', color: cores.texto, marginLeft: 8 },
  subtotalComprado: { color: cores.primaria },
  excluir: { marginLeft: 10 },
  excluirIcone: { fontSize: 18 },
});
