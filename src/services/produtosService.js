import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const produtosRef = (uid, listaId) => collection(db, 'usuarios', uid, 'listas', listaId, 'produtos');
const produtoDoc = (uid, listaId, produtoId) =>
  doc(db, 'usuarios', uid, 'listas', listaId, 'produtos', produtoId);

export function observarProdutos(uid, listaId, onChange, onError) {
  const q = query(produtosRef(uid, listaId), orderBy('dataAdicao', 'asc'));
  return onSnapshot(
    q,
    // serverTimestamps 'estimate' evita dataAdicao nula enquanto o servidor não confirma a escrita
    (snapshot) =>
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))),
    onError
  );
}

export function criarProduto(uid, listaId, { nomeProduto, quantidade, precoUnitario }) {
  return addDoc(produtosRef(uid, listaId), {
    nomeProduto: nomeProduto.trim(),
    quantidade,
    precoUnitario,
    dataAdicao: serverTimestamp(),
    comprado: false,
  });
}

export function editarProduto(uid, listaId, produtoId, { nomeProduto, quantidade, precoUnitario }) {
  return updateDoc(produtoDoc(uid, listaId, produtoId), {
    nomeProduto: nomeProduto.trim(),
    quantidade,
    precoUnitario,
  });
}

export function excluirProduto(uid, listaId, produtoId) {
  return deleteDoc(produtoDoc(uid, listaId, produtoId));
}

export function alternarComprado(uid, listaId, produtoId, comprado) {
  return updateDoc(produtoDoc(uid, listaId, produtoId), { comprado });
}
