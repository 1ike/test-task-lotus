import 'normalize.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/home';
import Tender from './pages/tender';
import NotFound from './pages/notFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/room/:roomName',
    element: <Tender />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
