import { TICKET_TYPE } from "../utils/utils"; 
import { ITEM_TYPES } from "../utils/type";
import { getCostTotal } from "./cost";

export function nbTicketsByType(tickets, typeId) {
    return tickets.filter((t) => Number(t.type) === Number(typeId)).length;
}

export function ticketsByType(tickets, typeId) {
    return tickets.filter((t) => Number(t.type) === Number(typeId));
}

export function nbTicketsByStatus(tickets, statusId) {
    return tickets.filter((t) => Number(t.status.id) === Number(statusId)).length;
}

export function ticketsByStatus(tickets, statusId) {
    return tickets.filter((t) => Number(t.status.id) === Number(statusId));
}

export function getCostTicketByStatus(tickets, statusId) {
    const filtered = ticketsByStatus(tickets, statusId);
    return getCostTotal(filtered);
}

export function getCostTicketCompletByStatus(tickets, statusId) {
    const filtered = ticketsCompletByStatus(tickets, statusId);
    return getCostTotal(filtered);

}

export function getCostTicketByStatusAll(tickets, status){
    return status.map((stat) => {
        const cost = getCostTicketByStatus(tickets, stat.id_status);
        return { label: stat.name, cost };
    });
}

export function getCostTicketCompletByStatusAll(tickets, status){
    return status.map((stat) => {
        const cost = getCostTicketCompletByStatus(tickets, stat.id_status);
        return { label: stat.name, cost };
    });
}

export function ticketGroupByStatus(tic, statusList) {
    return statusList.map((stat) => {
        const status = stat;
        const tickets = ticketsByStatus(tic, stat.id_status);
        return { status,  tickets };
    });
}

export function ticketsCompletByStatus(tickets, statusId) {
    return tickets.filter((t) => Number(t.ticket.status.id) === Number(statusId));
}

export function ticketCompletGroupByStatus(tic, statusList) {
    return statusList.map((stat) => {
        const status = stat;
        const tickets = ticketsCompletByStatus(tic, stat.id_status);
        return { status,  tickets };
    });
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
export function nbTicketWithAssetIsAll(ticketsCompletes, type) {
    return ticketsCompletes.filter((ticket) => ticket.assets.every((asset) => asset.itemType === type)).length;
}

export function ticketWithAsset(ticketsCompletes, type) {
    return ticketsCompletes.filter((ticket) => ticket.assets.some((asset) => asset.itemType === type));
}

export function ticketWithAssetIsAll(ticketsCompletes, type) {
    return ticketsCompletes.filter((ticket) => ticket.assets.every((asset) => asset.itemType === type));
}

export function getCostTicketAsset(ticketsCompletes, type){
    const filtered = ticketWithAsset(ticketsCompletes, type);
    return getCostTotal(filtered);
}

export function getCostTicketAssetIsAll(ticketsCompletes, type){
    const filtered = ticketWithAssetIsAll(ticketsCompletes, type);
    return getCostTotal(filtered);
}

export function getCostTicketsAssets(ticketsCompletes) {
    return ITEM_TYPES.map((type) => {
        const cost =  getCostTicketAsset(ticketsCompletes, type);
        return { label: type, cost };
    });
}

export function getCostTickestAssetsIsAll(ticketsCompletes) {
    return ITEM_TYPES.map((type) => {
        const cost =  getCostTicketAssetIsAll(ticketsCompletes, type);
        return { label: type, cost };
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

