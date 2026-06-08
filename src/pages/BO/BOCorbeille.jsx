import { useEffect } from "react";
import {put, get, post, del} from "../../backend/utils/expressApi.js"
import { useState } from "react";
import Ticket from "../../backend/model/Ticket.js";

export default function BOCorbeille(){
        const [onCorbeille, setOnCorbeille] = useState([]);
        const [delet , setDelet] = useState([]);

        useEffect(() => {
            const fetchConfig = async () => {
                try {
                    const deleted = await get('/corbeille');
                    const tabDeleted = deleted.map((del) => del.idticket);
                    const on = tabDeleted.length > 0 ? await Ticket.getIncl(tabDeleted) : [];
                    console.log(on);
                    setDelet(deleted)
                    setOnCorbeille(on);
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            fetchConfig();
    }, []);

    const toRestore = async (id)=>{
        console.log("Ho averina ", id);
        const del2 = delet.filter((d) => d.idticket == id);
        console.log("Ho averina ", del2[0]);
        await del(`/corbeille/${del2[0].id}`);

    }


    return (
        <div>
            <h1>Corbeille</h1>
            <table>
                <tr>
                    <th>ID</th>
                    <th>REF</th>
                    <th>NAME</th>
                    <th>ACTION</th>
                </tr>
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
            </table>
        </div>
    )
}
