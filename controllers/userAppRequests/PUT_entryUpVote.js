const db = require('../../models/basicModel');
const entryModel = require('../../models/entriesModel');
const helper = require('../../utils/helperFunctions');

function PUT_entryUpVote() {
	return async (req, res, next) => {
		try {
			const id = req.params.entryID;

			if (!req.body.vote) {
				res.status(400).json({ message: 'missing vote key' });
			}

			const retrieveEntry = await db.findById(id, 'queueEntries');
			helper.checkLength(retrieveEntry, 'Entry not found', res);

			if (retrieveEntry[0].status != 'started') {
				return res.status(400).json({ message: "Entry isn't in the queue" });
			}

			if (req.body.vote === 'plus') {
				retrieveEntry[0].upvote++;
			}

			if (req.body.vote === 'minus') {
				retrieveEntry[0].upvote--;
			}

			const update = await db.update(id, retrieveEntry[0], 'queueEntries');
			const results = await entryModel.entryById(id);
			res.status(200).json(results);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = PUT_entryUpVote;
