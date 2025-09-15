import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { marked } from "marked";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const MaaChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello beta 🤱, I am your Maa. Tell me, how are you feeling today? I'm here to guide you through your postnatal journey.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyLoading, setApiKeyLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch API key from Firebase on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'config', 'openai'));
        if (configDoc.exists()) {
          setApiKey(configDoc.data().apiKey);
        } else {
          console.error('API key not found in Firebase');
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "Beta, Maa is having trouble with the configuration. Please contact support."
          }]);
        }
      } catch (error) {
        console.error('Error fetching API key:', error);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Beta, Maa is having trouble connecting to the server. Please try again later."
        }]);
      } finally {
        setApiKeyLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Beta, Maa is still loading. Please wait a moment and try again."
      }]);
      return;
    }

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
            Authorization: `Bearer ${apiKey}`,
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
          placeholder={apiKeyLoading ? "Loading Maa..." : "Type your question..."}
          disabled={apiKeyLoading || !apiKey}
          className={`flex-1 p-3 border rounded-md resize-none ${
            apiKeyLoading || !apiKey ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={apiKeyLoading || !apiKey || loading}
          className={`px-4 py-2 rounded-md ${
            apiKeyLoading || !apiKey || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700'
          } text-white`}
        >
          {apiKeyLoading ? 'Loading...' : loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MaaChat;
