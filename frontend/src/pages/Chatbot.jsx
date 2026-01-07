import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { sendChatQuery } from "../services/chatbot.service";
import {
  PaperAirplaneIcon,
  TicketIcon,
  UserIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Core function used by BOTH input & quick buttons
  const processQuery = async (text) => {
    if (!text.trim()) return;

    const userMessage = { from: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendChatQuery(text);

      let botText = "";

      if (response.intent === "UNKNOWN") {
        botText = response.message;
      } else if (Array.isArray(response.data)) {
        botText = `Found ${response.data.length} result(s).`;
      } else if (response.data?.count !== undefined) {
        botText = `Count: ${response.data.count}`;
      } else {
        botText = "Query processed successfully.";
      }

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botText }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error processing query." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Form submit
  const handleSend = (e) => {
    e.preventDefault();
    processQuery(query);
    setQuery("");
  };

  const quickActions = [
    {
      text: "Show all open tickets",
      query: "show all open tickets",
      icon: TicketIcon,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    {
      text: "My assigned tickets",
      query: "tickets assigned to me",
      icon: UserIcon,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      text: "High priority tickets",
      query: "high priority tickets",
      icon: ExclamationTriangleIcon,
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      text: "Assets under maintenance",
      query: "assets under maintenance",
      icon: WrenchScrewdriverIcon,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      text: "Count open tickets",
      query: "how many open tickets",
      icon: CalculatorIcon,
      color: "bg-gray-50 text-gray-700 border-gray-200",
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Smart Assistant</h1>
        <p className="text-gray-600 text-sm">Ask questions about assets and tickets in natural language</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">

        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">LabTrack Assistant</h2>
              <p className="text-xs text-gray-500">Ready to help you</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Welcome to the Assistant</h3>
              <p className="text-sm text-gray-500 mb-4">Use quick actions below or type your question</p>
              
              {/* Quick Help */}
              <div className="bg-gray-50 rounded-lg p-4 inline-block max-w-md">
                <p className="text-sm text-gray-700 font-medium mb-2">Try asking:</p>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• "Show my open tickets"</li>
                  <li>• "List assets under repair"</li>
                  <li>• "How many tickets are pending?"</li>
                  <li>• "Assets in Lab A"</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 text-gray-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing your request...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2 font-medium">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => processQuery(action.query)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:shadow-sm ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className="border-t border-gray-200 p-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Type your question about assets or tickets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}