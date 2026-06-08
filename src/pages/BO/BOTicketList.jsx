import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import { TICKET_PRIORITY, TICKET_TYPE,  getEnumNameById } from "../../backend/utils/utils";
import { formatToYYYYMMDD_HHmm } from "../../backend/utils/dateUtils";
import { compareDates } from "../../backend/utils/comparisonUtils";
import "../../css/pages/BO/BOTicketList.css";
import { getCostTotal, getCostTotalByTime, getCostTotalFixed, getSommeCost, getSommeCostByTime, getSommeDuration, getSommeFixedCost, getSommeTimeCost, getTotalCostByTime } from "../../backend/services/cost";
import { getCostTicketCompletByStatusAll, getNbAssetInTicket,  nbTicketsWithAsset } from "../../backend/services/ticket";
import StatusTicket from "../../backend/model/StatusTicket";
import { get, post } from "../../backend/utils/expressApi";

export default function BOTicketList() {
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
    const [statusTicket, setStatusTicket] = useState([]);

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getAllComplete();
            const status = await StatusTicket.getAll();
            setTickets(tic);
            setStatusTicket(status);
            console.log(tic)
            const corbeille  = await get('/corbeille');
            console.log(corbeille, " corbeille")
            const filtered = tic.filter((ticket) => {
                const isdelete = !corbeille.some((line) => {
                        console.log(line.idticket, "===", ticket.ticket.id )
                        return line.idticket === ticket.ticket.id
                    }
                )
                console.log("id ", ticket.ticket.id, " isdelete ", isdelete);
                return isdelete;
            }
        );
            console.log("filtered ",filtered)
        
            setTickets(filtered);
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
        if (filters.dateMin !== ""      &&       compareDates(ticket.date, filters.dateMin) === -1 )        return false;
        if (filters.dateMax !== ""      &&       compareDates(ticket.date, filters.dateMax) === 1 )        return false;
        return true;
    });

    const nbAssetInTicket = selectedTicket ? getNbAssetInTicket(selectedTicket) : [];

    const toCorbeille = async (id)=>{
        console.log("Ho fafana ", id);
        const data = {idticket : id};
        await post('/corbeille', data);
        console.log("Ho voafafa ", id);
        setTickets(prev => prev.filter(({ticket}) => ticket.id !== id));
    }


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
                            {statusTicket.map((state) => (
                                <option key={state.id_status} value={state.id_status}>
                                    {state.french_name}
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

            </div>

            <div className="bo-ticket-items">
                {filteredTickets.map(({ ticket, assets, costs, users }) => {
                    return (
                        <div key={ticket.id} className="bo-ticket-item">
                            <div className="bo-ticket-item-header">
                                <div className="bo-ticket-item-info">
                                    <div className="bo-ticket-item-id">#{ticket.external_id} - {ticket.name} - id {ticket.id}</div>
                                    <div className="bo-ticket-item-meta">
                                        <span>Type: {getEnumNameById(TICKET_TYPE, ticket.type) || "-"}</span>
                                        <span> | Priority: {getEnumNameById(TICKET_PRIORITY, ticket.priority) || "-"}</span>
                                        <span> | Status: { StatusTicket.getByIdStatus(statusTicket, ticket.status?.id)?.french_name || "-"}</span>
                                        <span> | Date: {formatToYYYYMMDD_HHmm(ticket.date)}</span>
                                    </div>
                                </div>
                                <div className="bo-ticket-item-actions">
                                    <button type="button" onClick={() => openTicketDetails({ ticket, assets, costs, users })}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="bo-ticket-item-actions">
                                <button type="button" onClick={() => openTicketDetails({ ticket, assets, costs, users })}>
                                    View Details
                                </button>
                            </div>
                             <div className="bo-ticket-item-actions-red">
                                <button type="button" onClick={() => toCorbeille(ticket.id)}>
                                    Corbeille
                                </button>
                            </div>
                        </div>
                )})}
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

                        {   nbAssetInTicket.map(({ label, count }) => {
                                return count > 0 ? (    
                                        <div key={label} className="bo-ticket-modal-section">
                                            <p><strong>{label}:</strong> {count}</p>
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
                                        Duration: {cost.duration}s | Time Cost: {cost.cost_time} | Cost by Time: { getSommeCostByTime(cost) } | Fixed Cost: {cost.cost_fixed}
                                    </p>
                                ))}
                                <p><strong>Duration: { getSommeDuration(selectedTicket.costs) }
                                |  Time Cost: { getSommeTimeCost(selectedTicket.costs) }
                                |  Cost by Time: { getTotalCostByTime(selectedTicket.costs) }
                                |  Fixed Cost: { getSommeFixedCost(selectedTicket.costs) }
                                </strong></p>
                                <strong> Total : { getSommeCost(selectedTicket.costs) }</strong>
                            </div>
                        )}
                    </div>
                </dialog>
            )}
        </div>
    );
}