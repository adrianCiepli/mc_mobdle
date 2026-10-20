import getDailyAnswer from './answergen.js';

export default function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Vercel pre-parses incoming JSON bodies from frontend directly onto req.body

        const { userGiveUp, userTimeZone } = req.body;
        if (!userGiveUp && userGiveUp !== false) {
            return res.status(400).json({ error: 'Missing userGiveUp parameter' });
        }
        if (!userTimeZone) {
            return res.status(400).json({ error: 'Missing userTimeZone parameter' });
        }
        if (!userGiveUp) {
            return res.status(400).json({ error: 'The userGiveUp param is false' });
        }
        
        const ans = getDailyAnswer(userTimeZone);

        // Sanity check just in case some edge case gets hit
        if (!ans) {
            return res.status(404).json({ error: `Failed to get daily answer.` });
        }

        const name = ans.name;
        const correct = "gave-up";
        const dimension = "gave-up";
        const hostility = "gave-up";
        const hp = "gave-up";
        const movement = "gave-up";
        const height = "gave-up";
        const tameable = "gave-up";
        const release = "gave-up";

        const feedbackPayload = { name: name, correct: correct, dimension: dimension, hostility: hostility, movement: movement, tameable: tameable, hp: hp, height: height, release: release };
        return res.status(200).json(feedbackPayload);
    } catch (err) {
        return res.status(500).json({ error: `Try-Catch-hit on handle-give-up: ${err.message}`, stack: err.stack });
        // We return to halt this Javascript function as you normally would, for cleanliness, it's the same effect as this (sending first, then terminating function):
        // res.status(500).json({error: "Internal Server Error"}); 
        // return;
    }
}