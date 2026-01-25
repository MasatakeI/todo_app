import React from "react";
import "./TodoCard.css";

const TodoCard = ({ body, date, id, completed, onDelete, onToggle }) => {
  const toggleText = completed ? "未完了に戻す" : "完了にする";

  return (
    <div className="todo-card">
      <div className="todo-header">
        <div className="todo-date">{date}</div>

        <div className="todo-button-container">
          <button className="todo-button delete" onClick={() => onDelete(id)}>
            削除
          </button>
          <button className="todo-button toggle" onClick={() => onToggle(id)}>
            {toggleText}
          </button>
        </div>
      </div>

      <p className="todo-body">{body}</p>
    </div>
  );
};

export default TodoCard;
