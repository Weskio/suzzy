import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Zap,
  Loader2,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { queryGroqAI } from "@/services/groqApi";
import ApiKeySetup from "./ApiKeySetup";

interface PageContent {
  title: string;
  url: string;
  headings: Array<{ level: string; text: string; id?: string }>;
  paragraphs: string[];
  links: Array<{ text: string; href: string; title?: string }>;
  timestamp: string;
}

interface AIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  action?: "highlight" | "navigate";
  target?: string;
}

// Helper function to make URLs clickable
const makeUrlsClickable = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof chrome !== "undefined" && chrome.tabs) {
              chrome.tabs.create({ url: part });
            }
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const SuzzyPopup = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isExtractingContent, setIsExtractingContent] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check for stored API key
    const storedKey = localStorage.getItem("groq_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      extractPageContent();
    }
  }, []);

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    extractPageContent();
  };

  const handleResetApiKey = () => {
    localStorage.removeItem("groq_api_key");
    setApiKey(null);
    setResponse(null);
    setShowSettings(false);
  };

  const extractPageContent = async () => {
    setIsExtractingContent(true);
    try {
      // Check if we're in a Chrome extension environment
      if (typeof chrome !== "undefined" && chrome.runtime) {
        const response = await chrome.runtime.sendMessage({
          type: "EXTRACT_CONTENT",
        });
        if (response?.success) {
          setPageContent(response.content);
        }
      } else {
        // Fallback for development environment
        console.log("Chrome extension APIs not available - using mock data");
        setPageContent({
          title: "Demo Page",
          url: "https://example.com",
          headings: [{ level: "h1", text: "Welcome to Demo" }],
          paragraphs: ["This is a demo paragraph for testing."],
          links: [{ text: "Demo Link", href: "#demo" }],
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to extract page content:", error);
    } finally {
      setIsExtractingContent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !pageContent || !apiKey) return;

    setIsLoading(true);

    try {
      // Use real Groq AI with the user's API key
      const aiResponse = await queryGroqAI(query, pageContent, apiKey);
      setResponse(aiResponse);

      // Perform action if suggested
      if (aiResponse.action === "highlight" && aiResponse.target) {
        if (typeof chrome !== "undefined" && chrome.runtime) {
          chrome.runtime.sendMessage({
            type: "HIGHLIGHT_TEXT",
            text: aiResponse.target,
          });
        } else {
          console.log("Would highlight:", aiResponse.target);
        }
      }

      if (aiResponse.action === "navigate" && aiResponse.target) {
        if (typeof chrome !== "undefined" && chrome.runtime) {
          chrome.runtime.sendMessage({
            type: "NAVIGATE_TO_ELEMENT",
            target: aiResponse.target,
          });
        } else {
          console.log("Would navigate to:", aiResponse.target);
        }
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setResponse({
        answer:
          "Sorry, I encountered an error while processing your request. Please check your API key and try again.",
        confidence: 0.1,
        sources: [],
      });
    }

    setIsLoading(false);
  };

  const handleExampleQuery = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  const exampleQueries = [
    "What does this organization do?",
    "Take me to the contact page",
    "Does this site mention donations?",
    "Find the pricing information",
  ];

  // Show API key setup if no key is configured
  if (!apiKey && !showSettings) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="w-80 h-96 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">Suzzy</h1>
          <p className="text-xs text-gray-600">Smart Web Assistant</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 p-0"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="p-3 mb-4 bg-white border-0 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">API Key Status</p>
            <p className="text-xs text-gray-500">
              Key: {apiKey ? `${apiKey.substring(0, 7)}...` : "Not set"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetApiKey}
              className="w-full text-xs"
            >
              Reset API Key
            </Button>
          </div>
        </Card>
      )}

      {/* Page Status */}
      <Card className="p-3 mb-4 bg-white/70 backdrop-blur-sm border-0 shadow-sm">
        <div className="flex items-center gap-2">
          {isExtractingContent ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {pageContent?.title || "Loading page..."}
            </p>
            <p className="text-xs text-gray-500">
              {isExtractingContent ? "Analyzing content..." : "Ready to help"}
            </p>
          </div>
        </div>
      </Card>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about this page or navigate..."
            className="pr-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            disabled={isLoading || isExtractingContent}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 bg-blue-500 hover:bg-blue-600"
            disabled={isLoading || !query.trim() || isExtractingContent}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Response */}
      {response && (
        <Card className="p-3 mb-4 bg-white border-0 shadow-sm flex-1 overflow-hidden">
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Badge
                variant="secondary"
                className={`text-xs mb-2 ${
                  response.confidence > 0.7
                    ? "bg-green-100 text-green-800"
                    : response.confidence > 0.5
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {Math.round(response.confidence * 100)}% confident
              </Badge>
              <div className="overflow-y-auto max-h-48 pr-2">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {makeUrlsClickable(response.answer)}
                </p>
                {response.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Sources found:</p>
                    <p className="text-xs text-gray-700 italic">
                      "{response.sources[0].substring(0, 80)}..."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Example Queries */}
      {!response && !isLoading && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 mb-2">Try asking:</p>
          <div className="grid grid-cols-1 gap-1">
            {exampleQueries.map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleExampleQuery(example)}
                className="text-xs text-left justify-start h-7 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                disabled={isExtractingContent}
              >
                "{example}"
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuzzyPopup;
