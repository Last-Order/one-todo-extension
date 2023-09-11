import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CloseOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { sendToBackground } from "@plasmohq/messaging";
import classNames from "classnames";
import styleText from "data-text:./styles.scss";
import dayjs from "dayjs";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"],
};

const styleElement = document.createElement("style");

const styleCache = createCache({
    key: "plasmo-emotion-cache",
    prepend: true,
    container: styleElement,
});

export const getStyle: PlasmoGetStyle = () => {
    // const style = document.createElement("style");
    // style.textContent = styleText;
    styleElement.textContent = styleElement.textContent + styleText;
    return styleElement;
};

interface PrepareResult {
    event_name: string;
    scheduled_time: string;
}

enum Step {
    NULL = 0,
    PREPARING = 1,
    CONFIRM = 2,
    SUCCESS = 4,
    ERROR = 9,
}

const App = () => {
    const [isShow, setIsShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(Step.NULL);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [prepareResult, setPrepareResult] = useState<PrepareResult>();
    const requestLock = useRef(false);
    const isShowRef = useRef(false);
    const inited = useRef(false);

    useEffect(() => {
        isShowRef.current = isShow;
    }, [isShow]);

    const onClose = useCallback(() => {
        setCurrentStep(Step.NULL);
        setIsShow(false);
    }, []);

    const onPrepareCreate = useCallback(async (text) => {
        requestLock.current = true;
        const result = await sendToBackground<{ description: string }>({
            // @ts-ignore
            name: "prepare_create_event",
            body: {
                description: text,
            },
        });
        if (!isShowRef.current) {
            return;
        }
        if (result.errorMessage) {
            setErrorMessage(result.errorMessage);
            setCurrentStep(Step.ERROR);
            setIsLoading(false);
        } else {
            setPrepareResult(result);
            setCurrentStep(Step.CONFIRM);
            setIsLoading(false);
        }
        requestLock.current = false;
    }, []);

    const onCreate = useCallback(async () => {
        if (requestLock.current || !prepareResult) {
            return;
        }
        setIsLoading(true);
        const remindTime = dayjs(prepareResult.scheduled_time).subtract(30, "minutes").format();
        const result = await sendToBackground<{
            eventName: String;
            description: string;
            scheduledTime: string;
            remindTime: string;
        }>({
            // @ts-ignore
            name: "create_event",
            body: {
                eventName: prepareResult.event_name,
                scheduledTime: prepareResult.scheduled_time,
                description: selectedText,
                remindTime,
            },
        });
        if (result.errorMessage) {
            setErrorMessage(result.errorMessage);
            setCurrentStep(Step.ERROR);
            setIsLoading(false);
        } else {
            setPrepareResult(result);
            setCurrentStep(Step.SUCCESS);
            setIsLoading(false);
            setTimeout(() => {
                onClose();
            }, 3000);
        }
        requestLock.current = false;
    }, [prepareResult, selectedText, onClose]);

    const displayTime = useMemo(() => {
        if (!prepareResult?.scheduled_time) {
            return "";
        }
        return dayjs(prepareResult.scheduled_time).toDate().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
    }, [prepareResult]);

    useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (sender.id !== process.env.PLASMO_PUBLIC_CRX_ID) {
                return;
            }
            if (message?.type === "create" && !requestLock.current) {
                setIsShow(true);
                setCurrentStep(Step.PREPARING);
                setIsLoading(true);
                setSelectedText(message.text);
                onPrepareCreate(message.text);
            }
        });
    }, [onPrepareCreate]);

    if (!isShow) {
        return null;
    }

    return (
        <CacheProvider value={styleCache}>
            <Card className="card">
                <IconButton onClick={onClose} className="close-btn" sx={{ position: "absolute" }}>
                    <CloseOutlined />
                </IconButton>
                {currentStep === Step.PREPARING && (
                    <>
                        {isLoading && (
                            <CardContent>
                                <div className="loading-container">
                                    <div className="loading">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </>
                )}
                {currentStep === Step.CONFIRM && (
                    <>
                        <CardContent className="event-detail">
                            <div className="section-title event-name">Event Name</div>
                            <div className="section-content">{prepareResult?.event_name || ""}</div>
                            <div className="section-title event-time">Scheduled Time</div>
                            <div className="section-content">{displayTime}</div>
                        </CardContent>
                        <CardActions>
                            <Button color="secondary" sx={{ marginLeft: "auto" }} onClick={onClose}>
                                Cancel
                            </Button>
                            <LoadingButton color="primary" onClick={onCreate}>
                                Confirm
                            </LoadingButton>
                        </CardActions>
                    </>
                )}
                {currentStep === Step.ERROR && (
                    <CardContent>
                        <Alert severity="error" sx={{ marginTop: "38px" }}>
                            {errorMessage}
                        </Alert>
                    </CardContent>
                )}
                {currentStep === Step.SUCCESS && (
                    <CardContent>
                        <Alert severity="success" sx={{ marginTop: "38px" }}>
                            Event created. Close in 3 seconds.
                        </Alert>
                    </CardContent>
                )}
            </Card>
        </CacheProvider>
    );
};

export default App;
