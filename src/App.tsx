import { RouterProvider } from "react-router-dom";
import Router from "./router/router";

const App = () => {
  return (
    <RouterProvider router={Router} />
  );
  
}

export default App;
