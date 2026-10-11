import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { cores } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import ListasScreen from './src/screens/ListasScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import ProdutoFormScreen from './src/screens/ProdutoFormScreen';
import ResumoScreen from './src/screens/ResumoScreen';

const Stack = createNativeStackNavigator();

const opcoesHeader = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: cores.fundo },
};

function Rotas() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  // Com usuário logado mostra as telas do app; senão, as telas de autenticação
  return (
    <Stack.Navigator screenOptions={opcoesHeader}>
      {user ? (
        <>
          <Stack.Screen name="Listas" component={ListasScreen} options={{ title: 'Minhas listas' }} />
          <Stack.Screen name="Produtos" component={ProdutosScreen} />
          <Stack.Screen name="ProdutoForm" component={ProdutoFormScreen} />
          <Stack.Screen name="Resumo" component={ResumoScreen} options={{ title: 'Resumo da compra' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} options={{ title: 'Recuperar senha' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Rotas />
          <StatusBar style="light" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
