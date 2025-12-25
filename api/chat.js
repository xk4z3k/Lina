export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "API Key fehlt" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: message
      })
    });

    const data = await response.json();

    if (!data.output_text) {
      return res.status(500).json({ reply: "Leere Antwort von OpenAI" });
    }

    res.status(200).json({ reply: data.output_text });

  } catch (err) {
    res.status(500).json({ reply: "Serverfehler" });
  }
}
