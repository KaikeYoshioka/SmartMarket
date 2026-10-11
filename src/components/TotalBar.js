import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme';
import { formatarMoeda } from '../utils/format';

export default function TotalBar({ resumo }) {
  return (
    <View style={styles.barra}>
      <View>
        <Text style={styles.rotulo}>Total da lista</Text>
        <Text style={styles.total}>{formatarMoeda(resumo.totalGeral)}</Text>
      </View>
      <View style={styles.direita}>
        <Text style={styles.rotulo}>No carrinho</Text>
        <Text style={styles.carrinho}>{formatarMoeda(resumo.totalComprado)}</Text>
        <Text style={styles.contagem}>
          {resumo.itensComprados}/{resumo.itens} itens
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.primariaEscura,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rotulo: { color: '#C8E6C9', fontSize: 13 },
  total: { color: '#FFF', fontSize: 26, fontWeight: '800' },
  direita: { alignItems: 'flex-end' },
  carrinho: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  contagem: { color: '#C8E6C9', fontSize: 12 },
});
