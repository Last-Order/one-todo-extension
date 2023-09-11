import type { PlasmoMessaging } from "@plasmohq/messaging";
import { createEvent } from "~popup/pages/upcoming/services";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        console.log(req.body);
        const response = await createEvent({
            eventName: req.body.eventName,
            scheduledTime: req.body.scheduledTime,
            description: req.body.description,
            remindTime: req.body.remindTime,
        });
        res.send(response);
    } catch (e) {
        if (e instanceof Error) {
            res.send({ errorMessage: e.message });
            return;
        }
    }
};

export default handler;
