import styled from "styled-components";
import { useEffect, useState } from "react";
import { shoot } from "../lib";
import InfiniteScroll from "react-infinite-scroll-component";
import { MEMBERS_CHUNK } from "../lib/types";

const Container = styled.div`
	background-color: var(--background-secondary);
	height: 100%;
`

const Member = styled.div`
	margin-left: 20px;
	margin-top: 10px;
`

export const MembersList = ({ channel_id }: { channel_id: string }) => {
	// const channel = useChannel(channel_id);

	const [members, setMembers] = useState<string[]>([]);
	const [hasNext, setHasNext] = useState(false);

	useEffect(() => {
		const cb = (data: MEMBERS_CHUNK) => {
			const members = [];
			const items = data.d.items;
			for (const item of items) {
				if (typeof item === "string") continue;	// role
				members.push(item.name);
			}

			setMembers(members);
		}

		shoot.addListener("MEMBERS_CHUNK", cb);

		return () => {
			shoot.removeListener("MEMBERS_CHUNK", cb);
		}
	}, [channel_id])

	useEffect(() => {
		getNext();
	}, [channel_id]);

	const getNext = async () => {
		shoot.requestMembers(channel_id);
	}

	return (
		<Container>
			<InfiniteScroll
				dataLength={members.length}
				next={getNext}
				hasMore={hasNext}
				loader={<h4>Loading</h4>}
			>
				{[...members].map((member) => (
					<Member>{member}</Member>
				))}
			</InfiniteScroll>
		</Container>
	);
};
