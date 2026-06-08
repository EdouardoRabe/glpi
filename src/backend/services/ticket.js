import { TICKET_TYPE } from "../utils/utils"; 
import { ITEM_TYPES } from "../utils/type";

export function nbTicketsByType(tickets, typeId) {
    return tickets.filter((t) => Number(t.type) === Number(typeId)).length;
}

export function nbTicketsByTypes(tickets) {
    return TICKET_TYPE.map((type) => {
        const label = type.name;
        const count = nbTicketsByType(tickets, type.id);
        return { label, count };
    });
}

export function nbTicketWithAsset(tickets) {
    return ITEM_TYPES.map((type) => {
        const count = tickets.reduce((acc, ticket) => {
            const hasType = ticket.assets.some((asset) => asset.itemType === type);
            return hasType ? acc + 1 : acc;
        }, 0);
        return count > 0 && { label: type, count };
    });
}