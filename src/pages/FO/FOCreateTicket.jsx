import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS } from "../../backend/utils/utils";
import { useState } from "react";

export default function FOCreateTicket() {
    const [type, setType] = useState(TICKET_TYPE[0].id);
    const [priority, setPriority] = useState(TICKET_PRIORITY[0].id);
    const [status, setStatus] = useState(TICKET_STATUS[0].id);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    return (
        <div>
            <h1>Créer un ticket</h1>
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
            <button>Créer</button>
        </div>
    );
}