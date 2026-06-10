import { useEffect, useState} from "react"
import Ticket from "../../backend/model/Ticket";
import StatusTicket from "../../backend/model/StatusTicket";
import { getNbAssetInTicket, ticketCompletGroupByStatus} from "../../backend/services/ticket";
import { getSommeCost, getSommeCostByTime, getSommeDuration, getSommeFixedCost, getSommeTimeCost, getTotalCostByTime } from "../../backend/services/cost";
import { useNavigate } from "react-router-dom";
import "../../css/pages/FO/FOTicketList.css";

export default function FOTicketList(){
    const [groups, setGroups] = useState([]);
    const [draggedTicket, setDraggedTicket] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [dragOverGroup, setDragOverGroup] = useState(null);
    const navigate = useNavigate();
    const [showPopUp, setShowPopUp] = useState(false);
    const [description, setDescription] = useState(null);
    const [target, setTarget] = useState(null);
    const move = [
        {current: 6, target: 2},
        {current : 6, target: 1}
    ];

    const matchMove =(tabId) =>{
        return move.some((mv) => (tabId[0]===mv.current && tabId[1]===mv.target));
    }
    

    useEffect(()=>{
        const load = async () =>{
            const tic = await Ticket.getAllComplete();
            const stat = await StatusTicket.getAll();
            const grouped = ticketCompletGroupByStatus(tic, stat);
            setGroups(grouped);
        }
        load();
    }, [])

    const handleDragStart = (tick) => {
        setDraggedTicket(tick);
    }

    const handleDragOver = (e, groupId) => {
        e.preventDefault();
        setDragOverGroup(groupId);
    }

    const handleDragLeave = () => {
        setDragOverGroup(null);
    }

    const moveTicketBetweenGroups = (currentGroups, ticketId, targetStatusId) => {
        const sourceGroupIndex = currentGroups.findIndex(g =>
            g.tickets.some(t => t.ticket.id === ticketId)
        );
        if (sourceGroupIndex === -1) return currentGroups;
        const targetGroupIndex = currentGroups.findIndex(g => g.status.id_status === targetStatusId);
        if (targetGroupIndex === -1) return currentGroups;
        const ticketToMove = currentGroups[sourceGroupIndex].tickets.find(t => t.ticket.id === ticketId);
        if (!ticketToMove) return currentGroups;
        const newGroups = [...currentGroups];
        newGroups[sourceGroupIndex] = {
            ...newGroups[sourceGroupIndex],
            tickets: newGroups[sourceGroupIndex].tickets.filter(t => t.ticket.id !== ticketId)
        };
        newGroups[targetGroupIndex] = {
            ...newGroups[targetGroupIndex],
            tickets: [...newGroups[targetGroupIndex].tickets, ticketToMove]
        };
        return newGroups;
    }

    const handleDrop = async (targetGroup) => {
        setDragOverGroup(null);

        if (!draggedTicket) return;

        const alreadyInTarget = targetGroup.tickets.find((t) => t.ticket.id === draggedTicket.id);
        if(alreadyInTarget){
            console.log("Ce ticket est déjà dans:", targetGroup.status.french_name);
            return;
        }

        const tab = [draggedTicket.status.id, targetGroup.status.id_status];

        if(matchMove(tab)){
            openPopUp();
            setTarget(targetGroup);
            console.log("move pop up detecte: ", draggedTicket.status.id, " vers ", targetGroup.status.id_status);
            return;
        }


        try {
            const data = { status: { id: targetGroup.status.id_status } };
            await draggedTicket.update(data);
            
            setGroups(prevGroups =>
                moveTicketBetweenGroups(prevGroups, draggedTicket.id, targetGroup.status.id_status)
            );
        } catch (error) {
            console.error('Erreur lors du déplacement du ticket:', error);

            const tic = await Ticket.getAllComplete();
            const stat = await StatusTicket.getAll();
            const grouped = ticketCompletGroupByStatus(tic, stat);
            setGroups(grouped);
        }

        setDraggedTicket(null);
    }

    const continuer = async () =>{
        console.log("[CONTINUER] ", draggedTicket.status.id, " vers ", target.status.id_status, " description", description);
         try {

            const payloadITIL = {
                "input": {
                    "itemtype": "Ticket",
                    "items_id": draggedTicket.id,
                    "content": description,
                    "requesttypes_id": 1
                }
            }

            await StatusTicket.createITIL(draggedTicket.id, payloadITIL);
            console.log("description ajoute");

            const data = { status: { id: target.status.id_status } };
            await draggedTicket.update(data);
            
            setGroups(prevGroups =>
                moveTicketBetweenGroups(prevGroups, draggedTicket.id, target.status.id_status)
            );

            
        } catch (error) {
            console.error('Erreur lors du déplacement du ticket:', error);

            const tic = await Ticket.getAllComplete();
            const stat = await StatusTicket.getAll();
            const grouped = ticketCompletGroupByStatus(tic, stat);
            setGroups(grouped);
        }
        setDraggedTicket(null);
        setTarget(null);
        setShowPopUp(null);
    }

    const openTicketDetails = (complete) => setSelectedTicket(complete ?? null);
    const closeTicketDetails = () => setSelectedTicket(null);

    const openPopUp = () => setShowPopUp(true);
    const closePopUp = () => setShowPopUp(false);

    const nbAssetInTicket = selectedTicket ? getNbAssetInTicket(selectedTicket) : [];

    const createTicket = () => {
        navigate("/frontOffice/create-ticket");
    }

    return (
        <div className="fo-ticket-list">
            <h1>Tableau des tickets</h1>

            <div className="fo-ticket-kanban">
                {
                    groups.map((group) => (
                        <div
                            key={`${group.status.id_status}`}
                            className="fo-ticket-column"
                        >
                            <div
                                className="fo-ticket-column-header"
                                style={{ backgroundColor: group.status.color }}
                            >
                                <span>{group.status.french_name}</span>
                                <span className="fo-ticket-column-count">
                                    {group.tickets.length}
                                </span>
                            </div>

                            <div
                                className={`fo-ticket-drop-zone ${dragOverGroup === group.status.id_status ? 'drag-over' : ''}`}
                                onDragOver={(e) => handleDragOver(e, group.status.id_status)}
                                onDragLeave={handleDragLeave}
                                onDrop={() => handleDrop(group)}
                                role="button"
                            >
                                {group.tickets.length === 0 ? (
                                    <p className="fo-ticket-empty-message">Aucun ticket</p>
                                ) : (
                                    group.tickets.map((tic) => (
                                        <div
                                            key={`${tic.ticket.id}-${tic.ticket.external_id}`}
                                            className="fo-ticket-card"
                                            draggable
                                            onDragStart={() => handleDragStart(tic.ticket)}
                                            onClick={() => openTicketDetails(tic)}
                                        >
                                            <p className="fo-ticket-card-ref">
                                                #{tic.ticket.external_id}
                                            </p>
                                        </div>
                                    ))
                                )}

                                {group.status.id_status === 1 && (
                                    <button
                                        className="fo-ticket-add-button"
                                        onClick={createTicket}
                                    >
                                        + Ajouter un ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>

            {selectedTicket && (
                <dialog open onCancel={closeTicketDetails}>
                    <div className="fo-ticket-modal">
                        <div className="fo-ticket-modal-header">
                            <h2>Ticket #{selectedTicket.ticket.external_id}</h2>
                            <button type="button" onClick={closeTicketDetails}>Fermer</button>
                        </div>

                        <div className="fo-ticket-modal-section">
                            <p><strong>Titre:</strong> {selectedTicket.ticket.name}</p>
                            <p><strong>Description:</strong> {selectedTicket.ticket.content || "-"}</p>
                        </div>

                        {   nbAssetInTicket.map(({ label, count }) => {
                                return count > 0 ? (
                                        <div key={label} className="fo-ticket-modal-section">
                                            <p><strong>{label}:</strong> {count}</p>
                                        </div>
                                ) : null;
                            })
                        }

                        {selectedTicket.assets.length > 0 && (
                            <div className="fo-ticket-modal-section">
                                <h3>Ressources associées</h3>
                                {selectedTicket.assets.map((asset) => (
                                    <p key={`${asset.itemType}-${asset.id}`}>
                                        {asset.name} ({asset.itemType})
                                    </p>
                                ))}
                            </div>
                        )}

                        {selectedTicket.users.length > 0 && (
                            <div className="fo-ticket-modal-section">
                                <h3>Équipe</h3>
                                {selectedTicket.users.map((user) => (
                                    <p key={`${user.role}-${user.id}`}>
                                        {user.name} ({user.role})
                                    </p>
                                ))}
                            </div>
                        )}

                        {selectedTicket.costs.length > 0 && (
                            <div className="fo-ticket-modal-section">
                                <h3>Coûts associés</h3>
                                {selectedTicket.costs.map((cost) => (
                                    <p key={cost.id}>
                                        Durée: {cost.duration}s | Coût horaire: {cost.cost_time} | Total horaire: {getSommeCostByTime(cost)} | Coût fixe: {cost.cost_fixed}
                                    </p>
                                ))}
                                <p><strong>
                                    Durée totale: {getSommeDuration(selectedTicket.costs)}s |
                                    Coût horaire total: {getSommeTimeCost(selectedTicket.costs)} |
                                    Total horaire: {getTotalCostByTime(selectedTicket.costs)} |
                                    Coût fixe total: {getSommeFixedCost(selectedTicket.costs)}
                                </strong></p>
                                <p><strong>Total : {getSommeCost(selectedTicket.costs)}</strong></p>
                            </div>
                        )}
                    </div>
                </dialog>
            )}
            {showPopUp && (
                <dialog open onCancel={closePopUp}>
                    <div className="fo-ticket-modal">
                        <div className="fo-ticket-modal-header">
                            <button type="button" onClick={closePopUp}>Fermer</button>
                        </div>
                        <label htmlFor="area">Entrer un description</label>
                        <textarea  name="" id="area" onChange={(e) => setDescription(e.target.value)}/>
                        <button onClick={() => continuer()}>Continuer</button>
                    </div>
                </dialog>
            )}
        </div>
    )
}