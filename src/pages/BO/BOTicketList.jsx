import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS, getEnumNameById } from "../../backend/utils/utils";
import { formatToYYYYMMDD_HHmm } from "../../backend/utils/dateUtils";
import { compareDates } from "../../backend/utils/comparisonUtils";
import { ITEM_TYPES } from "../../backend/utils/type";
import "../../css/pages/BO/BOTicketList.css";

export default function BOTicketList() {
    // État initial des filtres
    const INITIAL_FILTERS = {
        stateId: 0,
        typeId: 0,
        priorityId: 0,
        dateMin: "",
        dateMax: "",
    };

    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getAllComplete();
            setTickets(tic);
        };
        loadTickets();
    }, []);

    const resetFilter = () => {
        setFilters(INITIAL_FILTERS);
    };

    const handleFilterChange = (key, value) => {
        const dateFields = ["dateMin", "dateMax"];
        const newValue = dateFields.includes(key)
            ? (value === "" ? "" : value)
            : (value === "" ? 0 : Number(value));

        setFilters(prev => ({ ...prev, [key]: newValue }));
    };

    const openTicketDetails  = (complete) => setSelectedTicket(complete ?? null);
    const closeTicketDetails = ()         => setSelectedTicket(null);

    //Teste anah sort
    const orderTickets = tickets.toSorted((t1, t2) =>{
        const result = compareDates(t1.ticket.date, t2.ticket.date);
        return result;
    });

    const filteredTickets = orderTickets.filter(({ ticket }) => {
        if (filters.priorityId     > 0 && ticket.priority     !== filters.priorityId)     return false;
        if (filters.stateId > 0 && ticket.status?.id !== filters.stateId) return false;
        if (filters.typeId        > 0 && ticket.type       !== filters.typeId)        return false;
        if (filters.dateMin !== ""      &&       compareDates(ticket.date, filters.dateMin) === -1 )        return false;
        if (filters.dateMax !== ""      &&       compareDates(ticket.date, filters.dateMax) === 1 )        return false;
        return true;
    });


    return (
        <div className="bo-ticket-list">
            <h1>Tickets</h1>

            <div className="bo-ticket-filters">
                <h3>Filters</h3>
                <div className="bo-ticket-filter-group">
                    <div className="bo-ticket-filter-item">
                        <label htmlFor="filter-type">Type</label>
                        <select id="filter-type" value={filters.typeId} onChange={(e) => handleFilterChange("typeId", e.target.value)}>
                            <option value="0">All Types</option>
                            {TICKET_TYPE.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bo-ticket-filter-item">
                        <label htmlFor="filter-priority">Priority</label>
                        <select id="filter-priority" value={filters.priorityId} onChange={(e) => handleFilterChange("priorityId", e.target.value)}>
                            <option value="0">All Priorities</option>
                            {TICKET_PRIORITY.map((priority) => (
                                <option key={priority.id} value={priority.id}>
                                    {priority.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bo-ticket-filter-item">
                        <label htmlFor="filter-status">Status</label>
                        <select id="filter-status" value={filters.stateId} onChange={(e) => handleFilterChange("stateId", e.target.value)}>
                            <option value="0">All Status</option>
                            {TICKET_STATUS.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bo-ticket-filter-item">
                        <label htmlFor="filter-date-min">Date Min</label>
                        <input id="filter-date-min" type="date" value={filters.dateMin} onChange={(e) => handleFilterChange("dateMin", e.target.value)} />
                    </div>

                    <div className="bo-ticket-filter-item">
                        <label htmlFor="filter-date-max">Date Max</label>
                        <input id="filter-date-max" type="date" value={filters.dateMax} onChange={(e) => handleFilterChange("dateMax", e.target.value)} />
                    </div>
                </div>

                <div className="bo-ticket-filter-actions">
                    <button onClick={resetFilter}>Reset Filters</button>
                </div>
            </div>

            <div className="bo-ticket-stats">
                <div className="bo-ticket-stat">
                    <h3>Total Tickets</h3>
                    <p className="bo-ticket-stat-value">{filteredTickets.length}</p>
                </div>
                {
                    ITEM_TYPES.map((type) => {
                        const count = filteredTickets.reduce((acc, ticket) => {
                            const hasType = ticket.assets.some((asset) => asset.itemType === type);
                            return hasType ? acc + 1 : acc;
                        }, 0);
                        return count > 0 && (
                            <div className="bo-ticket-stat" key={type}>
                                <h3>With {type}s</h3>
                                <p className="bo-ticket-stat-value">{count}</p>
                            </div>
                        );
                    })
                }
            </div>

            <div className="bo-ticket-items">
                {filteredTickets.map(({ ticket, assets, costs, users }) => (
                    <div key={ticket.id} className="bo-ticket-item">
                        <div className="bo-ticket-item-header">
                            <div className="bo-ticket-item-info">
                                <div className="bo-ticket-item-id">#{ticket.external_id} - {ticket.name}</div>
                                <div className="bo-ticket-item-meta">
                                    <span>Type: {getEnumNameById(TICKET_TYPE, ticket.type) || "-"}</span>
                                    <span> | Priority: {getEnumNameById(TICKET_PRIORITY, ticket.priority) || "-"}</span>
                                    <span> | Status: {getEnumNameById(TICKET_STATUS, ticket.status?.id) || "-"}</span>
                                    <span> | Date: {formatToYYYYMMDD_HHmm(ticket.date)}</span>
                                </div>
                            </div>
                            <div className="bo-ticket-item-actions">
                                <button type="button" onClick={() => openTicketDetails({ ticket, assets, costs, users })}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTicket && (
                <dialog open onCancel={closeTicketDetails}>
                    <div className="bo-ticket-modal">
                        <div className="bo-ticket-modal-header">
                            <h2>Ticket #{selectedTicket.ticket.external_id}</h2>
                            <button type="button" onClick={closeTicketDetails}>Close</button>
                        </div>

                        <div className="bo-ticket-modal-section">
                            <p><strong>Title:</strong> {selectedTicket.ticket.name}</p>
                            <p><strong>Description:</strong> {selectedTicket.ticket.content || "-"}</p>
                        </div>

                        {   ITEM_TYPES.map((type) => {
                                const count = selectedTicket.assets.filter((a) => a.itemType === type).length;
                                return count > 0 ? (    
                                        <div key={type} className="bo-ticket-modal-section">
                                            <p><strong>{type}:</strong> {count}</p>
                                        </div>
                                ) : null;
                            })
                        }

                        {selectedTicket.assets.length > 0 && (
                            <div className="bo-ticket-modal-section">
                                <h3>Associated Assets</h3>
                                {selectedTicket.assets.map((asset) => (
                                    <p key={`${asset.itemType}-${asset.id}`}>
                                        {asset.name} ({asset.itemType})
                                    </p>
                                ))}
                            </div>
                        )}

                        {selectedTicket.users.length > 0 && (
                            <div className="bo-ticket-modal-section">
                                <h3>Team Members</h3>
                                {selectedTicket.users.map((user) => (
                                    <p key={`${user.role}-${user.id}`}>
                                        {user.name} ({user.role})
                                    </p>
                                ))}
                            </div>
                        )}

                        {selectedTicket.costs.length > 0 && (
                            <div className="bo-ticket-modal-section">
                                <h3>Associated Costs</h3>
                                {selectedTicket.costs.map((cost) => (
                                    <p key={cost.id}>
                                        Duration: {cost.duration}s | Time Cost: {cost.cost_time} | Fixed Cost: {cost.cost_fixed}
                                    </p>
                                ))}
                                <p><strong>Duration: { selectedTicket.costs.reduce((acc, cost ) => {return acc + cost.duration ;}, 0)}
                                |  Time Cost: { selectedTicket.costs.reduce((acc, cost ) => {return acc + cost.cost_time ;}, 0)}
                                |  Fixed Cost: { selectedTicket.costs.reduce((acc, cost ) => {return acc + cost.cost_fixed ;}, 0)}
                                </strong></p>
                            </div>
                        )}
                    </div>
                </dialog>
            )}
        </div>
    );
}