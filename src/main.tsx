import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { appInjectStore } from './api/index.api.ts';
import { App } from './App.tsx';
import AppConfigProvider from './AppConfigProvider.tsx';
import './styles/tokens.css';
import './styles/themes/light.css';
import './index.scss';
import { persistor, store } from './store/store.js';

appInjectStore(store);
dayjs.extend(customParseFormat);
dayjs.locale('ru');
document.documentElement.dataset.theme = 'light';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppConfigProvider>
        <App />
      </AppConfigProvider>
    </PersistGate>
  </Provider>,
)
