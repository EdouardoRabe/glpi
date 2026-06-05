import api from "../utils/api";
import { clause, and, or, fetchAll } from "../utils/query";

class Monitor {

    static endpoint     = "Assets/Monitor";
    static limit        = 100;
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

    async save() {
        if (this.id !== null) {
            throw new Error("save() : ce monitor a déjà un ID, utilisez update()");
        }
        const result = await api.post(Monitor.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || "Erreur lors de la création du monitor");
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : ce monitor n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(Monitor.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du monitor #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error("delete() : ce monitor n'a pas d'ID");
        }
        const result = await api.del(Monitor.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du monitor #${this.id}`);
        }
        this.id = null;
    }

    static async deleteAll() {
        await api.deleteAll(Monitor.endpoint, Monitor.protectedIds);
    }

    static fromArray(dataArray = []) {
        return dataArray.map(item => new Monitor(item));
    }

    static async #fetchAll(queryParams = {}) {
        const raw = await fetchAll(queryParams, Monitor.endpoint, Monitor.limit);
        return Monitor.fromArray(raw);
    }

    static async getAll() {
        return await Monitor.#fetchAll();
    }

    static async getById(id) {
        const result = await api.get(Monitor.endpoint, id);
        if (result?.error) {
            throw new Error(result.message || `Monitor #${id} introuvable (status ${result.status})`);
        }
        return new Monitor(result);
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await Monitor.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await Monitor.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await Monitor.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await Monitor.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await Monitor.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await Monitor.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await Monitor.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await Monitor.#fetchAll({ filter });
    }
}

export default Monitor;
