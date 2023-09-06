import { createRoot } from "react-dom/client";

const App = () => {
    return <div>111</div>;
};

console.log(1111);

const inject = () => {
    const rootElement = document.createElement("div");
    rootElement.setAttribute("id", "otd-inject-root");
    document.querySelector("body").appendChild(rootElement);

    const root = createRoot(rootElement);
    root.render(<App />);
};

export default inject;
