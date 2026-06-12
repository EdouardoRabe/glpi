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
                <table>
                    <thead>
                        <tr>
                            <th>Type d'asset</th>
                            <th>Coût</th>
                            <th>Super Coût</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cost?.map(({ label, cost: c, super_cost, total }) =>       {
                            return (
                                <tr key={label}>
                                    <td>{label}</td>
                                    <td>{c}</td>
                                    <td>{super_cost}</td>
                                    <td>{total}</td>
                                </tr>
                            )
                        }                  
                        )}
                    </tbody>
                </table>
        </div>
    )
}