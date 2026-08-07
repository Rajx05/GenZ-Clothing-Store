import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";
import PersistLogin from "./components/PersistentLogin.jsx";
import { AppProvider } from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <PersistLogin>
          <AppProvider>
            <App />
          </AppProvider>
        </PersistLogin>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
