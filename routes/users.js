'use strict';
var express = require('express');
var router = express.Router();

var logger = require("../services/logging");

/* GET users listing. */
router.get('/', function (req, res) {
    try {
        var usersDb = require("../models/user");
        try {
            var users = usersDb.getUsers();

            res.send(users);
        } catch (error) {
            res.send(500, "There was error in this request.");
        }
    } catch (error) {
        logger.logError("users", new Error("Something is wrong with the connectivity of the modules."));
        res.send(500, "There was an error in the module.");
    }
});

module.exports = router;
