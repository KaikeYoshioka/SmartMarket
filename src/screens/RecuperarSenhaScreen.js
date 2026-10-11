import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import FormContainer from '../components/FormContainer';
import Botao from '../components/Botao';
import { cores, estilosComuns } from '../theme';
import { mensagemErroAuth } from '../utils/format';

export default function RecuperarSenhaScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    if (!email.trim()) return setErro('Informe o e-mail cadastrado.');

    setErro('');
    setCarregando(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'E-mail enviado',
        'Se houver uma conta com esse e-mail, você receberá um link para redefinir a senha. Verifique também a caixa de spam.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      setErro(mensagemErroAuth(e));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <FormContainer>
      <Text style={styles.texto}>
        Digite o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
      </Text>

      <Text style={estilosComuns.label}>E-mail</Text>
      <TextInput
        style={estilosComuns.input}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={enviar}
      />

      {!!erro && <Text style={estilosComuns.erro}>{erro}</Text>}

      <Botao titulo="Enviar link de recuperação" onPress={enviar} carregando={carregando} />
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  texto: { fontSize: 15, color: cores.textoSecundario, marginBottom: 20, lineHeight: 22 },
});
