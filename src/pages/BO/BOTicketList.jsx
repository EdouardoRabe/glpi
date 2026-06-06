import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";

export default function BOTicketList() {
    const [tickets, setTickets] = useState(new Map());

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getTicketsWithItems();
            setTickets(tic);
        };  
        loadTickets();
    }, []);


    return (
        <div>
            <h1>Tickets</h1>
                {
                    Array.from(tickets.entries()).map( ([ ticketId, {ticket,items, nbCom, nbMon} ]) =>(
                            <div key={ticketId}>
                                <p>{ticket.name}</p>
                                <p>Ordinateurs : {nbCom}</p>
                                <p>Moniteurs : {nbMon}</p>
                                {items.map( (asset) => (
                                        <p key={asset.id}>{asset.name}- type: {asset.getItemType()}</p>
                                    )
                                )}
                            </div>
                        )
                    )
                }
        </div>
    );
}