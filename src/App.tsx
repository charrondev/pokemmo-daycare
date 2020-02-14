import React, { useState } from "react";
import "@atlaskit/css-reset";
import "./App.scss";
import { CalculatorForm } from "./Form";
import { Pokemon } from "./calculator/Pokemon";
import { PokemonTree } from "./PokemonTree";

function App() {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    return (
        <div className="App">
            <div className="App-content">
                <h2>PokeMMO Daycare</h2>
                <p>A calculator for breeding pokemon in PokeMMO.</p>
                <CalculatorForm
                    onSubmit={value => {
                        const pokemon = new Pokemon(
                            value.pokemon!.pokedexMon.name,
                            value.ivRequirements,
                            value.gender,
                            value.nature
                        );
                        console.log(pokemon);
                        setPokemon(pokemon);
                    }}
                />
                {pokemon && <PokemonTree pokemon={pokemon} />}
            </div>
        </div>
    );
}

export default App;
