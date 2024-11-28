const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    shape: { type: String, required: true },
    online: { type: Boolean, default: false },
});

const RoomSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    tables: [TableSchema],
});

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
