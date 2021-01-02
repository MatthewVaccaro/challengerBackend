const router = require('express').Router();
require('dotenv').config();
//User App Request Controllers
const POST_login = require('../controllers/authRequests/POST_login');
const POST_register = require('../controllers/authRequests/POST_register');

//Routes
router.post('/register', POST_register());

router.post('/login', POST_login());

// ! Needs to be looked at agian

router.put('/updatePassword', async (req, res, next) => {
	try {
		console.log(req.body);
		const { email, password, newPassword } = req.body;
		if (!email || !password || !newPassword) {
			return res.status(400).json({ message: 'Missing information' });
		}

		if (password === newPassword) {
			return res.status(400).json({ message: "That's already your password" });
		}

		const foundUser = await authControler.findUser('email', email, table);
		if (!foundUser) {
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
