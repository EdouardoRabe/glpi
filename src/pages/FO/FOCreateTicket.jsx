import Computer from "../../backend/model/Computer";
import Monitor from "../../backend/model/Monitor";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS, parseDDMMYYYY, toGLPIDateTime } from "../../backend/utils/utils";
import { useState, useEffect } from "react";

export default function FOCreateTicket() {
    const [refTicket, setRefTicket] = useState("");
    const [date, setDate] = useState("");
    const [heure, setHeure] = useState("");
    const [type, setType] = useState(TICKET_TYPE[0].id);
    const [priority, setPriority] = useState(TICKET_PRIORITY[0].id);
    const [status, setStatus] = useState(TICKET_STATUS[0].id);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() =>{
        const loadElements = async () =>{
            const com = await Computer.getAll();
            const mon = await Monitor.getAll();

            setItems([...com, ...mon]);
           
        };
        loadElements();
    }, [])

    const handleSubmit = async () => {
        try {
            const daty    = parseDDMMYYYY(date, heure);
            const dateStr = toGLPIDateTime(daty);
            const payload = {
                name: title,
                content: description,
                type: type,
                priority: priority,
                status: status,
                date: dateStr,
                ref: refTicket,
            };
            console.log("Payload à envoyer :", payload);
        } catch (error) {
            console.error("Erreur lors de la création du ticket :", error);
        }
    }
    
    return (
        <div>
            <h1>Créer un ticket</h1>
            <input type="text" placeholder="Référence" value={refTicket} onChange={(e) => setRefTicket(e.target.value)} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
            <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                {TICKET_TYPE.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {TICKET_PRIORITY.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {TICKET_STATUS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
            <select multiple value={selectedItems} onChange={(e) => setSelectedItems(Array.from(e.target.selectedOptions, option => option.value))}>
                {items.map((item) => (
                    <option key={item.id} value={item}>{item.name}</option>
                ))}
            </select>
            <button onClick={handleSubmit()}>Créer</button>
        </div>
    );
}