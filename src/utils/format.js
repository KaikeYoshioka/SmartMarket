export function formatarMoeda(valor) {
  const numero = Number(valor) || 0;
  try {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch {
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  }
}

export function parseNumero(texto) {
  let limpo = String(texto ?? '').trim().replace(/\s/g, '');
  if (limpo.includes(',')) limpo = limpo.replace(/\./g, '').replace(',', '.');
  if (limpo === '' || !/^\d*\.?\d+$|^\d+\.$/.test(limpo)) return NaN;
  return Number(limpo);
}

export const subtotal = (produto) => (Number(produto.quantidade) || 0) * (Number(produto.precoUnitario) || 0);

export function calcularResumo(produtos) {
  return produtos.reduce(
    (acc, p) => {
      const valor = subtotal(p);
      acc.totalGeral += valor;
      acc.totalUnidades += Number(p.quantidade) || 0;
      if (p.comprado) {
        acc.totalComprado += valor;
        acc.itensComprados += 1;
      }
      return acc;
    },
    { totalGeral: 0, totalComprado: 0, totalUnidades: 0, itensComprados: 0, itens: produtos.length }
  );
}

export function mensagemErroAuth(error) {
  const mensagens = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/missing-email': 'Informe o e-mail.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Sem conexão com a internet.',
    'auth/invalid-api-key': 'Configuração do Firebase inválida (verifique o firebaseConfig.js).',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      'Configuração do Firebase inválida (verifique o firebaseConfig.js).',
  };
  return mensagens[error?.code] || 'Ocorreu um erro. Tente novamente.';
}
