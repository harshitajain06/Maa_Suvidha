import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { marked } from "marked";

const MaaChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello beta 🤱, I am your Maa. Tell me, how are you feeling today? I’m here to guide you through your postnatal journey.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are 'Maa', a warm, caring Indian mother giving postnatal guidance in a friendly, supportive, and culturally sensitive tone. Use simple, empathetic language, occasional Hindi words like 'beta' or 'bacha', and ensure advice is medically safe and encouraging.",
            },
            ...newMessages,
          ],
          max_tokens: 300,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // move key to .env for security
          },
        }
      );

      const aiReply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Beta, Maa is having trouble connecting right now 😔. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-pink-600 text-white p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-lg font-bold"
        >
          ⬅
        </button>
        <h1 className="text-xl font-bold">Ask Maa 🤱</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md prose prose-pink ${
              msg.role === "user"
                ? "bg-pink-200 ml-auto text-right"
                : "bg-white mr-auto text-left"
            }`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: marked(msg.content || ""),
              }}
            />
          </div>
        ))}
        {loading && (
          <div className="bg-white p-3 rounded-lg mr-auto text-gray-500">
            Maa is typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your question..."
          className="flex-1 p-3 border rounded-md resize-none"
          rows={1}
        />
        <button
          onClick={handleSend}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MaaChat;
