import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Outlet />
			</ThemeProvider>
		</QueryClientProvider>
	),
});
