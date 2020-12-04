const { json } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Table = require('../../models/table');

// @route   GET api/tables
// @desc    Tables of user
// @access  Private
router.get('/', auth, (req, res) => {
    Table.find({user_id: req.user.id})
        .then( tables => {
            res.json( { tables: tables.map( item => {
                return {
                    id: item.id,
                    name: item.name
                }
            }) });
        })
});

// @route   GET api/tables/:id/
// @desc    Single table 
// @access  Private
router.get('/:id', auth, (req, res) => {
    const {id} = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Table.findById(id)
            .then( table => {
                if(!table) return res.status(404).json( {msg: `Table '${id}' does not exists`});

                return res.json( { result: table });
            });
    } else {
        return res.status(404).json( {msg: `Incorrect id '${id}'`});
    }
});

// @route   GET api/tables/create
// @desc    Tables of user
// @access  Private
router.post('/create', auth, (req, res) => {
    const {name} = req.body;

    if(!name) return res.status(400).json( {msg: 'Enter name of table'});

    const newTable = new Table({
        name,
        user_id: req.user.id
    });

    newTable.save()
        .then( table => {
            res.status(201).json({
                table: {
                    id: table.id,
                    name: table.name
                }
            });
        })
        .catch( err => {
            res.status(400).json({ msg: `Something goes wrong. ${JSON.stringify(err)}`});
        });
});

module.exports = router;