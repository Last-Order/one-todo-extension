import injectedCode from "~inject/index";

export {};

chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "one-todo-quick-add",
        title: "Add to OneTodo",
        type: "normal",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
    const { selectionText } = item;
    if (!selectionText || !tab.id) {
        return;
    }
    chrome.tabs.sendMessage(tab.id, { type: "create", text: selectionText });
});
