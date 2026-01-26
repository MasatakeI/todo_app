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
    !data.body ||
    !data.date ||
    typeof data.body !== "string" ||
    typeof data.date.toDate !== "function" ||
    typeof data.completed !== "boolean" ||
    typeof data.pinned !== "boolean"
  ) {
    throw new ModelError(MODEL_ERROR_CODE.INVALID_DATA);
  }

  const dateObj = format(data.date.toDate(), "yyyy/MM/dd HH:mm");
  return {
    id,
    body: data.body,
    date: dateObj,
    completed: data.completed,
    pinned: data.pinned,
  };
};

export const saveTodo = async ({ body }) => {
  if (!body.trim()) {
    throw new ModelError(MODEL_ERROR_CODE.REQUIRED, "1文字以上の入力必須です");
  }

  const postData = {
    body,
    date: serverTimestamp(),
    completed: false,
    pinned: false,
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

export const toggleCompleted = async (id) => {
  const docRef = doc(todosCollectionRef, id);

  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new ModelError(MODEL_ERROR_CODE.NOT_FOUND);
  }

  const data = snapShot.data();

  await updateDoc(docRef, { completed: !data.completed });

  const model = createTodo(docRef.id, {
    ...data,
    completed: !data.completed,
  });
  return model;
};

export const togglePin = async (id) => {
  const docRef = doc(todosCollectionRef, id);

  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new ModelError(MODEL_ERROR_CODE.NOT_FOUND);
  }

  const data = snapShot.data();

  await updateDoc(docRef, { pinned: !data.pinned });

  const model = createTodo(docRef.id, {
    ...data,
    pinned: !data.pinned,
  });
  return model;
};
