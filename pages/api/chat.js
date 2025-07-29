// /pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  if (!endpoint || !apiKey || !deployment) {
    return res.status(500).json({ error: "Azure OpenAI credentials not set" });
  }

  try {
    const response = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 256,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to Azure OpenAI" });
  }
}
