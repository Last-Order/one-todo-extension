import styleText from "data-text:./styles.scss";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"],
};

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style");
    style.textContent = styleText;
    return style;
};

enum Step {
    NULL = 0,
    PREPARING = 1,
}

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(Step.NULL);
    const inited = useRef(false);

    const onCreate = useCallback(async (text) => {
        console.log(text);
    }, []);

    useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (sender.id !== process.env.PLASMO_PUBLIC_CRX_ID) {
                return;
            }
            if (message?.type === "create") {
                setCurrentStep(Step.PREPARING);
                setIsLoading(true);
                onCreate(message.text);
            }
        });
    }, [onCreate]);
    return (
        <>
            {currentStep === Step.PREPARING && (
                <>
                    <div className="card">
                        {/* <CloseOutlined className="close-btn" /> */}
                        {isLoading && (
                            <div className="loading-container">
                                <div className="loading">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default App;
