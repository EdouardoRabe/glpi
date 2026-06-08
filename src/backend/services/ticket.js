import { TICKET_TYPE } from "../utils/utils"; 
import { ITEM_TYPES } from "../utils/type";
import { getCostTotal } from "./cost";

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

export function nbTicketWithAsset(ticketsCompletes, type) {
    return ticketsCompletes.filter((ticket) => ticket.assets.some((asset) => asset.itemType === type)).length;
}

export function ticketWithAsset(ticketsCompletes, type) {
    return ticketsCompletes.filter((ticket) => ticket.assets.some((asset) => asset.itemType === type));
}

export function getCostTicketAsset(ticketsCompletes, type){
    const filtered = ticketWithAsset(ticketsCompletes, type);
    return getCostTotal(filtered);
}

export function nbCostTicketAssets(ticketsCompletes) {
    return ITEM_TYPES.map((type) => {
        const count =  getCostTicketAsset(ticketsCompletes, type);
        return { label: type, count };
    });
}

export function nbTicketsWithAsset(ticketsCompletes) {
    return ITEM_TYPES.map((type) => {
        const count = nbTicketWithAsset(ticketsCompletes, type);
        return { label: type, count };
    });
}

export function getNbAssetInTicket(ticketComplete) {
    return ITEM_TYPES.map((type) => {
        const count = ticketComplete.assets.filter((a) => a.itemType === type).length;
        return { label: type, count };
    });
}

