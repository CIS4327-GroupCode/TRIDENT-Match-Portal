import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import FloatingChatBox from "./components/FloatingChatBox";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles.css";

function Root() {
  const { user } = useAuth();
  const onHome = useLocation().pathname === "/";
  return (
    <>
      <App />
      {user && onHome && <FloatingChatBox />}
    </>
  );
}
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
	  <AuthProvider>
	    <BrowserRouter>
      <Root />
    </BrowserRouter>
	  </AuthProvider>
	</BrowserRouter>
);