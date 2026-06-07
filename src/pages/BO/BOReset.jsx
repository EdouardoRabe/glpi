import {useState} from "react"
import { toDelete, reset } from "../../backend/services/reset/reset";
import "../../css/pages/BO/BOReset.css";

export default function BOReset() {
    const [selected, setSelected] = useState(new Set());
    const [message, setMessage] = useState("");

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
        setMessage({ type: "success", text: "Réinitialisation terminée avec succès !" });
    }

    return (
        <div className="bo-reset">
            <h1>Reset Database</h1>
            {message && (
                <div className={message.type === "success" ? "fo-create-ticket-success" : "fo-create-ticket-error"}>
                    {message.text}
                </div>
            )}
            <div className="bo-reset-actions">
                <button onClick={() => {setSelected(new Set(toDelete))}}>Select All</button>
                <button onClick={() => {handleReset()}}>Reset Selected</button>
            </div>
            <div className="bo-reset-list">
                {toDelete?.map(item => (
                    <div key={item.order} className="bo-reset-item">
                        <input
                            id={`checkbox-${item.order}`}
                            type="checkbox"
                            checked={selected.has(item)}
                            onChange={() => {handleSelection(item)}}
                        />
                        <label htmlFor={`checkbox-${item.order}`}>{item.name}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}