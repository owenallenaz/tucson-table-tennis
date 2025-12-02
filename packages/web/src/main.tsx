import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@picocss/pico/css/pico.min.css';
import "./Main.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter } from "react-router";
import { AppDataProvider } from './useAppData';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false
		}
	}
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<HashRouter>
				<AppDataProvider>
					<App/>
				</AppDataProvider>
			</HashRouter>
		</QueryClientProvider>
	</StrictMode>,
)
