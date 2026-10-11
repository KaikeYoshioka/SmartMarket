import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const listasRef = (uid) => collection(db, 'usuarios', uid, 'listas');

export function observarListas(uid, onChange, onError) {
  const q = query(listasRef(uid), orderBy('dataCriacao', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function criarLista(uid, nome) {
  return addDoc(listasRef(uid), { nome: nome.trim(), dataCriacao: serverTimestamp() });
}

export function renomearLista(uid, listaId, nome) {
  return updateDoc(doc(db, 'usuarios', uid, 'listas', listaId), { nome: nome.trim() });
}

export async function excluirLista(uid, listaId) {
  const listaDoc = doc(db, 'usuarios', uid, 'listas', listaId);
  const produtos = await getDocs(collection(listaDoc, 'produtos'));
  const batch = writeBatch(db);
  produtos.forEach((p) => batch.delete(p.ref));
  batch.delete(listaDoc);
  await batch.commit();
}
