import api from "../utils/api";
import apiV1 from "../utils/apiV1"
import { clause, and, or, fetchAll } from "../utils/query";
import Computer from "./Computer";
import Monitor from "./Monitor";

class Ticket {

    static endpoint = "Assistance/Ticket";
    static limit    = 100;
    static protectedIds = []; 

    constructor(data = {}) {
        this.id                              = data.id                              ?? null;
        this.name                            = data.name                            ?? "";
        this.content                         = data.content                         ?? "";
        this.type                            = data.type                            ?? 1;
        this.status                          = data.status                          ?? null;
        this.priority                        = data.priority                        ?? 1;
        this.urgency                         = data.urgency                         ?? 1;
        this.impact                          = data.impact                          ?? 1;
        this.global_validation               = data.global_validation               ?? 1;
        this.is_deleted                      = data.is_deleted                      ?? false;
        this.external_id                     = data.external_id                     ?? null;

        this.date                            = data.date                            ?? null;
        this.date_creation                   = data.date_creation                   ?? null;
        this.date_mod                        = data.date_mod                        ?? null;
        this.date_close                      = data.date_close                      ?? null;
        this.date_solve                      = data.date_solve                      ?? null;
        this.begin_waiting_date              = data.begin_waiting_date              ?? null;
        this.take_into_account_date          = data.take_into_account_date          ?? null;
        this.resolution_date                 = data.resolution_date                 ?? null;
        this.internal_resolution_date        = data.internal_resolution_date        ?? null;
        this.internal_take_into_account_date = data.internal_take_into_account_date ?? null;

        this.actiontime                      = data.actiontime                      ?? 0;
        this.close_duration                  = data.close_duration                  ?? 0;
        this.resolution_duration             = data.resolution_duration             ?? 0;
        this.waiting_duration                = data.waiting_duration                ?? 0;
        this.take_into_account_duration      = data.take_into_account_duration      ?? 0;
        this.ola_waiting_duration            = data.ola_waiting_duration            ?? 0;
        this.sla_waiting_duration            = data.sla_waiting_duration            ?? 0;

        this.entity                          = data.entity                          ?? null;
        this.location                        = data.location                        ?? null;
        this.category                        = data.category                        ?? null;
        this.request_type                    = data.request_type                    ?? null;
        this.user_recipient                  = data.user_recipient                  ?? null;
        this.user_editor                     = data.user_editor                     ?? null;

        this.sla_tto                         = data.sla_tto                         ?? null;
        this.sla_ttr                         = data.sla_ttr                         ?? null;
        this.sla_level_ttr                   = data.sla_level_ttr                   ?? null;
        this.ola_tto                         = data.ola_tto                         ?? null;
        this.ola_ttr                         = data.ola_ttr                         ?? null;
        this.ola_level_ttr                   = data.ola_level_ttr                   ?? null;
        this.ola_tto_begin_date              = data.ola_tto_begin_date              ?? null;
        this.ola_ttr_begin_date              = data.ola_ttr_begin_date              ?? null;

        this.team                            = data.team                            ?? [];
        this.costs                           = data.costs                           ?? [];
    }

    async getItems(){
        const items = await apiV1.getV1(`Ticket/${this.id}/Item_Ticket`);
        return items;
    }

    async getItemsAssets(){
        const items = await this.getItems();
        const assets = await Promise.all(items.map(item => {
            return item.itemtype === "Computer"
                ? Computer.getById(item.items_id)
                : Monitor.getById(item.items_id);
        }));
        return assets;
    }

    static async getAllWithAssets() {
        const tickets = await Ticket.getAll();
        const ticketsWithItems = await Promise.all(
            tickets.map(async (ticket) => ({
                ticket,
                assets: await ticket.getItemsAssets(),
            }))
        );
        return ticketsWithItems;
    }

    async save() {
        if (this.id !== null) {
            throw new Error("save() : ce ticket a déjà un ID, utilisez update()");
        }
        const result = await api.post(Ticket.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || "Erreur lors de la création du ticket");
        }
        this.id = result.id ?? null;
        return this;
    }

    async saveItems(items = []) {
        if (this.id === null) {
            throw new Error("saveItems() : ce ticket n'a pas d'ID");
        }
        const results = [];
        for (const item of items) {
            const payload = {
                input: {
                    tickets_id: this.id,
                    itemtype: item.getItemType(),
                    items_id: item.id,
                },
            };
            const result = await apiV1.postV1(`Ticket/${this.id}/Item_Ticket`, payload);
            if (result?.error) {
                console.warn(`Association item #${item.id} (type ${item.getItemType()}) au ticket #${this.id} échouée : ${result.message || JSON.stringify(result)}`);
            } else {
                console.log(`Association item #${item.id} (type ${item.getItemType()}) au ticket #${this.id} réussie`);
            }
            results.push(result);
        }
        return results;
    }

    async saveWithItems(items = []) {
        await this.save();
        await this.saveItems(items);
    }


    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : ce ticket n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(Ticket.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du ticket #${this.id}`);
        }
        return this;
    }
 
    async delete() {
        if (this.id === null) {
            throw new Error("delete() : ce ticket n'a pas d'ID");
        }
        const result = await api.del(Ticket.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du ticket #${this.id}`);
        }
        this.id = null;
    }

    static async deleteAll() {
        await api.deleteAll(Ticket.endpoint, Ticket.protectedIds);
    }

    static fromArray(dataArray = []) {
        return dataArray.map(item => new Ticket(item));
    }

    static async #fetchAll(queryParams = {}) {
        const raw = await fetchAll(queryParams, Ticket.endpoint, Ticket.limit);
        return Ticket.fromArray(raw);
    }


    static async getAll() {
        return await Ticket.#fetchAll();
    }

    static async getById(id) {
        const result = await api.get(Ticket.endpoint, id);
        if (result?.error) {
            throw new Error(
                result.message || `Ticket #${id} introuvable (status ${result.status})`
            );
        }
        return new Ticket(result);
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await Ticket.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(
            ...criteria.map(({ column, value }) => clause(column, "==", value))
        );
        return await Ticket.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(
            ...criteria.map(({ column, value }) => clause(column, "==", value))
        );
        return await Ticket.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await Ticket.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(
            ...criteria.map(({ column, value }) => clause(column, "!=", value))
        );
        return await Ticket.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(
            ...criteria.map(({ column, value }) => clause(column, "!=", value))
        );
        return await Ticket.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await Ticket.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await Ticket.#fetchAll({ filter });
    }

    
}

export default Ticket;