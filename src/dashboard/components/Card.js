import React from 'react';
import './Card.css';

const Card = ({ title, count }) => {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{count}</p>
    </div>
  );
};

export default Card;
