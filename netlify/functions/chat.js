exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "AI connection is not configured." })
      };
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "AI request failed");
    }

    const answer = data.output
      ?.flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n") || "I couldn't generate a response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: answer })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
