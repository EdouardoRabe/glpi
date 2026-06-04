import {useEffect, useState} from "react"
import { toDelete, reset } from "../../backend/services/reset/reset";
import { get, post, put, del } from "../../backend/utils/expressapi";

export default function BOReset() {
    const [selected, setSelected] = useState(new Set());

   useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await get('/config');
                console.log('depuis express:', config);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchConfig();
    }, []);
    const handleSelection = (item) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) {
                newSet.delete(item);
            }
            else {
                newSet.add(item);
            }   
            return new Set(
                [...newSet].sort((a, b) => a.order - b.order)
            );
        });
    }

    const handleReset = async() => {
        if (selected.size === 0) {
            alert("Veuillez sélectionner au moins une catégorie à réinitialiser.");
            return;
        }
        await reset(Array.from(selected));
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

            <button onClick={() => {setSelected(new Set(toDelete))}}>Select All</button>
        </div>
    )
}