import {importFile1} from "./importFile1";
import {importFile2} from "./importFile2";

export const executeImport = async (file1, file2) => {
    try {
        if (file1) {
            await importFile1(file1);
        }   
        if (file2) {
            await importFile2(file2);
        }
    } catch (error) {
        console.error("Erreur lors de l'import : ", error);
    }   
}

export default executeImport;