import Asset from "../../backend/model/Asset";
import Ticket from "../../backend/model/Ticket";
import User from "../../backend/model/User";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS, parseDDMMYYYY, toGLPIDateTime } from "../../backend/utils/utils";
import { getNowDate, getNowTime } from "../../backend/utils/dateUtils";
import { useState, useEffect} from "react";
import "../../css/pages/FO/FOCreateTicket.css";

export default function FOCreateTicket() {
    const [refTicket, setRefTicket] = useState("");
    const [date, setDate] = useState(getNowDate());
    const [heure, setHeure] = useState(getNowTime());
    const [type, setType] = useState(TICKET_TYPE[0].id);
    const [priority, setPriority] = useState(TICKET_PRIORITY[0].id);
    const [status, setStatus] = useState(TICKET_STATUS[0].id);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState(null);
    const [requestersIds, setRequestersIds] = useState([]);
    const [assignedIds, setAssignedIds] = useState([]);
    const [observersIds, setObserversIds] = useState([]);
    const [users, setUsers] = useState([]);
    const [costs, setCosts] = useState([]);

    useEffect(() =>{
        const loadElements = async () =>{
            const assets = await Asset.getAll();
            setItems(assets);
            const usersList = await User.getExcl([2, 3, 4, 5, 6]);
            setUsers(usersList);
        };
        loadElements();
    }, [])

    const handleSubmit = async () => {
        try {
            const selectedObjects = selectedItems
                .map(id => items.find(it => it.id === id))
                .filter(Boolean);

            const selectedUsers = [
                ...requestersIds.map(id => ({ type: "User", role: "requester", id })),
                ...assignedIds.map(id => ({ type: "User", role: "assigned", id })),
                ...observersIds.map(id => ({ type: "User", role: "observer", id })),
            ];

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
            await newTicket.saveWithAll(selectedUsers, selectedObjects, costs);
            setMessage({ type: "success", text: "Ticket created successfully!" });
            console.log("Ticket créé avec succès :", newTicket, " — users associés :", selectedUsers, " — items associés :", selectedObjects, " — costs :", costs);

            setRefTicket("");
            setDate(getNowDate());
            setHeure(getNowTime());
            setTitle("");
            setDescription("");
            setSelectedItems([]);
            setRequestersIds([]);
            setAssignedIds([]);
            setObserversIds([]);
            setCosts([]);

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "Error creating ticket. Please try again." });
            console.error("Erreur lors de la création du ticket :", error);
            setTimeout(() => setMessage(null), 3000);
        }
    }

    return (
        <div className="fo-create-ticket">
            <h1>Create a Ticket</h1>

            {message && (
                <div className={message.type === "success" ? "fo-create-ticket-success" : "fo-create-ticket-error"}>
                    {message.text}
                </div>
            )}

            <div className="fo-create-ticket-form">
                <div className="fo-create-ticket-form-group">
                    <label htmlFor="ref">Reference</label>
                    <input id="ref" type="text" placeholder="Ticket reference" value={refTicket} onChange={(e) => setRefTicket(e.target.value)} />
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" placeholder="Ticket title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" placeholder="Ticket description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="date">Date</label>
                    <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="time">Time</label>
                    <input id="time" type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="type">Type</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        {TICKET_TYPE.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        {TICKET_PRIORITY.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        {TICKET_STATUS.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="requesters">Requesters (hold Ctrl to select multiple)</label>
                    <select
                        id="requesters"
                        multiple
                        value={requestersIds.map(String)}
                        onChange={(e) => {
                            const ids = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setRequestersIds(ids);
                        }}
                    >
                        {users.map((user) => (
                            <option value={String(user.id)}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="assigned">Assigned Technicians (hold Ctrl to select multiple)</label>
                    <select
                        id="assigned"
                        multiple
                        value={assignedIds.map(String)}
                        onChange={(e) => {
                            const ids = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setAssignedIds(ids);
                        }}
                    >
                        {users.map((user) => (
                            <option value={String(user.id)}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="observers">Observers (hold Ctrl to select multiple)</label>
                    <select
                        id="observers"
                        multiple
                        value={observersIds.map(String)}
                        onChange={(e) => {
                            const ids = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setObserversIds(ids);
                        }}
                    >
                        {users.map((user) => (
                            <option value={String(user.id)}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label htmlFor="items">Associated Assets (hold Ctrl to select multiple)</label>
                    <select
                        id="items"
                        multiple
                        value={selectedItems.map(String)}
                        onChange={(e) => {
                            const ids = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setSelectedItems(ids);
                        }}
                    >
                        {items.map((item) => (
                            <option value={String(item.id)}>{item.name}</option>
                        ))}
                    </select>
                </div>

                <div className="fo-create-ticket-form-group">
                    <label>Costs</label>
                    <div>
                        {costs.map((cost, index) => (
                            <div key={index} className="fo-create-ticket-cost-row">
                                <input
                                    type="number"
                                    placeholder="Duration (s)"
                                    value={cost.duration || ""}
                                    onChange={(e) => {
                                        const updatedCosts = [...costs];
                                        updatedCosts[index].duration = Number(e.target.value);
                                        setCosts(updatedCosts);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Time Cost"
                                    value={cost.cost_time || ""}
                                    onChange={(e) => {
                                        const updatedCosts = [...costs];
                                        updatedCosts[index].cost_time = Number(e.target.value);
                                        setCosts(updatedCosts);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Fixed Cost"
                                    value={cost.cost_fixed || ""}
                                    onChange={(e) => {
                                        const updatedCosts = [...costs];
                                        updatedCosts[index].cost_fixed = Number(e.target.value);
                                        setCosts(updatedCosts);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCosts(costs.filter((_, i) => i !== index));
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setCosts([...costs, { duration: 0, cost_time: 0, cost_fixed: 0 }]);
                            }}
                        >
                            + Add Cost
                        </button>
                    </div>
                </div>

                <div className="fo-create-ticket-actions">
                    <button onClick={() => handleSubmit()}>Create Ticket</button>
                </div>
            </div>
        </div>
    );
}