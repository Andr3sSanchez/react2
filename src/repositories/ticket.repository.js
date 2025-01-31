import TicketDAO from '../dao/ticket.dao.js';

export default class TicketRepository {
    constructor() {
        this.dao = new TicketDAO();
    }

    async create(ticketData) {
        return await this.dao.create(ticketData);
    }
}
