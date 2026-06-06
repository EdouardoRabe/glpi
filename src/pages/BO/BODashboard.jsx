import { useEffect, useState } from "react";
import Asset from "../../backend/model/Asset";
import Ticket from "../../backend/model/Ticket";
import { TICKET_TYPE, getEnumNameById } from "../../backend/utils/utils";
import "../../css/pages/BO/BODashboard.css";

export default function BODashboard() {
    const [assets, setAssets] = useState([]);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const loadElements = async () => {
            const ass = await Asset.getAll();
            const tic = await Ticket.getAll();

            setAssets(ass);
            setTickets(tic);
        };
        loadElements();
    }, []);

    const totalComputers = assets.filter((a) => a.itemType === "Computer").length;
    const totalMonitors  = assets.filter((a) => a.itemType === "Monitor").length;
    const totalAssets    = totalComputers + totalMonitors;

    const nbTicketType = tickets.reduce((acc, t) => {
        const id    = String(t.type);
        const label = getEnumNameById(TICKET_TYPE, id);
        acc[label]  = (acc[label] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <div className="bo-dashboard">
            <h1>Dashboard</h1>

            <div className="bo-dashboard-stats">
                <div className="bo-dashboard-stat-card">
                    <h3>Total Assets</h3>
                    <p className="bo-dashboard-stat-value">{totalAssets}</p>
                </div>
                <div className="bo-dashboard-stat-card">
                    <h3>Ordinateurs</h3>
                    <p className="bo-dashboard-stat-value">{totalComputers}</p>
                </div>
                <div className="bo-dashboard-stat-card">
                    <h3>Moniteurs</h3>
                    <p className="bo-dashboard-stat-value">{totalMonitors}</p>
                </div>
                <div className="bo-dashboard-stat-card">
                    <h3>Tickets Total</h3>
                    <p className="bo-dashboard-stat-value">{tickets.length}</p>
                </div>
            </div>

            <div className="bo-dashboard-section">
                <h2>Tickets par type</h2>
                {Object.entries(nbTicketType).length === 0 ? (
                    <p>Aucun ticket</p>
                ) : (
                    <ul>
                        {Object.entries(nbTicketType).map(([label, count]) => (
                            <li key={label}><strong>{label}:</strong> {count}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}