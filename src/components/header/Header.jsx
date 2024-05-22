import React from "react";
import './style_header.scss'
import pokemonIcon from '../assets/pokemon.png';

const Header = ({ onSearch }) => {
    return (
        <div className="header">
            <div className="header_text">
            <img src={pokemonIcon} alt="Pokemon Icon" />
                <p>Pokemon</p>
            </div>
            <div className="main_box">
                <div className="box">
                    <form name="search">
                        <input type="text" className="input" onChange={onSearch}  placeholder="Type to search" onmouseout="this.value = ''; this.blur();" />
                    </form>
                    <span className="material-symbols-outlined">search</span>
                </div>
            </div>
        </div>
    );
}

export default Header;
