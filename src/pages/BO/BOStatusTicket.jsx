import { useEffect } from "react"
import StatusTicket from "../../backend/model/StatusTicket";

export default function BOStatusTicket () {

    useEffect(() => {
        const load = async () => {
            const status = await StatusTicket.getByIdByMalagasyName("Vita");
            console.log("status: ", status);
        }   
        load();
    }, [])

    return (
        <div>

        </div>
    )
}
