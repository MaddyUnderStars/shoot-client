import styled from "styled-components";
import { lazy, Suspense, useEffect, useState } from "react";
import { shoot } from "../lib";
import InfiniteScroll from "react-infinite-scroll-component";
import type { MEMBERS_CHUNK } from "../lib/types";
import ReactModal from "react-modal";
// import { UserPopout } from "./modals/userPopout";
import type { User } from "../lib/entities";

const UserPopout = lazy(async () => ({
	default: (await import("./modals/userPopout")).UserPopout,
}));

const Container = styled.div`
	background-color: var(--background-secondary);
	height: 100%;
`;

const Member = styled.div`
	margin-left: 20px;
	margin-top: 10px;
	cursor: pointer;
`;

const getNext = async (channel_id: string) => {
	shoot.requestMembers(channel_id);
};

export const MembersList = ({ channel_id }: { channel_id: string }) => {
	// const channel = useChannel(channel_id);

	const [members, setMembers] = useState<
		{ member_id: string; name: string }[]
	>([]);
	const [hasNext] = useState(false);

	const [user, setUser] = useState<User>();
	const [popup, setPopup] = useState<boolean>(false);
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const openUserPopup = async (u: string) => {
		const user = shoot.users.get(u);
		console.log(u);
		if (!user) return; // TODO: fetch

		setPopup(true);
		setUser(user);
	};

	useEffect(() => {
		const cb = (data: MEMBERS_CHUNK) => {
			const members = [];
			const items = data.d.items;
			for (const item of items) {
				if (typeof item === "string") continue; // role
				members.push(item);
			}

			setMembers(members);
		};

		shoot.addListener("MEMBERS_CHUNK", cb);

		getNext(channel_id);

		return () => {
			shoot.removeListener("MEMBERS_CHUNK", cb);
		};
	}, [channel_id]);

	return (
		<Container>
			<InfiniteScroll
				dataLength={members.length}
				next={() => getNext(channel_id)}
				hasMore={hasNext}
				loader={<h4>Loading</h4>}
			>
				{[...members].map((member) => (
					<Member
						onClick={(event) => {
							setPosition({
								x: event.clientX,
								y: event.clientY,
							});
							openUserPopup(member.member_id);
						}}
						key={member.name}
					>
						{member.name}
					</Member>
				))}
			</InfiniteScroll>

			<ReactModal
				isOpen={popup}
				shouldCloseOnOverlayClick={true}
				shouldCloseOnEsc={true}
				onRequestClose={() => setPopup(false)}
				style={{
					overlay: {
						background: "transparent",
					},
					content: {
						position: "absolute",
						width: "min-content",
						height: "min-content",
						top: position.y,
						left: position.x,
						backgroundColor: "transparent",
						border: "none",
					},
				}}
			>
				<Suspense fallback={<p>Loading...</p>}>
					<UserPopout user={user} />
				</Suspense>
			</ReactModal>
		</Container>
	);
};
