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
            console.log(grouped);
        }
        load();
    }, [])

    return (
        <div>
            <h1>Liste des tickets</h1>
            <div>
                {/* {
                    groups.map((group) => (
                        <div key={`${group.status.id_status}-${group.ticket.id}`}>

                        </div>
                    ))
                } */}
            </div>
        </div>
    )
}