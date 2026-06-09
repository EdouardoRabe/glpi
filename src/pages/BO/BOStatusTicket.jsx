import { useEffect, useState } from "react"
import StatusTicket from "../../backend/model/StatusTicket";

export default function BOStatusTicket () {
    const [statusTicket, setStatusTicket] = useState([]);

    useEffect(() => {
        const load = async () => {
            const status = await StatusTicket.getAll();
            setStatusTicket(status);
        }   
        load();
    }, [])

    const handleChange = (idstatus, key, value)=>{
        setStatusTicket( prev =>
                                            prev.map(item =>
                                                item.id_status === idstatus
                                                    ? {
                                                        ...item,
                                                         [key] : value
                                                    }
                                                    : item
                                            )
        )
    }


    return (
        <div>
            <h1>Modifier les statuts de tickets</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID STATUS</th>
                        <th>NOM</th>
                        <th>MALAGASY NAME</th>
                        <th>COLOR</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        statusTicket.map((state)=>(
                            <tr key={`${state.id_status}-${state.french_name}`}>
                                <td>{state.id_status}</td>
                                <td>{state.french_name}</td>
                                <td>
                                    <input type="text" defaultValue={state.malagasy_name} onChange={(e) => handleChange(state.id_status, "malagasy_name", e.target.value)} />
                                    <button >Changer</button>
                                </td>
                                <td>
                                    <div
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: state.color,
                                        }}
                                    />
                                    <input type="color" defaultValue={state.color}  onChange={(e) => handleChange(state.id_status, "color", e.target.value)}/>
                                    <button>Changer</button>
                                </td>
                                 
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
