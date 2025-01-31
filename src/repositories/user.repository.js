import UserDAO from '../dao/user.dao.js';

export default class UserRepository {
    constructor() {
        this.dao = new UserDAO();
    }

    async findByEmail(email) {
        // Usar el método correcto del DAO
        return await this.dao.findByEmail(email);
    }

    async create(userData) {
        return await this.dao.create(userData);
    }

    async findById(id) {
        return await this.dao.findById(id);
    }
}
