import React, { useState } from "react";
import { cards } from "../data/cards";
import '../styles/card_library.css';

// Componente que muestra una sola carta
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

// Componente que muestra la biblioteca de cartas
const Library = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [costFilters, setCostFilters] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        "8+": false
    });

    // Manejar cambio en el buscador
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Manejar cambio en los filtros de coste
    const handleCostFilterChange = (cost) => {
        setCostFilters(prev => ({
            ...prev,
            [cost]: !prev[cost]
        }));
    };

    // Filtrar cartas según búsqueda y filtros
    const filteredCards = cards.filter(card => {
        // Filtro por nombre
        const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtro por coste
        const selectedCosts = Object.keys(costFilters).filter(cost => costFilters[cost]);
        
        let matchesCost = true;
        if (selectedCosts.length > 0) {
            matchesCost = selectedCosts.some(cost => {
                if (cost === "8+") {
                    return card.cost >= 8;
                }
                return card.cost === parseInt(cost);
            });
        }
        
        return matchesSearch && matchesCost;
    });

    // Limpiar todos los filtros
    const clearFilters = () => {
        setSearchTerm("");
        setCostFilters({
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            "8+": false
        });
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = searchTerm || Object.values(costFilters).some(filter => filter);

    return (
        <div className="library-container">
            <h2>Biblioteca de Cartas</h2>
            
            {/* Barra de búsqueda y filtros */}
            <div className="filters-section">
                {/* Buscador */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar cartas por nombre..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                {/* Filtros por coste */}
                <div className="cost-filters">
                    <h3>Filtrar por Coste:</h3>
                    <div className="cost-buttons">
                        {[1, 2, 3, 4, 5, 6, 7, "8+"].map(cost => (
                            <button
                                key={cost}
                                className={`cost-filter-btn ${costFilters[cost] ? 'active' : ''}`}
                                onClick={() => handleCostFilterChange(cost)}
                            >
                                {cost}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contador de resultados y botón limpiar */}
                <div className="filter-info">
                    <span className="results-count">
                        {filteredCards.length} de {cards.length} cartas
                    </span>
                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Limpiar Filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Lista de cartas filtradas */}
            <div className="card-list">
                {filteredCards.length === 0 ? (
                    <div className="no-results">
                        <p>No se encontraron cartas que coincidan con los filtros.</p>
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Mostrar Todas las Cartas
                        </button>
                    </div>
                ) : (
                    filteredCards.map((card) => (
                        <Card key={card.id} card={card} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Library;