const express = require('express');
const db = require('./model');
const router = express.Router();

router.get('/recipes', async (req, res, next) => {});

router.get('/ShoppingList/:id', async (req, res, next) => {});

router.get('/steps/:id', async (req, res, next) => {});

module.exports = router;
