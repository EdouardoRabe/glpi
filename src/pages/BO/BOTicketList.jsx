import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";

export default function BOTicketList() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getAllWithAssets();
            setTickets(tic);
        };  
        loadTickets();
    }, []);


    return (
        <div>
            <h1>Tickets</h1>
                {
                    tickets.map(({ ticket, assets }) => (
                            <div key={ticket.id}>
                                <p>{ticket.name}</p>
                                {assets.map((asset) => (
                                        <p key={asset.id}>{asset.name} - type: {asset.getItemType()}</p>
                                    )
                                )}
                            </div>
                        )
                    )
                }
        </div>
    );
}