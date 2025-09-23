import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import type React from "react";
import { useRef, useSyncExternalStore } from "react";
import { CSSTransition } from "react-transition-group";
import { gatewayClient } from "@/lib/client/gateway";
import { Button } from "./ui/button";

export const ReadyLoaderComponent = observer(({ children }: React.PropsWithChildren) => {
	const navigate = useNavigate();

	const isReady = useSyncExternalStore(
		(cb) => {
			gatewayClient.addListener("READY", cb);
			gatewayClient.addListener("SOCKET_CLOSE", cb);
			gatewayClient.addListener("SOCKET_ERROR", cb);

			return () => {
				gatewayClient.removeListener("READY", cb);
				gatewayClient.removeListener("SOCKET_CLOSE", cb);
				gatewayClient.removeListener("SOCKET_ERROR", cb);
			};
		},
		() => gatewayClient.ready,
	);

	const ref = useRef(null);

	console.log(isReady);

	return (
		<>
			{isReady ? children : null}

			<CSSTransition
				nodeRef={ref}
				in={!isReady}
				timeout={200}
				classNames="fade"
				unmountOnExit
			>
				<div
					ref={ref}
					className="absolute top-0 left-0 w-dvw h-dvh flex justify-center items-center flex-col"
				>
					<h1 className="text-4xl">Shoot</h1>
					<h2>Connecting</h2>

					<div className="absolute left-0 bottom-0 m-5">
						<Button
							variant="destructive"
							onClick={() => {
								gatewayClient.logout();
								navigate({
									to: "/login",
								});
							}}
						>
							Log out
						</Button>
					</div>
				</div>
			</CSSTransition>
		</>
	);
});
