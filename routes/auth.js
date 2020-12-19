const router = require('express').Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//Controlers
const db = require('../models/basicModel');
const authControler = require('../models/authModel');

const table = 'streamers';

router.post('/register', async (req, res, next) => {
	try {
		const data = req.body;
		const { username, password, email } = data;

		if (!username || !password) {
			return res.status(404).json({ message: 'missing info' });
		}

		const uniqueUsername = await db.findByAny('username', username, table);
		const uniqueEmail = await db.findByAny('email', email, table);

		if (uniqueEmail.length > 0) {
			return res.status(400).json({ message: 'Email already exisits' });
		}

		if (uniqueUsername > 0) {
			return res.status(400).json({ message: 'Username already exisits' });
		}

		const create = await authControler.register(data);
		res.status(201).json(create);
	} catch (error) {
		next(error);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Missing information' });
		}

		const foundUser = await authControler.findUser('email', email, table);
		if (foundUser.length === 0) {
			return res.status(400).json({ message: "This user doesn't exisit" });
		}

		const validatePassword = await bcrypt.compareSync(password, foundUser.password);
		if (!validatePassword) {
			return res.status(400).json({ message: 'wrong password or email address' });
		}

		const payload = {
			id: foundUser.id,
			email: foundUser.email
		};

		const token = jwt.sign(payload, process.env.TOKEN);

		return res.status(200).json({
			message: `Welcome ${foundUser.username}`,
			token: token
		});
	} catch (error) {
		next(error);
	}
});

router.put('/updatePassword', async (req, res, next) => {
	try {
		const { email, password, newPassword } = req.body;
		if (!email || !password || !newPassword) {
			return res.status(400).json({ message: 'Missing information' });
		}

		if (password === newPassword) {
			return res.status(400).json({ message: "That's already your password" });
		}

		const foundUser = await authControler.findUser('email', email, table);
		if (foundUser.length === 0) {
			return res.status(400).json({ message: "This user doesn't exisit" });
		}

		const validatePassword = await bcrypt.compareSync(password, foundUser.password);
		if (!validatePassword) {
			return res.status(400).json({ message: 'wrong password or email address' });
		}

		const hashpassword = await bcrypt.hash(newPassword, 10);
		const update = await db.update(foundUser.id, { password: hashpassword }, table);

		const payload = {
			id: foundUser.id,
			email: foundUser.email
		};

		const token = jwt.sign(payload, process.env.TOKEN);

		return res.status(200).json({
			message: `${foundUser.username}, your password has been updated!`,
			token: token
		});
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const id = req.params.id;
		const result = await db.findById(id, table);
		if (result.length === 0) {
			res.status(404).json({ message: 'No Streamer with that ID' });
		}
		const removal = await db.remove(id, table);
		res.status(200).json(`${result[0].userName} was sucsessfully deleted`);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
