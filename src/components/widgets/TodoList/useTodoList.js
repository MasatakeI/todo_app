import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectError,
  selectIsLoading,
} from "@/redux/features/todos/todosSelector";
import { selectFilteredTodos } from "@/redux/features/filter/filterSelector";

import {
  deleteTodoAsync,
  togglePinAsync,
  toggleCompletedAsync,
  toggleImportantAsync,
} from "@/redux/features/todos/todosThunks";

export const useTodoList = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const filteredTodos = useSelector(selectFilteredTodos);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [targetId, setTargetId] = useState(null);

  const closeModal = () => setModalOpen(false);

  const openModal = (id) => {
    const todo = filteredTodos.find((t) => t.id === id);
    if (!todo) return;

    setModalOpen(true);
    setTargetId(todo.id);
    setModalMessage(todo.body);
  };

  const confirmDelete = () => {
    dispatch(deleteTodoAsync({ id: targetId }));
    closeModal();
  };

  const toggleTodo = (id) => {
    dispatch(toggleCompletedAsync({ id }));
  };

  const togglePin = (id) => {
    dispatch(togglePinAsync({ id }));
  };

  const toggleImportant = (id) => {
    dispatch(toggleImportantAsync({ id }));
  };

  return {
    isLoading,
    error,
    filteredTodos,
    modalMessage,
    modalOpen,
    closeModal,
    openModal,
    confirmDelete,
    toggleTodo,
    togglePin,
    toggleImportant,
  };
};
