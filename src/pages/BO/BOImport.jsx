import { useState } from "react";
import { executeImport} from "../../backend/services/import/executeImport";
import "../../css/pages/BO/BOImport.css";

export default function BOImport() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileUpload = async () => {
        try {
            await executeImport(file1, file2, file3, file4);
            setMessage({ type: "success", text: "Import terminé avec succès !" });
        } catch (error) {
            console.log("Erreur lors de l'import: ", error);
            setMessage({ type: "error", text: "Erreur lors de l'import." });
        }
    };

    return (
        <div className="bo-import">
            <h1>Import Data</h1>
             {message && (
                    <div className={message.type === "success" ? "fo-create-ticket-success" : "fo-create-ticket-error"}>
                        {message.text}
                    </div>
            )}
            <div className="bo-import-form">
                <div className="bo-import-form-group">
                    <label htmlFor="file1">Fichier 1 (CSV)</label>
                    <input id="file1" type="file" onChange={(event) => setFile1(event.target.files?.[0] ?? null)} accept=".csv" />
                </div>
                <div className="bo-import-form-group">
                    <label htmlFor="file2">Fichier 2 (CSV)</label>
                    <input id="file2" type="file" onChange={(event) => setFile2(event.target.files?.[0] ?? null)} accept=".csv" />
                </div>

                <div className="bo-import-form-group">
                    <label htmlFor="file3">Fichier 3 (CSV)</label>
                    <input id="file3" type="file" onChange={(event) => setFile3(event.target.files?.[0] ?? null)} accept=".csv" />
                </div>

                <div className="bo-import-form-group">
                    <label htmlFor="file4">Fichier 4 (ZIP)</label>
                    <input id="file4" type="file" onChange={(event) => setFile4(event.target.files?.[0] ?? null)} accept=".zip" />
                </div>

                <div className="bo-import-actions">
                    <button onClick={handleFileUpload}>Upload Files</button>
                </div>
            </div>
        </div>
    )
}