import { Upload, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useChannel } from "@/hooks/use-channel";
import { cn } from "@/lib/utils";
import { FilePreview } from "./file-preview";
import { TypingIndicator } from "./typing-indicator";
import { gatewayClient } from "@/lib/client/gateway";

// Import the Slate editor factory.
import { createEditor, Editor, Node, Transforms, type Descendant } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

export const ChatInput = () => {
	const channel = useChannel();
	const [attached, setAttached] = useState<File[]>([]);
	const formRef = useRef<HTMLFormElement>(null);

	const lastTyped = useRef<number>(0);

	if (!channel) return null;

	const sendMessage = async (content: Descendant[]) => {
		const textContent = content.map((n) => Node.string(n)).join("\n");

		const files = [...attached];

		formRef.current?.reset();

		lastTyped.current = 0;

		await channel.sendMessage({
			content: textContent,
			files,
		});
	};

	const startTyping = (event: React.InputEvent<HTMLDivElement>) => {
		if (lastTyped.current > Date.now()) return;

		lastTyped.current = Date.now() + 5000;

		if (!event.currentTarget.innerText) return;

		gatewayClient.send({
			t: "typing",
			channel: channel.mention,
		});
	};

	return (
		<div className="p-3 pt-0 mb-[env(safe-area-inset-bottom)]">
			<TypingIndicator />

			<form ref={formRef} onReset={() => setAttached([])}>
				{attached.length ? (
					<div className="relative p-3 dark:bg-input/30 border flex gap-2 flex-wrap overflow-scroll max-h-65 rounded-t-md border-b-0">
						<button
							type="button"
							className="absolute top-0 right-0 p-2"
							title="Cancel upload"
							onClick={() => setAttached([])}
						>
							<XIcon size={16} />
						</button>

						{attached.map((file) => (
							<FilePreview file={file} key={`${file.name}${file.type}${file.size}`} />
						))}
					</div>
				) : null}

				<div className="flex">
					<ChatSlateEditor
						hasAttached={attached.length > 0}
						onInput={startTyping}
						onSubmit={sendMessage}
					/>

					<label
						htmlFor="files"
						title="Upload files"
						className={cn(
							"rounded-md rounded-l-none selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm flex items-center justify-center flex-1",
							attached.length ? "rounded-t-none rounded-bl-none" : "",
						)}
					>
						<Upload size={14} />
					</label>

					<input
						id="files"
						name="files"
						type="file"
						multiple
						hidden
						onChange={(e) => setAttached([...(e.target.files ?? [])])}
					/>
				</div>
			</form>
		</div>
	);
};

const initialValue: Descendant[] = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

const ChatSlateEditor = ({
	hasAttached,
	onInput,
	onSubmit,
}: {
	hasAttached: boolean;
	onInput: React.InputEventHandler<HTMLDivElement>;
	onSubmit: (state: Descendant[]) => void;
}) => {
	const [editor] = useState(() => withReact(createEditor()));

	return (
		<Slate editor={editor} initialValue={initialValue}>
			<Editable
				// do not autofocus on mobile
				// it conflicts with the sidebar
				autoFocus={!import.meta.env.VITE_IS_MOBILE_TAURI}
				className={cn(
					"placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full max-w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"rounded-r-none border-r-0",
					hasAttached ? "rounded-t-none" : "",
				)}
				onInput={onInput}
				placeholder="Send a message..."
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						if (event.shiftKey) {
							return;
						}

						event.preventDefault();
						onSubmit(editor.children);

						Transforms.delete(editor, {
							at: {
								anchor: Editor.start(editor, []),
								focus: Editor.end(editor, []),
							},
						});
					}
				}}
			/>
		</Slate>
	);
};
