export default async function handler(req, res) {
  // CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        ritual: "Respira.\nAlgo aún no se ha dicho."
      });
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.85,
          messages: [
            {
              role: "system",
              content:
                "Eres un creador de rituales breves, poéticos, sobrios y contemporáneos, con inspiración andina."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await openaiResponse.json();

    const ritual =
      data?.choices?.[0]?.message?.content ||
      "Respira.\nEl silencio también es ritual.";

    return res.json({ ritual });

  } catch (error) {
    return res.json({
      ritual: "Respira.\nAlgo no se abrió aún."
    });
  }
}
