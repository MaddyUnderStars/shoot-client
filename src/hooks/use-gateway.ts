import { useEffect } from "react";
import type { GATEWAY_EVENT } from "@/lib/client/common/receive";
import { getGatewayClient } from "@/lib/client/gateway";

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
		const gw = getGatewayClient();

		gw.addListener(event, listener);

		return () => {
			gw.removeListener(event, listener);
		};
	}, [event, listener]);
};
