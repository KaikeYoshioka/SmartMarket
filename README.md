# SmartMarket 🛒

Aplicativo de lista de supermercado feito com **React Native (Expo)**, **Firebase Authentication** e **Cloud Firestore**.

## Funcionalidades

- Login com e-mail e senha, cadastro de conta e recuperação de senha por e-mail
- Sessão persistente (o usuário continua logado ao reabrir o app)
- Várias listas de compras por usuário (criar, renomear, excluir)
- Produtos com `nomeProduto`, `quantidade`, `precoUnitario` e `dataAdicao` (timestamp automático)
- Criar, editar e excluir produtos
- Total de cada produto (`quantidade × precoUnitario`) e total da lista, atualizados em tempo real (`onSnapshot`)
- **Extra:** marcar produtos como comprados (item riscado e destacado em verde) e tela de **Resumo da compra** com quantidade de produtos, unidades, itens comprados/pendentes e gasto total

## Estrutura

```
App.js                         Navegação (telas de login x telas do app)
src/config/firebaseConfig.js   Inicialização do Firebase (Auth + Firestore)
src/contexts/AuthContext.js    Usuário logado (onAuthStateChanged)
src/services/                  Acesso ao Firestore (listas e produtos)
src/screens/                   Login, Cadastro, RecuperarSenha, Listas, Produtos, ProdutoForm, Resumo
src/components/                Componentes reutilizáveis
src/utils/format.js            Moeda, conversão de números, cálculo dos totais
```

Modelo de dados no Firestore:

```
usuarios/{uid}/listas/{listaId}                       { nome, dataCriacao }
usuarios/{uid}/listas/{listaId}/produtos/{produtoId}  { nomeProduto, quantidade, precoUnitario, dataAdicao, comprado }
```

## Executando

```bash
npm install
npx expo start
```

Escaneie o QR Code com o app **Expo Go** (Android/iOS) ou pressione `a` para abrir no emulador Android.
