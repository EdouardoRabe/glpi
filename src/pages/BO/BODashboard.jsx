import { useEffect, useState } from "react";
import Asset from "../../backend/model/Asset";
import Ticket from "../../backend/model/Ticket";
import "../../css/pages/BO/BODashboard.css";
import { nbAssetsByTypes } from "../../backend/services/assets";
import { nbTicketsByTypes } from "../../backend/services/ticket";

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

    const nbTicketType = nbTicketsByTypes(tickets);

    const nbAssetType = nbAssetsByTypes(assets);

    return (
        <div className="bo-dashboard">
            <h1>Dashboard</h1>

            <div className="bo-dashboard-stats">
                <div className="bo-dashboard-stat-card">
                    <h3>Total Assets</h3>
                    <p className="bo-dashboard-stat-value">{assets.length}</p>
                </div>
                <div className="bo-dashboard-stat-card">
                    <h3>Tickets Total</h3>
                    <p className="bo-dashboard-stat-value">{tickets.length}</p>
                </div>
            </div>
            <div className="bo-dashboard-stats">
                <div className="bo-dashboard-section">
                    <h2>Assets par type</h2>
                    <ul>
                        {   nbAssetType.map((type) => {
                                const count = type.count;
                                return count > 0 && (
                                        <li key={type.label}><strong>{type.label}:</strong> {count}</li>
                                );
                            })
                        }
                    </ul>
                
                </div>

                <div className="bo-dashboard-section">
                    <h2>Tickets par type</h2>
                    {nbTicketType.length === 0 ? (
                        <p>Aucun ticket</p>
                    ) : (
                        <ul>
                            {nbTicketType.map(({ label, count }) => (
                                <li key={label}><strong>{label}:</strong> {count}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
        </div>
    );
}