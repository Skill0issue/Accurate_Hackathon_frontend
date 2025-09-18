import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content, isUser }: { content: string; isUser: boolean }) {
  return (
    <div
      className={`px-4 py-2 rounded-2xl ${
        isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
      }`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
