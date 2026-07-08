import NiceModal from "@ebay/nice-modal-react";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";

type RouterContext = {
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => {
		const location = useLocation();

		// if we're using Tauri, when we change location
		// if that location is a channel
		// save that to local storage to restore the next time we load
		useEffect(() => {
			if (!location.pathname.startsWith("/channel")) return;

			window.localStorage.setItem("SAVED_LOCATION_HREF", location.href);
		}, [location]);

		return (
			<ThemeProvider>
				<NiceModal.Provider>
					<Outlet />
				</NiceModal.Provider>
			</ThemeProvider>
		);
	},
});
