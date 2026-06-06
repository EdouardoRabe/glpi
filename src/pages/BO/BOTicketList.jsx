import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";

export default function BOTicketList() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const loadTickets = async () => {
            const tic = await Ticket.getAllComplete();
            setTickets(tic);
        };  
        loadTickets();
    }, []);



    return (
        <div>
            <h1>Tickets</h1>
                {
                    tickets.map(({ ticket, assets, costs }) => (
                            <div key={ticket.id}>
                                <h2>{ticket.name}</h2>
                                <p>nb computer: {assets.filter((asset) => asset.getItemType() === "Computer").length}</p>
                                <p>nb monitor: {assets.filter((asset) => asset.getItemType() === "Monitor").length}</p>
                                {assets.map((asset) => (
                                        <p key={asset.id}>{asset.name} - type: {asset.getItemType()}</p>
                                    )
                                )}
                                {costs.length > 0 && (
                                    <div>
                                        <p>Coûts associés :</p>
                                        {costs.map((cost) => (
                                            <p key={cost.id}>
                                                Durée : {cost.duration}s, Coût temps : {cost.cost_time}, Coût fixe : {cost.cost_fixed}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )
                }
        </div>
    );
}