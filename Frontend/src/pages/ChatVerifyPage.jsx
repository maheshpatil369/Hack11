import React, { useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { verifyText, verifyURL } from "../api/api";

export default function ChatVerifyPage({ chat, updateChat }) {
  const scrollRef = useRef();

  async function handleSend(input) {
    // → detect file dummy
    if (input.startsWith("file:")) {
      updateChat({
        role: "assistant",
        content: "File received. (Demo Mode) No backend support."
      });
      return;
    }

    // → detect URL
    const isURL = input.startsWith("http://") || input.startsWith("https://");

    updateChat({ role: "user", content: input });

    let response = "Processing...";

    try {
      response = isURL ? await verifyURL(input) : await verifyText(input);
    } catch (err) {
      response = "Error: " + err.message;
    }

    updateChat({ role: "assistant", content: response });
  }

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  return (
    <div className="flex flex-col flex-1">
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 bg-white">
        {chat.messages.map((m, idx) => (
          <ChatMessage key={idx} msg={m} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
