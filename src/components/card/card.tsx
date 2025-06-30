import React from "react";
import classs from "./card.module.css";
import { Coin } from "@/src/app/coins";

interface coinProps {
  coins: Coin[];
  title :string
}
const Card: React.FC<coinProps> = ({ coins , title}) => {
  return (
    <div className={classs.card}>
      <h2>List of {title}:</h2>
      <ul>
        {coins.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
