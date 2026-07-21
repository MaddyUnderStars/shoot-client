import NiceModal from "@ebay/nice-modal-react";
import type { Channel } from "@/lib/client/entity/channel";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group";
import { SearchIcon } from "lucide-react";
import { useEffect, type SubmitEventHandler } from "react";
import { getHttpClient } from "@/lib/http/client";
import { Message } from "@/lib/client/entity/message";
import { getAppStore } from "@/lib/store/app-store";
import type { ActorMention } from "@/lib/client/common/actor";
import { PublicUser } from "@/lib/client/entity/public-user";
import { ModalCloseButton } from "./ui/modal-container";
import { MessageComponent } from "./chat/message";

export const SearchPane = ({ channel }: { channel: Channel }) => {
	const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const query = new FormData(e.currentTarget).get("query");

		if (!query || typeof query !== "string") return;

		void NiceModal.show(SearchResultsModal, { channel, query });

		e.currentTarget.reset();
	};

	return (
		<form onSubmit={onSubmit}>
			<InputGroup>
				<InputGroupInput name="query" placeholder={`Search ${channel.name}...`} />
				<InputGroupAddon align="inline-end">
					<InputGroupText>
						<button type="submit" className="cursor-pointer">
							<SearchIcon />
						</button>
					</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
};

const SearchResultsModal = NiceModal.create(
	({ channel, query }: { channel: Channel; query: string }) => {
		const { $api } = getHttpClient();
		const { users } = getAppStore();

		const { data, error, isLoading } = $api.useQuery("get", "/channel/{channel_id}/messages/", {
			params: {
				path: {
					channel_id: channel.mention,
				},
				query: {
					query,
				},
			},
		});

		useEffect(() => {
			if (!data?.authors) return;

			for (const id in data.authors) {
				const author = data.authors[id];
				if (!author) continue;

				users.setUser(id as ActorMention, new PublicUser(author));
			}
		});

		if (error) {
			return <p>Failed {error.message}</p>;
		}

		if (isLoading) return <p>Loading</p>;

		return (
			<div className="h-full md:w-85 w-full z-10 absolute top-0 right-0 bg-sidebar">
				<div className="p-2 flex justify-between">
					<h1>Results</h1>

					<ModalCloseButton />
				</div>

				{data?.messages.map((msg) => (
					<MessageComponent message={new Message(msg)} showControls={false} />
				))}
			</div>
		);
	},
);
