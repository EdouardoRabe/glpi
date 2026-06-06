import api from "../utils/api";
import apiV1 from "../utils/apiV1";
import { clause, and, or, fetchAll } from "../utils/query";

class Computer {

    static endpoint    = "Assets/Computer";
    static limit       = 100;
    static protectedIds = [];

    constructor(data = {}) {
        this.id           = data.id           ?? null;
        this.name         = data.name         ?? "";
        this.serial       = data.serial       ?? null;
        this.otherserial  = data.otherserial  ?? null;
        this.comment      = data.comment      ?? null;
        this.is_deleted   = data.is_deleted   ?? false;
        this.date_creation = data.date_creation ?? null;
        this.date_mod     = data.date_mod     ?? null;

        // Relations {id, name}
        this.status       = data.status       ?? null;
        this.entity       = data.entity       ?? null;
        this.location     = data.location     ?? null;
        this.manufacturer = data.manufacturer ?? null;
        this.model        = data.model        ?? null;
        this.type         = data.type         ?? null;
        this.user         = data.user         ?? null;
        this.user_tech    = data.user_tech    ?? null;
    }

    getItemType() {
        return "Computer";
    }

    async getDocumentItem(){
        const item = await apiV1.getV1(`Computer/${this.id}/Document_Item`);
        return item;
    }

    async getImageUrl(){
        const item = await this.getDocumentItem();
        if (item.length === 0) {
            console.warn(`Aucun document trouvé pour Computer #${this.id}`);
            return null;
        }
        const document = `http://localhost/front/document.send.php?docid=${item[0].documents_id}&itemtype=Computer&items_id=${this.id}`;
        return document;
    }

      static async getAllComplete() {
        const computers = await Computer.getAll();
        const computersWithImages = await Promise.all(
            computers.map(async (computer) => ({
                computer,
                imageUrl: await computer.getImageUrl(),
            }))
        );
        return computersWithImages;
    }

    async getDocument(){
        const item = await this.getDocumentItem();
        if (item.length === 0) {
            console.warn(`Aucun document trouvé pour Computer #${this.id}`);
            return null;
        }
        const document = await apiV1.getV1(`Document/${item[0].documents_id}`);
        console.log(`Détails du Document lié à Computer #${this.id} :`, document);
        return document;
    }

 

    async save() {
        if (this.id !== null) {
            throw new Error("save() : ce computer a déjà un ID, utilisez update()");
        }
        const result = await api.post(Computer.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || "Erreur lors de la création du computer");
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : ce computer n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(Computer.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du computer #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error("delete() : ce computer n'a pas d'ID");
        }
        const result = await api.del(Computer.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du computer #${this.id}`);
        }
        this.id = null;
    }

    static async deleteAll() {
        await api.deleteAll(Computer.endpoint, Computer.protectedIds);
    }

    static fromArray(dataArray = []) {
        return dataArray.map(item => new Computer(item));
    }

    static async #fetchAll(queryParams = {}) {
        const raw = await fetchAll(queryParams, Computer.endpoint, Computer.limit);
        return Computer.fromArray(raw);
    }

    static async getAll() {
        return await Computer.#fetchAll();
    }

    static async getById(id) {
        const result = await api.get(Computer.endpoint, id);
        if (result?.error) {
            throw new Error(result.message || `Computer #${id} introuvable (status ${result.status})`);
        }
        return new Computer(result);
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await Computer.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await Computer.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await Computer.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await Computer.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await Computer.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await Computer.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await Computer.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await Computer.#fetchAll({ filter });
    }
}

export default Computer;
