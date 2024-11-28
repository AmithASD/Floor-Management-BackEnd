const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Add a new room
router.post("/add-room", async (req, res) => {
    try {
        const { id, name } = req.body;
        const room = new Room({ id, name, tables: [] });
        await room.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Error adding room", error });
    }
});

// Add a table to a room
router.post("/add-table", async (req, res) => {
    try {
        const { roomId, table } = req.body;
        console.log("body ============>>>", req.body)

        const parsedTable = typeof table === 'string' ? JSON.parse(table) : table;

        // Validate the parsed object
        if (!roomId || !parsedTable.id || !parsedTable.name) {
            throw new Error('Invalid data');
        }
        res.status(200).json({ message: 'Table added successfully', data: parsedTable });
    } catch (error) {
        res.status(400).json({ message: 'Error adding table', error: error.message });
    }
});

// Update table position or details
router.put("/update-table", async (req, res) => {
    try {
        const { roomId, tableId, x, y, ...otherDetails } = req.body;
        const room = await Room.findOne({ id: roomId });
        if (!room) return res.status(404).json({ message: "Room not found" });

        const table = room.tables.id(tableId);
        if (!table) return res.status(404).json({ message: "Table not found" });

        table.x = x || table.x;
        table.y = y || table.y;
        Object.assign(table, otherDetails);

        await room.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Error updating table", error });
    }
});

// Delete a table
router.delete("/delete-table", async (req, res) => {
    try {
        const { roomId, tableId } = req.body;
        const room = await Room.findOne({ id: roomId });
        if (!room) return res.status(404).json({ message: "Room not found" });

        room.tables = room.tables.filter((table) => table.id !== tableId);
        await room.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Error deleting table", error });
    }
});

// Get all rooms
router.get("/rooms", async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms", error });
    }
});

module.exports = router;
