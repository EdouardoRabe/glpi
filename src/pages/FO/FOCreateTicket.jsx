import Asset from "../../backend/model/Asset";
import Ticket from "../../backend/model/Ticket";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS, parseDDMMYYYY, toGLPIDateTime } from "../../backend/utils/utils";
import { useState, useEffect} from "react";

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
            const items = await Asset.getAll(); 

            setItems(items);
           
        };
        loadElements();
    }, [])

    const handleSubmit = async () => {
        try {
            const selectedObjects = selectedItems
                .map(id => items.find(it => it.id === id))
                .filter(Boolean);

            const daty    = parseDDMMYYYY(date, heure);
            const dateStr = toGLPIDateTime(daty);
            const payload = {
                name: title,
                content: description,
                type: type,
                priority: priority,
                status: status,
                date: dateStr,
                external_id: refTicket,
            };
            const newTicket = new Ticket(payload);
            newTicket.saveWithItems(selectedObjects);
            console.log("Ticket créé avec succès :", newTicket, " — items associés :", selectedObjects);
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
            <select 
                multiple 
                value={selectedItems.map(String)} 
                onChange={(e) => {
                    const ids = Array.from(e.target.selectedOptions, option => Number(option.value));
                    setSelectedItems(ids);
                }}
            >
                {items.map((item) => (
                    <option key={item.id} value={String(item.id)}>{item.name}</option>
                ))}
            </select>
            <button onClick={() => handleSubmit()}>Créer</button>
        </div>
    );
}