import { useEffect, useState } from "react"
import Ticket from "../../backend/model/Ticket";
import StatusTicket from "../../backend/model/StatusTicket";
import { getNbAssetInTicket, ticketCompletGroupByStatus} from "../../backend/services/ticket";
import { getSommeCost, getSommeCostByTime, getSommeDuration, getSommeFixedCost, getSommeTimeCost, getTotalCostByTime } from "../../backend/services/cost";

export default function FOTicketList(){
    const [groups, setGroups] = useState([]);
    const [draggedTicket, setDraggetTicket] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(()=>{
        const load = async () =>{
            const tic = await Ticket.getAllComplete();
            const stat = await StatusTicket.getAll();
            const grouped = ticketCompletGroupByStatus(tic, stat);
            setGroups(grouped);
        }
        load();
    }, [])

    const handleDrag = (tick) =>{
        setDraggetTicket(tick);
        console.log(tick, " En drag");
    }

    const handleDrop = async (group) =>{
        console.log("ticket ", draggedTicket.external_id, " vers ", group.status.id_status);
        const fil = group.tickets.find((t) => t.ticket.id === draggedTicket.id);
        if(fil){
            console.log("Ce ticket est deja : ", group.status.french_name);
            return
        }
        const data = {status : {id : group.status.id_status}};
        const result = await draggedTicket.update(data);
        console.log("resultat du dragg ", result);
        setDraggetTicket(null);
    }

    const openTicketDetails  = (complete) => setSelectedTicket(complete ?? null);
    const closeTicketDetails = ()         => setSelectedTicket(null);

    const nbAssetInTicket = selectedTicket ? getNbAssetInTicket(selectedTicket) : [];
    

    return (
        <div>
            <h1>Liste des tickets</h1>
            <div >
                {
                    groups.map((group) => (
                        <div 
                            key={`${group.status.id_status}`} 
                            style={{backgroundColor: group.status.color}} 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(group)}
                        >
                            <h2>{group.status.french_name}</h2>
                            {
                                group.tickets.map((tic) => (
                                    <div
                                        key={`${tic.ticket.id}-${tic.ticket.external_id}`} 
                                        style={{backgroundColor: "#ebe3da"}} 
                                        draggable
                                        onDragStart={() => handleDrag(tic.ticket)}
                                    >
                                        <p>Ticket Ref: {tic.ticket.external_id}</p>
                                        <div className="bo-ticket-item-actions">
                                            <button type="button" onClick={() => openTicketDetails(tic)}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
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
    )
}