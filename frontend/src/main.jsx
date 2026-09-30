import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/app";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </BrowserRouter>
);