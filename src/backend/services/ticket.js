import { TICKET_TYPE } from "../utils/utils"; 

export function nbTicketsByType(tickets, typeId) {
    return tickets.filter((t) => Number(t.type) === Number(typeId)).length;
}

export function nbTicketsByTypes(tickets) {
    return TICKET_TYPE.reduce((acc, type) => {
        const label = type.name;
        acc[label] = nbTicketsByType(tickets, type.id);
        return acc;
    }, {});
}