import { useChannel } from "@/hooks/use-channel";
import type { ActorMention } from "@/lib/client/common/actor";
import type { MESSAGE_CREATE, TYPING } from "@/lib/client/common/receive";
import { gatewayClient } from "@/lib/client/gateway";
import { getAppStore } from "@/lib/store/app-store";
import { useEffect, useState } from "react";

export const TypingIndicator = () => {
	const [typingUsers, setTypingUsers] = useState<Map<ActorMention, string>>(new Map());

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

			setTypingUsers((old) => {
				old.set(user.mention, user.display_name ?? user.name);
				return new Map(old);
			});

			setTimeout(() => {
				setTypingUsers((old) => {
					old.delete(user.mention);
					return new Map(old);
				});

				// indicators can be resent every 5 seconds
				// so an extra 100ms buffer is fine
			}, 5100);
		};

		// if a message is sent, remove that user from the typing list
		// as they have sent their message
		const createCb = (data: MESSAGE_CREATE) => {
			const msg = data.d.message;

			if (msg.channel_id !== channel?.mention) return;

			console.log(msg);

			setTypingUsers((old) => {
				old.delete(msg.author_id);
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
