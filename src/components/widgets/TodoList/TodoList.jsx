// @/components/widgets/TodoList/TodoList.jsx

import React from "react";
import "./TodoList.css";

import TodoCard from "../TodoCard/TodoCard";
import Modal from "@/components/common/Modal/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import { useTodoList } from "./useTodoList";

const TodoList = () => {
  const {
    isLoading,

    filteredTodos,
    modalMessage,
    modalOpen,
    closeModal,
    openModal,
    confirmDelete,
    toggleTodo,
  } = useTodoList();

  const messagesContent = () => {
    if (isLoading) return <LoadingSpinner />;

    if (filteredTodos.length === 0)
      return <p className="no-message">todos:0件</p>;

    return (
      <>
        {filteredTodos
          .slice()
          .reverse()
          .map((todo) => {
            return (
              <TodoCard
                key={todo.id}
                body={todo.body}
                date={todo.date}
                id={todo.id}
                completed={todo.completed}
                onDelete={openModal}
                onToggle={toggleTodo}
              />
            );
          })}
      </>
    );
  };

  return (
    <div className="todo-list">
      {messagesContent()}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={"削除しますか?"}
        message={modalMessage}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TodoList;
