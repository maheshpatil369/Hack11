export default function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`p-3 rounded-lg max-w-[70%] whitespace-pre-wrap ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}
