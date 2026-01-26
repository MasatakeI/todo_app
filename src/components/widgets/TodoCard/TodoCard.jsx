import React from "react";
import "./TodoCard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faToggleOff,
  faToggleOn,
  faTrash,
  faThumbTack,
  faThumbtackSlash,
} from "@fortawesome/free-solid-svg-icons";

import Tooltip from "@mui/material/Tooltip";

const TodoCard = ({
  body,
  date,
  id,
  completed,
  pinned,
  onPin,
  onDelete,
  onToggle,
}) => {
  const toggleText = completed ? "未完了に戻す" : "完了にする";
  const pinText = pinned ? "未固定に戻す" : "固定にする";

  return (
    <div
      className={`todo-card ${completed ? "completed" : ""} ${pinned ? "pinned" : ""}`}
    >
      <div className="todo-header">
        <div className={`todo-date ${completed ? "completed" : ""}`}>
          {date}
        </div>

        <div className="todo-button-container">
          <Tooltip title={pinText}>
            <button
              className="todo-button pinned"
              onClick={() => onPin(id)}
              aria-label="固定"
            >
              <FontAwesomeIcon icon={pinned ? faThumbTack : faThumbtackSlash} />
            </button>
          </Tooltip>

          <Tooltip title="削除する">
            <button
              className="todo-button delete"
              onClick={() => onDelete(id)}
              aria-label="削除"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Tooltip>

          <Tooltip title={toggleText}>
            <button
              className="todo-button toggle"
              onClick={() => onToggle(id)}
              aria-label={toggleText}
            >
              <FontAwesomeIcon icon={completed ? faToggleOn : faToggleOff} />
            </button>
          </Tooltip>
        </div>
      </div>

      <p className={`todo-body ${completed ? "completed" : ""}`}>{body}</p>
    </div>
  );
};

export default TodoCard;
