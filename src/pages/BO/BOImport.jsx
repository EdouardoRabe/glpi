import { useState } from "react";
import { executeImport} from "../../backend/services/import/executeImport";

export default function BOImport() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const handleFileUpload = async () => {
        try {
            await executeImport(file1, file2, file3, file4);
            console.log("Import terminé avec succès !");
        } catch (error) {
            console.log("Erreur lors de l'import: ", error);
        }
    };


    return (
        <div>
            <h1>BOImport</h1>

            <label htmlFor="file1">Fichier 1</label>
            <input id="file1" type="file" onChange={(event) => setFile1(event.target.files?.[0] ?? null)} accept=".csv" />

            <label htmlFor="file2">Fichier 2</label>
            <input id="file2" type="file" onChange={(event) => setFile2(event.target.files?.[0] ?? null)} accept=".csv" />

            <label htmlFor="file3">Fichier 3</label>
            <input id="file3" type="file" onChange={(event) => setFile3(event.target.files?.[0] ?? null)} accept=".csv" />

            <label htmlFor="file4">Fichier 4</label>
            <input id="file4" type="file" onChange={(event) => setFile4(event.target.files?.[0] ?? null)} accept=".zip" />

            <button onClick={handleFileUpload}>Upload</button>
           
        </div>
    )
}