import {importFile1} from "./importFile1";
import {importFile2} from "./importFile2";
import {importFile3} from "./importFile3";
import {importFile4} from "./importFile4";

export const executeImport = async (file1, file2, file3, file4) => {
    try {
        if (file1) {
            await importFile1(file1);
        }   
        if (file2) {
            await importFile2(file2);
        }
        if (file3) {
            await importFile3(file3);
        }
        if (file4) {
            await importFile4(file4);
        }
    } catch (error) {
        console.error("Erreur lors de l'import : ", error);
    }   
}

export default executeImport;