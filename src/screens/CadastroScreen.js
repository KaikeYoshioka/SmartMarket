import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import FormContainer from '../components/FormContainer';
import Botao from '../components/Botao';
import { estilosComuns } from '../theme';
import { mensagemErroAuth } from '../utils/format';

export default function CadastroScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!email.trim() || !senha || !confirmacao) return setErro('Preencha todos os campos.');
    if (senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmacao) return setErro('As senhas não coincidem.');

    setErro('');
    setCarregando(true);
    try {
      // Após criar a conta o Firebase já loga o usuário automaticamente
      await createUserWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      setErro(mensagemErroAuth(e));
      setCarregando(false);
    }
  }

  return (
    <FormContainer>
      <Text style={estilosComuns.label}>E-mail</Text>
      <TextInput
        style={estilosComuns.input}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={estilosComuns.label}>Senha</Text>
      <TextInput
        style={estilosComuns.input}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={estilosComuns.label}>Confirmar senha</Text>
      <TextInput
        style={estilosComuns.input}
        placeholder="Repita a senha"
        secureTextEntry
        value={confirmacao}
        onChangeText={setConfirmacao}
        onSubmitEditing={cadastrar}
      />

      {!!erro && <Text style={estilosComuns.erro}>{erro}</Text>}

      <Botao titulo="Criar conta" onPress={cadastrar} carregando={carregando} />
    </FormContainer>
  );
}
