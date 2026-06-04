import {useState, useEffect } from "react"
import { toDelete } from "../../backend/services/reset/reset";

export default function BOReset() {
    const [selected, setSelected] = useState(new Set());

    const handleSelection = (item) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) {
                newSet.delete(item);
            }
            else {
                newSet.add(item);
            }   
            return newSet;
        });
    }

    const handleReset = () => {
        if (selected.size === 0) {
            alert("Veuillez sélectionner au moins une catégorie à réinitialiser.");
            return;
        }
        console.log("Selected categories for reset:", Array.from(selected).map(i => i.name));
    }

    return (
        <div>
            <h1>BOReset</h1>
            {toDelete?.map(item => (
                <>
                    <label htmlFor={`checkbox-${item.order}`}>{item.name}</label>
                    <input 
                            id={`checkbox-${item.order}`}
                            key={item.order}
                            type="checkbox" 
                            checked={selected.has(item)} 
                            onChange={() => {handleSelection(item)}} 
                    />
                    <br/>
                </>
            ))}

            <button onClick={() => {handleReset()}}>Reset</button>
        </div>
    )
}