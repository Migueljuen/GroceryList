import { getApp } from '@react-native-firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from '@react-native-firebase/firestore';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: any;
}

const firestore = getFirestore(getApp());
const todosCollection = collection(firestore, 'todos');

// Create a new todo
export const addTodo = async (text: string): Promise<void> => {
  if (!text.trim()) return;

  await addDoc(todosCollection, {
    text: text.trim(),
    completed: false,
    createdAt: serverTimestamp(),
  });
};

// READ
export const subscribeTodos = (
  onUpdate: (todos: Todo[]) => void,
  onError?: (error: Error) => void
) => {
  const todosQuery = query(todosCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    todosQuery,
    (snapshot) => {
      const todosList: Todo[] = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];

      onUpdate(todosList);
    },
    (error) => {
      console.error('Error fetching todos:', error);
      onError?.(error);
    }
  );
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  const todoDoc = doc(firestore, 'todos', id);
  await deleteDoc(todoDoc);
};

