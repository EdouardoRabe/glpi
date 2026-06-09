import { useEffect, useState } from "react"
import Ticket from "../../backend/model/Ticket";
import StatusTicket from "../../backend/model/StatusTicket";
import { ticketCompletGroupByStatus} from "../../backend/services/ticket";

export default function FOTicketList(){
    const [groups, setGroups] = useState([]);

    useEffect(()=>{
        const load = async () =>{
            const tic = await Ticket.getAllComplete();
            const stat = await StatusTicket.getAll();
            const grouped = ticketCompletGroupByStatus(tic, stat);
            setGroups(grouped);
        }
        load();
    }, [])

    return (
        <div>
            <h1>Liste des tickets</h1>
            <div>
                {
                    groups.map((group) => (
                        <div key={`${group.status.id_status}`}>
                            <h2>{group.status.french_name}</h2>
                            {
                                group.tickets.map((tic) => (
                                    <div key={`${tic.ticket.id}-${tic.ticket.external_id}`}>
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