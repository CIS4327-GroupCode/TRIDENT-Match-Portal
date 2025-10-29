import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MessagesPage from "./pages/MessagesPage";
import { useAuth } from "./auth/AuthContext";


export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/MessagesPage"
        element={user ? <MessagesPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}