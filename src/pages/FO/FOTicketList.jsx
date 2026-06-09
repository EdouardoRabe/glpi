import { useEffect, useState } from "react"
import Ticket from "../../backend/model/Ticket";
import StatusTicket from "../../backend/model/StatusTicket";
import { ticketCompletGroupByStatus} from "../../backend/services/ticket";

export default function FOTicketList(){
    const [groups, setGroups] = useState([]);
    const [draggedTicket, setDraggetTicket] = useState(null);

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
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}