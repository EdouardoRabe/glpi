import api from "../utils/api";
import { clause, and, or, fetchAll } from "../utils/query";

class ComputerModel {

    static endpoint     = "Dropdowns/ComputerModel";
    static limit        = 100;
    static protectedIds = [];

    constructor(data = {}) {
        this.id             = data.id             ?? null;
        this.name           = data.name           ?? "";
        this.comment        = data.comment        ?? null;
        this.product_number = data.product_number ?? null;
        this.date_creation  = data.date_creation  ?? null;
        this.date_mod       = data.date_mod       ?? null;
    }

    async save() {
        if (this.id !== null) {
            throw new Error("save() : ce ComputerModel a déjà un ID, utilisez update()");
        }
        const result = await api.post(ComputerModel.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || "Erreur lors de la création du ComputerModel");
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : ce ComputerModel n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(ComputerModel.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du ComputerModel #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error("delete() : ce ComputerModel n'a pas d'ID");
        }
        const result = await api.del(ComputerModel.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du ComputerModel #${this.id}`);
        }
        this.id = null;
    }

    static async deleteAll() {
        await api.deleteAll(ComputerModel.endpoint, ComputerModel.protectedIds);
    }

    static fromArray(dataArray = []) {
        return dataArray.map(item => new ComputerModel(item));
    }

    static async #fetchAll(queryParams = {}) {
        const raw = await fetchAll(queryParams, ComputerModel.endpoint, ComputerModel.limit);
        return ComputerModel.fromArray(raw);
    }

    static async getAll() {
        return await ComputerModel.#fetchAll();
    }

    static async getById(id) {
        const result = await api.get(ComputerModel.endpoint, id);
        if (result?.error) {
            throw new Error(result.message || `ComputerModel #${id} introuvable (status ${result.status})`);
        }
        return new ComputerModel(result);
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await ComputerModel.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await ComputerModel.#fetchAll({ filter });
    }
}

export default ComputerModel;
