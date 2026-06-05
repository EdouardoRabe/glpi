import { useState } from "react";
import { executeImport} from "../../backend/services/import/executeImport";

export default function BOImport() {
    const [file1, setFile1] = useState(null);

    const handleFileUpload = async () => {
        try {
            await executeImport(file1);
            console.log("Import terminé avec succès !");
        } catch (error) {
            console.log("Erreur lors de l'import: ", error);
        }
    };


    return (
        <div>
            <h1>BOImport</h1>

            <label htmlFor="file1">Fichier 1</label>
            <input id="file1" type="file" onChange={(event) => setFile1(event.target.files?.[0] ?? null)} />
            
            <button onClick={handleFileUpload}>Upload</button>
           
        </div>
    )
}