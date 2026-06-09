import { useEffect } from "react"
import Ticket from "../../backend/model/Ticket";
import StatusTicket from "../../backend/model/StatusTicket";
import { ticketGroupByStatus } from "../../backend/services/ticket";

export default function FOTicketList(){

    useEffect(()=>{
        const load = async () =>{
            const tic = await Ticket.getAll();
            const stat = await StatusTicket.getAll();
            const grouped = ticketGroupByStatus(tic, stat);
            console.log(grouped);
        }
        load();
    }, [])

    return (
        <div>
            <h1>Liste des tickets</h1>
        </div>
    )
}