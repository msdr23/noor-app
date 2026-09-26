export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح GEMINI_API_KEY غير موجود' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت "نور"، مساعد إسلامي ذكي ودقيق. أجب بناءً على القرآن والسنة الصحيحة وفهم السلف الصالح. اذكر المصادر دائماً. نبّه للرجوع لعالم مختص في المسائل الدقيقة. السؤال: ${question}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'خطأ في الاتصال بـ Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أجد إجابة';

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
