import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import { getCostTicketAsset } from "../../backend/services/ticket";

export default function BOCostTicket(){

    const [tickets, setTickets] = useState(null);
    const [cost, setCost] =useState([]);

    useEffect(() => {
        const load = async () => {
          
            const ticketComplet = await Ticket.getAllComplete();
            console.log(ticketComplet, "ticket");
            const cost = getCostTicketAsset(ticketComplet) ;
            console.log(cost, "coute");
            setCost(cost);
            setTickets(ticketComplet);
        }
        load();
    }, [])


    return (
        <div>
            <h1>Page de cost</h1>
            {
                cost &&  cost.map( ({label, cost})=>(
                    <div key={label}>
                        <p>{label} - {cost}</p>
                    </div>
                )
                )
            }
        </div>
    )
}