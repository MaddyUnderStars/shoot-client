import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = React.memo(({ content }: { content: string }) => {
	return (
		<div>
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: (props) => (
						<a href={props.href} className="text-link font-medium underline">
							{props.children}
						</a>
					),
				}}
			>
				{content}
			</Markdown>
		</div>
	);
});
