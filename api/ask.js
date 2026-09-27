Skip to content
msdr23
noor-app
Repository navigation
Code
Issues
Pull requests
Agents
Actions
Projects
Wiki
Security and quality
Insights
Settings
Files

t
T
api
ask.js
README.md
index.html
netlify.toml
noor-app/api
/

in
main

Edit

Preview
Indent mode

Indent size

Line wrap mode

Editing ask.js file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY غير موجود');
    return res.status(500).json({ error: 'مفتاح API غير موجود في إعدادات Vercel' });
  }

  try {
    // ✅ تم التحديث إلى النموذج الأحدث الموصى به من Google
    const modelName = 'gemini-3.8-flash';
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
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

Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
