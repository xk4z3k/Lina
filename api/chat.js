export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(200).json({ error: "Only POST allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ reply: "API Key fehlt" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(200).json({ reply: "Kein Text erhalten" });
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: message
      })
    });

    const data = await r.json();

    if (!data.output_text) {
      return res.status(200).json({ reply: "Leere Antwort von OpenAI" });
    }

    return res.status(200).json({ reply: data.output_text });

  } catch (e) {
    return res.status(200).json({ reply: "Serverfehler" });
  }
}
