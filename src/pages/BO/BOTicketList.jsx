import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS, getEnumNameById } from "../../backend/utils/utils";

export default function BOTicketList() {
    const [tickets, setTickets]             = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filters, setFilters]  = useState({ stateId:0, typeId:0, priorityId: 0});

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getAllComplete();
            setTickets(tic);
        };
        loadTickets();
    }, []);

    
    const resetFilter = () => {
        setFilters({ stateId:0, typeId:0, priorityId: 0});
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value === "" ? 0 : Number(value) }));
    };

    const openTicketDetails  = (complete) => setSelectedTicket(complete ?? null);
    const closeTicketDetails = ()         => setSelectedTicket(null);

    const filteredTickets = tickets.filter(({ ticket }) => {
        if (filters.priorityId     > 0 && ticket.priority     !== filters.priorityId)     return false;
        if (filters.stateId > 0 && ticket.status?.id !== filters.stateId) return false;
        if (filters.typeId        > 0 && ticket.type       !== filters.typeId)        return false;
        return true;
    });

    const ticketWithComputer = filteredTickets.reduce((acc, ticket) => {
        const hasComputer = ticket.assets.some((asset) => asset.itemType === "Computer");
        return hasComputer ? acc + 1 : acc;
    }, 0);

    const ticketWithMonitor = filteredTickets.reduce((acc, ticket) => {
        const hasMonitor = ticket.assets.some((asset) => asset.itemType === "Monitor");
        return hasMonitor ? acc + 1 : acc;
    }, 0);

    return (
        <div style={{ padding: "16px" }}>
            <h1>Tickets</h1>
            <button onClick={resetFilter}>Reset Filter</button>
            <div>
                <select value={filters.typeId} onChange={(e) => handleFilterChange("typeId", e.target.value)}>
                    <option value="0">Type</option>
                    {TICKET_TYPE.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select value={filters.priorityId} onChange={(e) => handleFilterChange("priorityId", e.target.value)}>
                    <option value="0">Priorite</option>
                    {TICKET_PRIORITY.map((priority) => (
                        <option key={priority.id} value={priority.id}>
                            {priority.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select value={filters.stateId} onChange={(e) => handleFilterChange("stateId", e.target.value)}>
                    <option value="0">Status</option>
                    {TICKET_STATUS.map((state) => (
                        <option key={state.id} value={state.id}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>

            <h3>Total : {filteredTickets.length}</h3>
            <h3>Tickets avec ordinateur : {ticketWithComputer}</h3>
            <h3>Tickets avec moniteur : {ticketWithMonitor}</h3>

            {filteredTickets.map(({ ticket, assets, costs }) => (
                <div key={ticket.id}>
                    <p>
                        <strong>#{ticket.id}</strong> - {ticket.name} -{" "}
                        {getEnumNameById(TICKET_TYPE,     ticket.type)      || "-"} -{" "}
                        {getEnumNameById(TICKET_PRIORITY, ticket.priority)  || "-"} -{" "}
                        {getEnumNameById(TICKET_STATUS,   ticket.status?.id) || "-"}
                    </p>
                    <button type="button" onClick={() => openTicketDetails({ ticket, assets, costs })}>
                        Voir les détails
                    </button>
                </div>
            ))}

            {selectedTicket && (
                <dialog open onCancel={closeTicketDetails}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>Détails ticket #{selectedTicket.ticket.id}</h2>
                        <button type="button" onClick={closeTicketDetails}>Fermer</button>
                    </div>

                    <p><strong>Titre :</strong> {selectedTicket.ticket.name}</p>
                    <p><strong>Description :</strong> {selectedTicket.ticket.content || "-"}</p>
                    <p><strong>nb computer :</strong> {selectedTicket.assets.filter((a) => a.itemType === "Computer").length}</p>
                    <p><strong>nb monitor :</strong>  {selectedTicket.assets.filter((a) => a.itemType === "Monitor").length}</p>

                    <h3>Assets associés</h3>
                    {selectedTicket.assets.length === 0 && <p>Aucun asset associé.</p>}
                    {selectedTicket.assets.map((asset) => (
                        <p key={`${asset.itemType}-${asset.id}`}>
                            {asset.name} - type : {asset.itemType}
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