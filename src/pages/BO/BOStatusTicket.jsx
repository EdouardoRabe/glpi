import { useEffect } from "react"
import { get } from "../../backend/utils/expressApi"

export default function BOStatusTicket () {

    useEffect(() => {
        const load = async () => {
            const status = await get("/status");
            console.log("status: ", status);
        }   
        load();
    }, [])

    return (
        <div>

        </div>
    )
}
