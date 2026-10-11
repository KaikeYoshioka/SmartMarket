import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cores, estilosComuns } from '../theme';


export default function NomeModal({ visivel, titulo, valorInicial = '', onConfirmar, onCancelar }) {
  const [nome, setNome] = useState(valorInicial);

  useEffect(() => {
    if (visivel) setNome(valorInicial);
  }, [visivel, valorInicial]);

  function confirmar() {
    if (nome.trim()) onConfirmar(nome.trim());
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}>
      <KeyboardAvoidingView style={styles.fundo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.caixa}>
          <Text style={styles.titulo}>{titulo}</Text>
          <TextInput
            style={estilosComuns.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome da lista"
            autoFocus
            onSubmitEditing={confirmar}
          />
          <View style={styles.acoes}>
            <TouchableOpacity onPress={onCancelar} style={styles.acao}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmar} style={styles.acao}>
              <Text style={styles.salvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  caixa: { backgroundColor: cores.card, borderRadius: 14, padding: 20 },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, marginBottom: 14 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end' },
  acao: { paddingVertical: 8, paddingHorizontal: 14 },
  cancelar: { color: cores.textoSecundario, fontSize: 16, fontWeight: '600' },
  salvar: { color: cores.primaria, fontSize: 16, fontWeight: '700' },
});
