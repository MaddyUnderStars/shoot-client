import NiceModal from "@ebay/nice-modal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => {
		const location = useLocation();

		// if we're using Tauri, when we change location
		// if that location is a channel
		// save that to local storage to restore the next time we load
		useEffect(() => {
			if (!import.meta.env.VITE_IS_MOBILE_TAURI) return;
			if (!location.pathname.startsWith("/channel")) return;

			window.localStorage.setItem("SAVED_LOCATION_HREF", location.href);
			console.log(location.href);
		}, [location]);

		return (
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<NiceModal.Provider>
						<Outlet />
					</NiceModal.Provider>
				</ThemeProvider>
			</QueryClientProvider>
		);
	},
});
