import { useEffect } from "react";
import {put, get, post, del} from "../../backend/utils/expressApi.js"
import { useState } from "react";
import Ticket from "../../backend/model/Ticket.js";

export default function BOCorbeille(){
        const [onCorbeille, setOnCorbeille] = useState([]);

        useEffect(() => {
            const fetchConfig = async () => {
                try {
                    const deleted = await get('/corbeille');
                    const tabDeleted = deleted.map((del) => del.idticket);
                    const on = tabDeleted.length > 0 ? await Ticket.getIncl(tabDeleted) : [];
                    console.log(on);
                    setOnCorbeille(on);
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            fetchConfig();
    }, []);

    const toRestore = async (id)=>{
        console.log("Ho averina ", id);
        await del(`/corbeille/${id}`);
        const updatedOnCorbeille = onCorbeille.filter((ticket) => ticket.id !== id);
        setOnCorbeille(updatedOnCorbeille);
    }


    return (
        <div>
            <h1>Corbeille</h1>
            { onCorbeille.length===0 ? <p>Aucun ticket dans la corbeille.</p> : (<table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>REF</th>
                        <th>NAME</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        onCorbeille.map((ticket) =>(
                            <tr key={`${ticket.id}-${ticket.name}`}>
                                <td>{ticket.id}</td>
                                <td>{ticket.external_id}</td>
                                <td>{ticket.name}</td>
                                <td>
                                    <div className="bo-ticket-item-actions">
                                    <button type="button" onClick={() => toRestore(ticket.id)}>
                                        Restorer
                                    </button>
                                </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>)}
        </div>
    )
}
