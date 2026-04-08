import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/userContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </UserProvider>
);
