//src/components/common/BackToHomeLink/BackToHomeLink.jsx

import React from "react";
import "./BackToHomeLink.css";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faH, faHome } from "@fortawesome/free-solid-svg-icons";

import Tooltip from "@mui/material/Tooltip";

const BackToHomeLink = () => {
  return (
    <div className="link-container">
      <hr />
      <Tooltip title="ホームへ戻る">
        <Link className="link" to={"/"}>
          <FontAwesomeIcon icon={faHome} />
        </Link>
      </Tooltip>
    </div>
  );
};

export default BackToHomeLink;
