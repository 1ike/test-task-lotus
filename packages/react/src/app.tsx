import 'normalize.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home, { loader, action } from './pages/home';
import Tender from './pages/tender';
import NotFound from './pages/notFound';
import { ErrorMessageProvider } from './contexts/error';
import ErrorMessage from './components/errorMessage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    loader,
    action,
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
  return (
    <ErrorMessageProvider>
      <RouterProvider router={router} />
      <ErrorMessage />
    </ErrorMessageProvider>
  );
}

export default App;
