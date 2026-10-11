import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import FormContainer from '../components/FormContainer';
import Botao from '../components/Botao';
import { cores, estilosComuns } from '../theme';
import { mensagemErroAuth } from '../utils/format';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      setErro(mensagemErroAuth(e));
      setCarregando(false);
    }
  }

  return (
    <FormContainer centralizado>
      <StatusBar style="dark" />
      <View style={styles.cabecalho}>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.titulo}>SmartMarket</Text>
        <Text style={styles.subtitulo}>Sua lista de compras inteligente</Text>
      </View>

      <Text style={estilosComuns.label}>E-mail</Text>
      <TextInput
        style={estilosComuns.input}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={estilosComuns.label}>Senha</Text>
      <TextInput
        style={estilosComuns.input}
        placeholder="Sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        onSubmitEditing={entrar}
      />

      {!!erro && <Text style={estilosComuns.erro}>{erro}</Text>}

      <Botao titulo="Entrar" onPress={entrar} carregando={carregando} />

      <Text style={estilosComuns.link} onPress={() => navigation.navigate('RecuperarSenha', { email })}>
        Esqueci minha senha
      </Text>
      <Text style={styles.cadastro}>
        Não tem conta?{' '}
        <Text style={styles.cadastroLink} onPress={() => navigation.navigate('Cadastro')}>
          Cadastre-se
        </Text>
      </Text>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  cabecalho: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 56 },
  titulo: { fontSize: 32, fontWeight: '800', color: cores.primaria, marginTop: 8 },
  subtitulo: { fontSize: 15, color: cores.textoSecundario, marginTop: 4 },
  cadastro: { textAlign: 'center', marginTop: 24, color: cores.textoSecundario, fontSize: 15 },
  cadastroLink: { color: cores.primaria, fontWeight: '700' },
});
