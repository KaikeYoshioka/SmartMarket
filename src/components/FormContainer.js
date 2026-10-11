import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { cores } from '../theme';

// Container dos formulários: sobe o conteúdo quando o teclado abre
export default function FormContainer({ children, centralizado = false }) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.conteudo, centralizado && styles.centralizado]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 24, flexGrow: 1 },
  centralizado: { justifyContent: 'center' },
});
