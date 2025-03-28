import { RouterProvider } from "react-router-dom";
// import { ModalProvider } from "./context/ModalContext";
import { router } from "./routes/routes";
import "./styles/common.css";

function App() {
  return (
 
  
        <RouterProvider router={router} />
     
  );
}

export default App; 