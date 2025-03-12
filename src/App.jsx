import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
// import { ModalProvider } from "./context/ModalContext";
import { router } from "./routes/routes";
import "./styles/common.css";

function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App; 