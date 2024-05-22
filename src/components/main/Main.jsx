import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./style_main.scss";
import Header from "../header/Header";
import { Link } from "react-router-dom";
import bg_icon from "../assets/bg_icon.png";
function ShowCards() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleInputChange = (e) => {
    setSearchItem(e.target.value);
  };

  const fetchPokemonDetails = useCallback(async () => {
    const searchItemLowerCase = searchItem.toLowerCase();
    const filteredPokemonList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchItemLowerCase) ||
      pokemon.url.includes(searchItemLowerCase)
    );

    const detailsPromises = filteredPokemonList
      .slice((currentPage - 1) * 20, currentPage * 20)
      .map(async (pokemon) => {
        const detailsResponse = await axios.get(pokemon.url);
        const { types } = detailsResponse.data;
        const type = types.length > 0 ? types[0].type.name : "";
        return { ...detailsResponse.data, type };
      });

    const details = await Promise.all(detailsPromises);
    setPokemonDetails(details);
    setTotalPages(Math.ceil(filteredPokemonList.length / 20));
  }, [pokemonList, currentPage, searchItem]);

  const fetchApi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
      );
      const results = response.data.results;
      setTotalPages(Math.ceil(response.data.count / 30)); // Update this line

      setPokemonList(results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  useEffect(() => {
    fetchPokemonDetails();
  }, [fetchPokemonDetails]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
    const getBgColor = (type) => 
    {
        switch (type) {
        case "water":
            return "#4592c4"; // blue
        case "fire":
            return "#f76e51"; // red
        case "grass":
            return "#49a621";
        case "poison":
            return "#7ac76d"; // green
        case "electric":
            return "#F4D03F";
        case "normal":
            return "#D3D3D3";
        case "bug":
            return "#228B22";
        default:
            return "#ccc"; // gray for other types
        }
    };
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="main">
      <Header onSearch={handleInputChange} />
      <div className="cards_container">{pokemonDetails.map((pokemon) => (<div
            className="card" key={pokemon.id} style={{ backgroundColor: getBgColor(pokemon.type) }}>
            <Link to={`/Card/${pokemon.name}`}>
              <div className="pokemon_card">
                <p className="pokemon_id">#{pokemon.id}</p>
                <div className="middle_box">
                  <div className="card_name_type">
                    <p className="pokemon_name">{pokemon.name}</p>
                    <p className="pokemon_type">{pokemon.type}</p>
                  </div>
                  {pokemon.sprites && pokemon.sprites.front_default && (
                    <img
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="pokemon_image"
                    />
                  )}
                   <img className="bg_icon" src={bg_icon} alt="icon" />
                </div>
                <p className="pokemon_id">{pokemon.damage_relations}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button className="pageButton" onClick={prevPage}>
          Previous Page
        </button>
        <span className="pageIndicator">
          {currentPage}/{totalPages}
        </span>
        <button className="pageButton" onClick={nextPage}>
          Next Page
        </button>
      </div>
    </div>
  );
}

export default ShowCards;
