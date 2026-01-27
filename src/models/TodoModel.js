// models/TodoModel.js

import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { todosCollectionRef } from "@/firebase";
import { MODEL_ERROR_CODE, ModelError } from "./errors/ModelError";

import { format } from "date-fns";

export const createTodo = (id, data) => {
  if (
    !data ||
    typeof data.body !== "string" ||
    typeof data.date?.toDate !== "function"
  ) {
    throw new ModelError(MODEL_ERROR_CODE.INVALID_DATA);
  }

  const dateObj = format(data.date.toDate(), "yyyy/MM/dd HH:mm");
  return {
    id,
    body: data.body,
    date: dateObj,
    completed: data.completed ?? false,
    pinned: data.pinned ?? false,
    important: data.important ?? false,
  };
};

export const addTodo = async ({ body }) => {
  if (!body.trim()) {
    throw new ModelError(MODEL_ERROR_CODE.REQUIRED, "1文字以上の入力必須です");
  }

  const postData = {
    body,
    date: serverTimestamp(),
    completed: false,
    pinned: false,
    important: false,
  };

  const docRef = await addDoc(todosCollectionRef, postData);
  const snapShot = await getDoc(docRef);
  if (!snapShot.exists()) {
    throw new ModelError(MODEL_ERROR_CODE.NOT_FOUND);
  }

  const data = snapShot.data();

  const model = createTodo(docRef.id, data);
  return model;
};

export const fetchTodos = async () => {
  const q = query(todosCollectionRef, orderBy("date"));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.docs.length) {
    return [];
  }

  return querySnapshot.docs.map((doc) => {
    return createTodo(doc.id, doc.data());
  });
};

export const deleteTodo = async (id) => {
  const docRef = doc(todosCollectionRef, id);

  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new ModelError(MODEL_ERROR_CODE.NOT_FOUND);
  }

  const data = snapShot.data();

  const model = createTodo(docRef.id, data);
  await deleteDoc(docRef);
  return model;
};

const toggleField = async (id, field) => {
  const docRef = doc(todosCollectionRef, id);

  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new ModelError(MODEL_ERROR_CODE.NOT_FOUND);
  }

  const data = snapShot.data();

  const currentValue = data[field] ?? false;
  const updateValue = !currentValue;

  await updateDoc(docRef, { [field]: updateValue });

  const model = createTodo(docRef.id, {
    ...data,
    [field]: updateValue,
  });
  return model;
};

export const toggleCompleted = async (id) => {
  return toggleField(id, "completed");
};
export const togglePin = async (id) => {
  return toggleField(id, "pinned");
};

export const toggleImportant = async (id) => {
  return toggleField(id, "important");
};
