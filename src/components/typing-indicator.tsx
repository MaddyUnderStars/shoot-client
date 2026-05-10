import { useChannel } from "@/hooks/use-channel";
import type { TYPING } from "@/lib/client/common/receive";
import { gatewayClient } from "@/lib/client/gateway";
import { getAppStore } from "@/lib/store/app-store";
import { useEffect, useState } from "react";

export const TypingIndicator = () => {
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

	const channel = useChannel();
	const app = getAppStore();

	useEffect(() => {
		const cb = async (data: TYPING) => {
			// only show for current channel
			if (channel?.mention !== data.d.channel) return;

			// hide ourselves
			if (data.d.user === app.user?.mention) return;

			const user = await app.users.resolve(data.d.user);

			if (!user) return;

			setTypingUsers((old) => new Set([...old.values(), user.display_name ?? user.name]));

			setTimeout(() => {
				setTypingUsers((old) => {
					old.delete(user.display_name ?? user.name);
					return new Set(old);
				});

				// indicators can be resent every 5 seconds
				// so an extra 100ms buffer is fine
			}, 5100);
		};

		gatewayClient.addListener("TYPING", cb);

		return () => {
			gatewayClient.removeListener("TYPING", cb);
		};
	}, [channel]);

	if (!typingUsers.size) {
		return <div className="pb-[23px]" />;
	}

	return (
		<div className="pb-1 text-sm">
			<p className="text-muted-foreground">
				{[...typingUsers.values()].join(", ")} {typingUsers.size > 1 ? "are" : "is"} typing
			</p>
		</div>
	);
};
