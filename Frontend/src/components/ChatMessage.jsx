export default function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-[70%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap
          ${isUser 
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" 
            : "bg-gray-200 border-slate-200 text-gray-900 shadow-sm"}
        `}
        style={{ animation: "fadeIn .3s ease" }}
      >
        {msg.content}
      </div>
    </div>
  );
}
