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

export function nbTicketWithAsset(tickets, type) {
    return tickets.filter((ticket) => ticket.assets.some((asset) => asset.itemType === type)).length;
}

export function nbTicketsWithAsset(tickets) {
    return ITEM_TYPES.map((type) => {
        const count = nbTicketWithAsset(tickets, type);
        return { label: type, count };
    });
}

export function getNbAssetInTickets(ticket) {
    return ITEM_TYPES.map((type) => {
        const count = ticket.assets.filter((a) => a.itemType === type).length;
        return { label: type, count };
    });
}