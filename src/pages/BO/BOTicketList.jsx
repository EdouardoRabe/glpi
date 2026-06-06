import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS, getEnumNameById } from "../../backend/utils/utils";


export default function BOTicketList() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getAllComplete();
            setTickets(tic);
        };  
        loadTickets();
    }, []);

    const openTicketDetails = (complete) => {
        setSelectedTicket(complete ?? null);
    };

    const closeTicketDetails = () => {
        setSelectedTicket(null);
    };

    const ticketWithComputter = tickets.reduce ((acc, ticket) => {
        const hasComputer = ticket.assets.some((asset) => asset.getItemType() === "Computer");
        return hasComputer ? acc + 1 : acc;
    }, 0);

    const ticketWithMonitor = tickets.reduce ((acc, ticket) => {
        const hasMonitor = ticket.assets.some((asset) => asset.getItemType() === "Monitor");
        return hasMonitor ? acc + 1 : acc;
    }, 0);

    return (
        <div style={{ padding: "16px" }}>
            <h1>Tickets</h1>
                <h3>Total : {tickets.length}</h3>
                <h3>Tickets avec ordinateur : {ticketWithComputter}</h3>
                <h3>Tickets avec moniteur : {ticketWithMonitor}</h3>
                {
                    tickets.map(({ ticket, assets, costs }) => (
                            
                            <div key={ticket.id} >
                                <p><strong>#{ticket.id}</strong> - {ticket.name} - {getEnumNameById(TICKET_TYPE, ticket.type) || "-"} - {getEnumNameById(TICKET_PRIORITY, ticket.priority) || "-"} - {getEnumNameById(TICKET_STATUS, ticket.status.id) || "-"}</p>
                                <button type="button" onClick={() => openTicketDetails({ ticket, assets, costs })}>
                                    Voir les détails
                                </button>
                            </div>
                        )
                    )
                }

            {selectedTicket && (
                <dialog
                    open
                    onCancel={closeTicketDetails}
                >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0 }}>Détails ticket #{selectedTicket.ticket.id}</h2>
                            <button type="button" onClick={closeTicketDetails}>Fermer</button>
                        </div>

                        <p><strong>Titre:</strong> {selectedTicket.ticket.name}</p>
                        <p><strong>Description:</strong> {selectedTicket.ticket.content || "-"}</p>
                        <p><strong>nb computer:</strong> {selectedTicket.assets.filter((asset) => asset.getItemType() === "Computer").length}</p>
                        <p><strong>nb monitor:</strong> {selectedTicket.assets.filter((asset) => asset.getItemType() === "Monitor").length}</p>

                        <h3>Assets associés</h3>
                        {selectedTicket.assets.length === 0 && <p>Aucun asset associé.</p>}
                        {selectedTicket.assets.map((asset) => (
                            <p key={`${asset.getItemType()}-${asset.id}`}>
                                {asset.name} - type: {asset.getItemType()}
                            </p>
                        ))}

                        {selectedTicket.costs.length > 0 && (
                            <div>
                                <h3>Coûts associés</h3>
                                {selectedTicket.costs.map((cost) => (
                                    <p key={cost.id}>
                                        Durée : {cost.duration}s, Coût temps : {cost.cost_time}, Coût fixe : {cost.cost_fixed}
                                    </p>
                                ))}
                            </div>
                        )}
                </dialog>
            )}
        </div>
    );
}