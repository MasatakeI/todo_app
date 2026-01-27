import React from "react";
import "./TodoCard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faToggleOff,
  faToggleOn,
  faTrash,
  faThumbTack,
  faThumbtackSlash,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

import Tooltip from "@mui/material/Tooltip";

const TodoCard = ({
  body,
  date,
  id,

  completed,
  pinned,
  important,

  onToggle,
  onPin,
  onImportant,

  onDelete,
}) => {
  const toggleText = completed ? "未完了に戻す" : "完了にする";
  const pinText = pinned ? "未固定に戻す" : "固定にする";
  const importantText = important ? "重要解除" : "重要にする";

  const iconButtons = [
    {
      title: importantText,
      class: "important",
      onClick: () => onImportant(id),
      label: importantText,
      icon: important ? faStar : faTag,
    },
    {
      title: pinText,
      class: "pin",
      onClick: () => onPin(id),
      label: "固定",
      icon: pinned ? faThumbTack : faThumbtackSlash,
    },
    {
      title: toggleText,
      class: "completed",
      onClick: () => onToggle(id),
      label: toggleText,
      icon: completed ? faToggleOn : faToggleOff,
    },
    {
      title: "削除する",
      class: "delete",
      onClick: () => onDelete(id),
      label: "削除",
      icon: faTrash,
    },
  ];

  return (
    <div
      className={`todo-card
    ${completed ? "is-completed" : ""}
    ${pinned ? "is-pinned" : ""}
    ${important ? "is-important" : ""}
  `}
    >
      <div className="todo-header">
        <div className={`todo-date ${completed ? "is-completed" : ""}`}>
          {date}
        </div>

        <div className="todo-button-container">
          {iconButtons.map((btn, index) => {
            return (
              <Tooltip title={btn.title} key={index}>
                <button
                  className={`todo-button ${btn.class}`}
                  onClick={btn.onClick}
                  aria-label={btn.label}
                >
                  <FontAwesomeIcon icon={btn.icon} />
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <p className={`todo-body ${completed ? "is-completed" : ""}`}>{body}</p>
    </div>
  );
};

export default TodoCard;
