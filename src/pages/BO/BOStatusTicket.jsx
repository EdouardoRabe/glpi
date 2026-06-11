import { useEffect, useState } from "react"
import StatusTicket from "../../backend/model/StatusTicket";
import "../../css/pages/BO/BOStatusTicket.css";

export default function BOStatusTicket () {
    const [statusTicket, setStatusTicket] = useState([]);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    useEffect(() => {
        const load = async () => {
            const status = await StatusTicket.getAll();
            setStatusTicket(status);

            const lang = await StatusTicket.getLanguages();
            setLanguage(lang);
            console.log("lang ",lang);
        }
        load();
    }, [])

    const handleChange = (idstatus, key, value) => {
        setStatusTicket(prev =>
            prev.map(item =>
                item.id_status === idstatus
                    ? {
                        ...item,
                        [key]: value
                    }
                    : item
            )
        )
    }

    const updateStatus = async (status) => {
        setLoading(true);
        try {
            const result = await StatusTicket.update(status.id_status, status);
            console.log("Statut mis à jour:", result);
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bo-status-ticket">
            <h1>Gestion des statuts de tickets</h1>
             <div className="fo-assets-filter-item">
                        <label htmlFor="filter-user">Langue</label>
                        <select id="filter-user" value={selectedLanguage?.code} onChange={(e) => setSelectedLanguage(e.target.value)}>
                            {language.map(({code, name}) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                        <button>Changer</button>
                    </div>
            <div className="bo-status-ticket-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom français</th>
                            <th>Nom malgache</th>
                            <th>Couleur</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            statusTicket.map((state) => (
                                <tr key={`${state.id_status}-${state.french_name}`}>
                                    <td className="bo-status-ticket-id">{state.id_status}</td>
                                    <td className="bo-status-ticket-name">{state.french_name}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="bo-status-ticket-input"
                                            value={state.malagasy_name}
                                            onChange={(e) => handleChange(state.id_status, "malagasy_name", e.target.value)}
                                            placeholder="Nom malgache"
                                        />
                                    </td>
                                    <td>
                                        <div  className="bo-status-ticket-color-preview"
                                                style={{ backgroundColor: state.color }}
                                                title={state.color}>
                                            <input
                                                type="color"
                                                className="bo-status-ticket-color-input"
                                                value={state.color}
                                                onChange={(e) => handleChange(state.id_status, "color", e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="bo-status-ticket-actions">
                                            <button
                                                className="bo-status-ticket-button success"
                                                onClick={() => updateStatus(state)}
                                                disabled={loading}
                                            >
                                                {loading ? 'En cours de modification' : 'Modifier'} 
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
