import api from "../utils/api";
import { clause, and, or, fetchAll } from "../utils/query";

class User {

    static endpoint     = "Administration/User";
    static limit        = 100;
    static protectedIds = [1, 2];

    constructor(data = {}) {
        this.id            = data.id            ?? null;
        this.username      = data.username      ?? "";
        this.realname      = data.realname      ?? null;
        this.firstname     = data.firstname     ?? null;
        this.is_active     = data.is_active     ?? true;
        this.is_deleted    = data.is_deleted    ?? false;
        this.comment       = data.comment       ?? null;
        this.date_creation = data.date_creation ?? null;
        this.date_mod      = data.date_mod      ?? null;
        this.location      = data.location      ?? null;
        this.default_profile = data.default_profile ?? null;
        this.default_entity  = data.default_entity  ?? null;
    }

    async save() {
        if (this.id !== null) {
            throw new Error("save() : ce User a déjà un ID, utilisez update()");
        }
        const result = await api.post(User.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || "Erreur lors de la création du User");
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : ce User n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(User.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du User #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error("delete() : ce User n'a pas d'ID");
        }
        const result = await api.del(User.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du User #${this.id}`);
        }
        this.id = null;
    }

    static async deleteAll() {
        await api.deleteAll(User.endpoint, User.protectedIds);
    }

    static fromArray(dataArray = []) {
        return dataArray.map(item => new User(item));
    }

    static async #fetchAll(queryParams = {}) {
        const raw = await fetchAll(queryParams, User.endpoint, User.limit);
        return User.fromArray(raw);
    }

    static async getAll() {
        return await User.#fetchAll();
    }

    static async getById(id) {
        const result = await api.get(User.endpoint, id);
        if (result?.error) {
            throw new Error(result.message || `User #${id} introuvable (status ${result.status})`);
        }
        return new User(result);
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await User.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await User.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await User.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await User.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await User.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await User.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await User.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await User.#fetchAll({ filter });
    }
}

export default User;
