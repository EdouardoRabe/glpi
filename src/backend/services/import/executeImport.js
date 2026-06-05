import {importFile1} from "./importFile1";

export const executeImport = async (file1) => {
    try {
        if (!file1) {
            console.warn("Aucun fichier sélectionné pour l'import.");
        }
        else{
            await importFile1(file1);
            console.log("ImportFile1 terminé avec succès !");
        }
    } catch (error) {
        console.error("Erreur lors de l'import : ", error);
    }   
}

export default executeImport;