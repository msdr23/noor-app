exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { question } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY غير موجود في إعدادات Netlify");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت "نور"، مساعد إسلامي ذكي ودقيق. 
أجب بناءً على القرآن والسنة الصحيحة وفهم السلف الصالح.
- اذكر المصادر دائماً.
- نبّه للرجوع لعالم مختص في المسائل الدقيقة كالزكاة والمواريث.
- لغتك عربية فصيحة.
السؤال: ${question}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "خطأ في الاتصال بـ Gemini");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أجد إجابة";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
      headers: { "Content-Type": "application/json" }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
