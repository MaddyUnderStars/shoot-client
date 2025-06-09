import styled from "styled-components";
import { shoot } from "../lib/client";
import type { Message } from "../lib/entities/message";
import { FilePreview } from "./filepreview";

export const MessageComponent = ({
	message,
	openUserPopup,
}: {
	message: Message;
	openUserPopup: (id: string, x: number, y: number) => void;
}) => {
	const channel = message.channel;
	if (!channel) return null;

	return (
		<ChatMessage key={message.id}>
			<ProfilePicture src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />

			<MessageContentSection>
				<ChatMessageHeader>
					<ChatAuthor
						onClick={(event) => {
							openUserPopup(
								message.author_id,
								event.clientX,
								event.clientY,
							);
						}}
					>
						{shoot.users.get(message.author_id)?.display_name ??
							message.author_id}
					</ChatAuthor>
					<ChatTimestamp>
						{(
							message.updated ?? message.published
						).toLocaleString()}
					</ChatTimestamp>
				</ChatMessageHeader>

				<ChatContent>
					{message.content}

					<ImageContainer>
						{message.files.map((file) => (
							<FilePreview
								key={file.hash}
								file={file}
								channel={channel}
							/>
						))}
					</ImageContainer>
				</ChatContent>
			</MessageContentSection>
		</ChatMessage>
	);
};

const ImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin-top: 10px;
    flex-wrap: wrap;
`;

const ProfilePicture = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 100%;
	margin-right: 10px;
	display: inline;
`;

const ChatMessage = styled.div`
	margin-top: 10px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	padding-bottom: 10px;
	content-visibility: auto;

	&:first-child {
		border-bottom: none;
	}
`;

const ChatMessageHeader = styled.div``;

const ChatContent = styled.div`
	margin-top: 5px;
`;

const ChatAuthor = styled.div`
	display: inline;
	cursor: pointer;
`;

const ChatTimestamp = styled.div`
	display: inline;
	margin-left: 10px;
	color: var(--text-secondary);
`;

const MessageContentSection = styled.div`
	display: inline-flex;
	flex-direction: column;
`;
