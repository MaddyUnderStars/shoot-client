import { useEffect } from "react";
import type { GATEWAY_EVENT } from "@/lib/client/common/receive";
import { gatewayClient } from "@/lib/client/gateway";

type NarrowEvent<A, K> = A extends {
	t: K;
}
	? A
	: never;

type ListenerType<T extends GATEWAY_EVENT, K extends T["t"]> = (
	payload: NarrowEvent<T, K>,
) => unknown;

export const useGateway = <T extends GATEWAY_EVENT, K extends T["t"]>(
	event: K,
	listener: ListenerType<T, K>,
) => {
	useEffect(() => {
		gatewayClient.addListener(event, listener);

		return () => {
			gatewayClient.removeListener(event, listener);
		};
	}, [event, listener]);
};
