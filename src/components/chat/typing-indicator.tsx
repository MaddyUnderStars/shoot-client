import { useChannel } from "@/hooks/use-channel";
import type { ActorMention } from "@/lib/client/common/actor";
import type { MESSAGE_CREATE, TYPING } from "@/lib/client/common/receive";
import { gatewayClient } from "@/lib/client/gateway";
import { getAppStore } from "@/lib/store/app-store";
import { useEffect, useState } from "react";

export const TypingIndicator = () => {
	const [typingUsers, setTypingUsers] = useState<
		Map<ActorMention, { name: string; timeout: ReturnType<typeof setTimeout> }>
	>(new Map());

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

			const timeout = setTimeout(() => {
				setTypingUsers((old) => {
					old.delete(user.mention);
					return new Map(old);
				});

				// indicators can be resent every 5 seconds
				// so an extra 100ms buffer is fine
			}, 5100);

			setTypingUsers((old) => {
				old.set(user.mention, { name: user.display_name ?? user.name, timeout });
				return new Map(old);
			});
		};

		// if a message is sent, remove that user from the typing list
		// as they have sent their message
		const createCb = (data: MESSAGE_CREATE) => {
			const msg = data.d.message;

			if (msg.channel_id !== channel?.mention) return;

			setTypingUsers((old) => {
				const del = old.get(msg.author_id);
				if (del) {
					clearTimeout(del.timeout);
					old.delete(msg.author_id);
				}
				return new Map(old);
			});
		};

		gatewayClient.addListener("TYPING", cb);

		gatewayClient.addListener("MESSAGE_CREATE", createCb);

		return () => {
			gatewayClient.removeListener("TYPING", cb);
			gatewayClient.removeListener("MESSAGE_CREATE", createCb);
		};
	}, [channel]);

	if (!typingUsers.size) {
		return <div className="h-6" />;
	}

	return (
		<div className="h-6 text-sm">
			<p className="text-muted-foreground">
				{[...typingUsers.values()].map((x) => x.name).join(", ")}{" "}
				{typingUsers.size > 1 ? "are" : "is"} typing
			</p>
		</div>
	);
};
