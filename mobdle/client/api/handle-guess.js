import mobs from './mobs';
import getDailyAnswer from './answergen';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Vercel pre-parses JSON bodies directly onto req.body for you
        const { userGuess } = req.body;
        if (!userGuess) {
            return res.status(400).json({ error: 'Missing userGuess parameter' });
        }
        const ans = getDailyAnswer();
        const g = mobs[userGuess];

        // CONSTANTS THRESHOLDS
        const HP_CLOSENESS_THRESHOLD = 1;
        const HEIGHT_CLOSENESS_THRESHOLD = 0.3;

        // Format: // name, dimension, hostility, hp, movement, height, tameable, releaseVersion
        const correct = g.name === ans.name ? "eq" : "neq";

        // Dimension matching
        let dimension = "";
        const ansdims = ans.dimension.split(",");
        const gdims = g.dimension.split(",");
        let matches = 0;
        for (const dim of gdims) {
            if (ansdims.includes(dim)) {
                matches += 1;
            }
        }
        if (matches === ansdims.length && matches === gdims.length) {
            dimension = "eq";
        } else if (matches > 0 || g.dimension === "Any") {
            dimension = "close";
        } else {
            dimension = "neq";
        }

        const hostility = ans.hostility === g.hostility ? "eq" : "neq";

        // Movement matching
        let movement = "";
        const ansmove = ans.movement.split(",");
        const gmove = g.movement.split(",");
        matches = 0;
        for (const move of gmove) {
            if (ansmove.includes(move)) {
                matches += 1;
            }
        }
        if (matches === ansmove.length && matches === gmove.length) {
            movement = "eq";
        } else if (matches > 0) {
            movement = "close";
        } else {
            movement = "neq";
        }

        const tameable = ans.tameable === g.tameable ? "eq" : "neq";

        let hp = "";
        if (ans.hp === g.hp) {
            hp = "eq";
        } else if (ans.hp < g.hp) {
            if (Math.abs(g.hp - ans.hp) < HP_CLOSENESS_THRESHOLD) {
                hp = "high-close";
            } else {
                hp = "high-far";
            }
        } else {
            if (Math.abs(ans.hp - g.hp) < HP_CLOSENESS_THRESHOLD) {
                hp = "low-close";
            } else {
                hp = "low-far";
            }
        }

        let height = "";
        if (ans.height === g.height) {
            height = "eq";
        } else if (ans.height < g.height) {
            if (Math.abs(g.height - ans.height) < HEIGHT_CLOSENESS_THRESHOLD) {
                height = "high-close";
            } else {
                height = "high-far";
            }
        } else {
            if (Math.abs(ans.height - g.height) < HEIGHT_CLOSENESS_THRESHOLD) {
                height = "low-close";
            } else {
                height = "low-far";
            }
        }

        let release = "";
        let ansRelease = ans.releaseVersion.split(".");
        let gRelease = g.releaseVersion.split(".");
        // parseInt takes second arg as base of integer, good for sanity to include base 10
        let i = 0;
        while (i < Math.min(ansRelease.length, gRelease.length)) {
            if (parseInt(gRelease[i], 10) < parseInt(ansRelease[i], 10)) {
                release = "low-far";
                break;
            } else if (parseInt(gRelease[i], 10) > parseInt(ansRelease[i], 10)) {
                release = "high-far";
                break;
            }
            i++;
        }
        if (i === Math.min(ansRelease.length, gRelease.length)) {
            if (gRelease.length < ansRelease.length) {
                release = "low-far";
            } else if (gRelease.length > ansRelease.length) {
                release = "high-far";
            } else {
                release = "eq";
            }
        }

        feedbackPayload = {name: g.name, correct: correct, dimension: dimension, hostility: hostility, movement: movement, tameable: tameable, hp: hp, height: height, release: release};
        return res.status(200).json(feedbackPayload);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error encountered while processing request data" });
        // The res.json() does the sending of the response over HTTP by calling raw Node stuff like .stringify(), .write(), .end() (see React Notes on my docs)
        // We return to halt this Javascript function as you normally would, for cleanliness, it's the same effect as this (sending first, then terminating function):
        // res.status(500).json({error: "Internal Server Error"}); 
        // return;
        // Syntax just allows more concise stuff
    }
}