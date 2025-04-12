
interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequest {
  model: string;
  messages: ClaudeMessage[];
  max_tokens: number;
  temperature?: number;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  stop_reason: string;
  type: string;
}

// This key would ideally be stored in environment variables on the server
// For demo purposes we're using localStorage until the app connects to Supabase
const getApiKey = (): string => {
  return localStorage.getItem("claude_api_key") || "";
};

export const saveApiKey = (key: string): void => {
  localStorage.setItem("claude_api_key", key);
};

export const checkApiKeyExists = (): boolean => {
  return !!localStorage.getItem("claude_api_key");
};

export const sendMessageToClaude = async (
  messages: { sender: "user" | "ai"; content: string }[]
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Claude API key not found");
  }

  try {
    // Convert our message format to Claude's format
    const claudeMessages: ClaudeMessage[] = messages.map(msg => ({
      role: msg.sender === "ai" ? "assistant" : "user",
      content: msg.content
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        temperature: 0.7,
        messages: claudeMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};
