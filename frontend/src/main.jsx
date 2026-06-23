import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/app";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <GoogleOAuthProvider clientId="957508522472-e4u0en5ghj58g7vqkfu8h8pb6dbnmke2.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </BrowserRouter>
);