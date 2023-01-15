import 'normalize.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home, { loader, action } from './pages/home';
import Tender from './pages/tender';
import NotFound from './pages/notFound';
import ErrorMessage from './components/errorMessage';
import { store } from './state/store';

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
    <Provider store={store}>
      <RouterProvider router={router} />
      <ErrorMessage />
    </Provider>
  );
}

export default App;
