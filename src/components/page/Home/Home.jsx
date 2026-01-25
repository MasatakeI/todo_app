import React from "react";
import "./Home.css";
import Button from "@/components/common/Button/Button";

import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Button onClickHandler={() => navigate("/main")}>Mainページへ移動</Button>
    </div>
  );
};

export default Home;
