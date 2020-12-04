const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cell = {text: '', blocked: false, agent: ''};

const tableSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: true
    },
    content: {
        type: JSON,
        required: false,
        default: [
            [cell, cell, cell],
            [cell, cell, cell],
            [cell, cell, cell],
        ]
    }
});

module.exports = mongoose.model('Table', tableSchema);