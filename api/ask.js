export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY غير موجود');
    return res.status(500).json({ error: 'مفتاح API غير موجود' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت "نور"، مساعد إسلامي ذكي ودقيق. أجب بناءً على القرآن والسنة الصحيحة وفهم السلف الصالح. اذكر المصادر دائماً. نبّه للرجوع لعالم مختص في المسائل الدقيقة. السؤال: ${question}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorMsg = data?.error?.message || `HTTP ${response.status}`;
      console.error('❌ خطأ من Gemini:', errorMsg);
      return res.status(response.status).json({ error: errorMsg });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أجد إجابة';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('❌ خطأ في الدالة:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
