// @/components/widgets/TodoList/TodoList.jsx

import React from "react";
import "./TodoList.css";

import TodoCard from "../TodoCard/TodoCard";
import Modal from "@/components/common/Modal/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import { useTodoList } from "./useTodoList";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

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
    togglePin,
    toggleImportant,
  } = useTodoList();

  const messagesContent = () => {
    if (isLoading) {
      return (
        <div>
          <LoadingSpinner aria-label="loading" />
        </div>
      );
    }

    if (filteredTodos.length === 0)
      return <p className="no-message">該当する Todo がありません</p>;

    return (
      <Box sx={{ flexGrow: 3 }}>
        <Grid container spacing={2}>
          {filteredTodos.map((todo) => {
            return (
              <Grid size={{ xs: 12, md: 6 }} key={todo.id}>
                <TodoCard
                  body={todo.body}
                  date={todo.date}
                  id={todo.id}
                  pinned={todo.pinned}
                  completed={todo.completed}
                  important={todo.important}
                  onDelete={openModal}
                  onToggle={toggleTodo}
                  onPin={togglePin}
                  onImportant={toggleImportant}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
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
