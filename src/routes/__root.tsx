import NiceModal from "@ebay/nice-modal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => {
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
