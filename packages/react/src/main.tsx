import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

console.log('%NX_SERVER_PORT% = ', process.env.NX_SERVER_PORT);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
