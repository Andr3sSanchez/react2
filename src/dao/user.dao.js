import UserModel from '../models/user.model.js';

export default class UserDAO {
    async findByEmail(email) {
        
        return await UserModel.findOne({ email });
    }

    async create(userData) {
        const newUser = new UserModel(userData);
        return await newUser.save();
    }

    async findById(id) {
        return await UserModel.findById(id);
    }
}
