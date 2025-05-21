
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from '@/components/ThemeProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
