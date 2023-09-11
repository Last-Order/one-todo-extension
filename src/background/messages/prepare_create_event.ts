import type { PlasmoMessaging } from "@plasmohq/messaging";
import { prepareCreateEvent } from "~popup/pages/upcoming/services";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        const response = await prepareCreateEvent(req.body.description);
        res.send(response);
    } catch (e) {
        if (e instanceof Error) {
            res.send({ errorMessage: e.message });
            return;
        }
    }
};

export default handler;
