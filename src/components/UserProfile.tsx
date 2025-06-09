import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import styled from "styled-components";
import { createHttpClient } from "../lib/http";

export const UserProfile = ({ user_id }: { user_id: string }) => {
	const { data } = useSuspenseQuery({
		queryKey: ["userProfile"],
		queryFn: async () =>
			createHttpClient()
				.GET("/users/{user_id}/", {
					params: { path: { user_id } },
				})
				.then((x) => x.data),
	});

	return (
		<Suspense fallback={<p>Loading</p>}>
			<Container>
				<Header
					style={{ backgroundColor: "var(--background-tertiary)" }}
				>
					<Spacer>
						<ProfilePicture src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />
						<h1>{data?.display_name}</h1>
						<span>
							{data?.name}@{data?.domain}
						</span>
					</Spacer>

					<Spacer style={{ display: "flex", alignItems: "end" }}>
						<p>user actions such as block here</p>
					</Spacer>
				</Header>

				<Content>
					<div
						style={{
							borderBottom:
								"1px solid var(--background-tertiary)",
							paddingBottom: "10px",
						}}
					>
						<h2>Timeline</h2>
						<p>Below are {data?.display_name}'s public posts.</p>
						<p>
							TODO: this should be a tabbed menu, with options
							'timeline', 'about', 'status/activity', 'shared
							guilds', 'shared friends', 'instance info'
						</p>
					</div>

					<TimelinePosts>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
							<Post key={x}>
								<PostHeader>Example post</PostHeader>
								<PostContent>
									Example content here hello lorem ipsum
								</PostContent>
							</Post>
						))}
					</TimelinePosts>
				</Content>
			</Container>
		</Suspense>
	);
};

const TimelinePosts = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const PostHeader = styled.div`
	font-weight: bold;
`;

const PostContent = styled.div``;

const Post = styled.div`
	margin-top: 20px;
	padding: 20px;
	border: 1px solid var(--background-tertiary);
	border-radius: 20px;
	width: 750px;
`;

const Content = styled.div`
	flex: 1;
	padding: 20px;
	overflow-y: auto;
`;

const Spacer = styled.div`
	padding: 20px;
`;

const ProfilePicture = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 100%;
	display: inline;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const Header = styled.div`
	display: flex;
	background-repeat: no-repeat;
	justify-content: space-between;
`;
