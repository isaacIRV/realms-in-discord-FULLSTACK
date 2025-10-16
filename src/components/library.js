import React from "react";
import {cards} from "../data/cards";
import '../styles/card_library.css';

//Componente que muestra una sola carta

const Card = ({ card }) => (
        <div className="card">
            <img src={card.image} alt={card.name} className="card-image" />
             <div className="card-info">
                <h3 className="card-name">{card.name}</h3>
                <div className="card-stats">
                    <span className="card-cost">Coste: {card.cost}</span>
                    <span className="card-attack">Ataque: {card.attack}</span>
                    <span className="card-health">Salud: {card.health}</span>
                </div>
                <p className="card-description">{card.description}</p>
                <span className="card-faction">{card.faction}</span>
             </div>
        </div>
);
//Componente que muestra la biblioteca de cartas

const Library = () => {
    return (
        <div className="library">
            <h2>Biblioteca de Cartas</h2>
            <div className="card-list">
                {cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </div>
        </div>
    );
};

export default Library;

