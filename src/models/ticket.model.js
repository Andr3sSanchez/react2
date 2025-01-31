import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    amount: Number,
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', TicketSchema);
