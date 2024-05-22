import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./style_card.scss";
import icon from "../assets/icon_back.svg";
import bg_icon from "../assets/bg_icon.png";

const Card = () => {
  const [pokemon, setPokemon] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutSection, setAboutSection] = useState("about");
  const [breedingInfo, setBreedingInfo] = useState([]);

  const { name } = useParams();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        setPokemon(response.data);

        // Fetch breeding information
        const breedingResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${name}`
        );
        setBreedingInfo(breedingResponse.data.egg_groups);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  const getBgColor = (type) => {
    switch (type) {
      case "water":
        return "#4592c4"; // blue
      case "fire":
        return "#f76e51"; // red
      case "grass":
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { types, weight, height, abilities, stats } = pokemon;
  const type = types[0].type.name;

  const handleAboutSectionClick = (section) => {
    setAboutSection(section);
  };

  return (
    <div>
      <div className="container_of_card">
        <div className="card" style={{ backgroundColor: getBgColor(type) }}>
          <div className="back_box">
            <a href="/" className="backToMain">
              <img src={icon} alt="icon" />
            </a>
          </div>
          <div className="header_of_card">
            <div className="card_title">
              <h2 className="pokemon_name">{pokemon.name}</h2>
              <p className="pokemon_type">{type}</p>
            </div>
            <p className="pokemon_id">#{pokemon.id}</p>
          </div>
          <img className="pokemon_image" src={pokemon.sprites.front_default} alt={pokemon.name}/>
          <img className="bg_icon" src={bg_icon} alt="icon" />
          <div className="about">
            <div className="section-buttons">
              <button
                className={`section-button ${
                  aboutSection === "about" ? "active" : ""
                }`}
                onClick={() => handleAboutSectionClick("about")}
              >
                About
              </button>
              <button
                className={`section-button ${
                  aboutSection === "base" ? "active" : ""
                }`}
                onClick={() => handleAboutSectionClick("base")}
              >
                Base Stats
              </button>
            </div>
            {aboutSection === "about" && (
              <>
                <div className="type">
                  <p>Type:</p>
                  <p>{type}</p>
                </div>
                <div className="weight">
                  <p>Weight:</p>
                  <p>{weight} kg</p>
                </div>
                <div className="height">
                  <p>Height:</p>
                  <p>{height} m</p>
                </div>
                <div className="abilities">
                  <p>Abilities:</p>
                  <div>
                    {abilities.map((ability) => (
                      <p>{ability.ability.name}</p>
                    ))}
                  </div>
                </div>
                <div className="breeding">
                  <h4>Breeding:</h4>
                  <div>
                    {breedingInfo.map((eggGroup) => (
                      <p key={eggGroup.name}>{eggGroup.name}</p>
                    ))}
                  </div>
                </div>
              </>
            )}
            {aboutSection === "base" && (
              <div className="base-stats">
                <div className="base-stats-box">
                  <div className="hp">
                    <p>HP:</p>
                    <p>{stats[0].base_stat}</p>
                  </div>
                  <div className="attack">
                    <p>Attack:</p>
                    <p>{stats[1].base_stat}</p>
                  </div>
                  <div className="defense">
                    <p>Defense:</p>
                    <p>{stats[2].base_stat}</p>
                  </div>
                  <div className="special-attack">
                    <p>Sp. Attack:</p>
                    <p>{stats[3].base_stat}</p>
                  </div>
                  <div className="special-defense">
                    <p>Sp. Defense:</p>
                    <p>{stats[4].base_stat}</p>
                  </div>
                  <div className="speed">
                    <p>Speed:</p>
                    <p>{stats[5].base_stat}</p>
                  </div>
                  <div className="total">
                    <p>Total:</p>
                    <p>
                      {stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
