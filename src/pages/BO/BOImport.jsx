import { useState } from "react";
import ticket from "../../backend/services/import/import";
import Ticket from "../../backend/model/Ticket";

export default function BOImport() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files?.[0] ?? null);
    };

    const handleFileUpload = async () => {
        try {
            await ticket(file);
            
            const tickets2 = await Ticket.getAll();
            console.log("Fetched tickets:", tickets2);

        } catch (error) {
            console.log("Erreur lors de l'import: ", error);
        }
    };


    return (
        <div>
            <h1>BOImport</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    )
}