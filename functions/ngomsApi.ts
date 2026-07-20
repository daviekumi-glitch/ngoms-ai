import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }

  const { action, collection, id, data, payload } = body;

  const base44 = createClientFromRequest(req);
  const db = base44.asServiceRole || base44;

  const entityMap: Record<string, string> = {
    users: "User", courses: "Course", quizzes: "Quiz",
    flashcards: "FlashcardDeck", flashcardDecks: "FlashcardDeck",
    documents: "Document", notifications: "AppNotification",
    plans: "Plan", badges: "Badge", payments: "Payment",
    features: "FeatureToggle", coupons: "Coupon",
    announcements: "Announcement", faqs: "FAQ",
    testimonials: "Testimonial", logs: "SystemLog",
    messages: "ContactMessage", leaderboard: "LeaderboardEntry",
    banner: "AppBanner", settings: "AppSettings",
    chatSessions: "ChatSession",
  };

  function getEntity(col: string) {
    const name = entityMap[col];
    if (!name) throw new Error("Unknown collection: " + col);
    try { return db.entities[name]; } catch { return base44.entities[name]; }
  }

  try {
    switch (action) {
      case "list": {
        const records = await getEntity(collection).list();
        return Response.json({ success: true, data: records }, { headers: corsHeaders });
      }
      case "create": {
        const record = await getEntity(collection).create(data);
        try { await db.entities.SystemLog.create({ action: `Created ${collection}`, user: "admin", time: new Date().toLocaleString(), level: "success" }); } catch {}
        return Response.json({ success: true, data: record }, { status: 201, headers: corsHeaders });
      }
      case "update": {
        const record = await getEntity(collection).update(id, data);
        try { await db.entities.SystemLog.create({ action: `Updated ${collection}`, user: "admin", time: new Date().toLocaleString(), level: "info" }); } catch {}
        return Response.json({ success: true, data: record }, { headers: corsHeaders });
      }
      case "delete": {
        await getEntity(collection).delete(id);
        try { await db.entities.SystemLog.create({ action: `Deleted ${collection}`, user: "admin", time: new Date().toLocaleString(), level: "warning" }); } catch {}
        return Response.json({ success: true }, { headers: corsHeaders });
      }
      case "admin_login": {
        const { email, password } = payload || {};
        if (email === "daviehackez@gmail.com" && password === "admin2007") {
          try { await db.entities.SystemLog.create({ action: "Admin login", user: email, time: new Date().toLocaleString(), level: "info" }); } catch {}
          return Response.json({ success: true, session: { email, loginAt: new Date().toISOString() } }, { headers: corsHeaders });
        }
        try { await db.entities.SystemLog.create({ action: "Failed admin login", user: email || "unknown", time: new Date().toLocaleString(), level: "warning" }); } catch {}
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
      }
      case "get_app_config": {
        const [banner, settings, features, announcements, notifications, plans, leaderboard, badges, courses, quizzes, flashcards, documents, payments, coupons, faqs, testimonials, logs, messages] = await Promise.all([
          db.entities.AppBanner.list(), db.entities.AppSettings.list(),
          db.entities.FeatureToggle.list(), db.entities.Announcement.list(),
          db.entities.AppNotification.list(), db.entities.Plan.list(),
          db.entities.LeaderboardEntry.list(), db.entities.Badge.list(),
          db.entities.Course.list(), db.entities.Quiz.list(),
          db.entities.FlashcardDeck.list(), db.entities.Document.list(),
          db.entities.Payment.list(), db.entities.Coupon.list(),
          db.entities.FAQ.list(), db.entities.Testimonial.list(),
          db.entities.SystemLog.list(), db.entities.ContactMessage.list(),
        ]);
        return Response.json({
          success: true,
          banner: banner[0] || null, appSettings: settings[0] || null,
          features: features || [], announcements: announcements || [],
          notifications: notifications || [], plans: plans || [],
          leaderboard: leaderboard || [], badges: badges || [],
          courses: courses || [], quizzes: quizzes || [],
          flashcardDecks: flashcards || [], documents: documents || [],
          payments: payments || [], coupons: coupons || [],
          faqs: faqs || [], testimonials: testimonials || [],
          logs: logs || [], messages: messages || [],
        }, { headers: corsHeaders });
      }
      case "ai_chat": {
        const { messages } = payload || {};
        const systemPrompt = "You are Ngoms AI Tutor, a helpful education assistant for African students. Be encouraging, clear, and provide examples. Keep responses concise but thorough.";
        const freeModels = ["google/gemma-2-9b-it:free", "meta-llama/llama-3.2-3b-instruct:free", "meta-llama/llama-3.1-8b-instruct:free", "mistralai/mistral-7b-instruct:free", "qwen/qwen-2-7b-instruct:free"];
        const apiKey = Deno.env.get("OPENROUTER_API_KEY");
        if (!apiKey) {
          return Response.json({ success: true, reply: "I'm here to help! The AI service is being configured. Please try again shortly.", model: "fallback" }, { headers: corsHeaders });
        }
        const chatMessages = [
          { role: "system", content: systemPrompt },
          ...(messages || []).map((m: any) => ({ role: m.role === "ai" ? "assistant" : m.role, content: m.text })),
        ];
        for (const model of freeModels) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://ngoms.ai", "X-Title": "Ngoms AI" },
              body: JSON.stringify({ model, messages: chatMessages, max_tokens: 800, temperature: 0.7 }),
            });
            if (!response.ok) continue;
            const result: any = await response.json();
            const reply = result.choices?.[0]?.message?.content;
            if (reply) return Response.json({ success: true, reply, model }, { headers: corsHeaders });
          } catch { continue; }
        }
        return Response.json({ success: false, reply: "I'm having trouble connecting. Please try again!", model: "fallback" }, { headers: corsHeaders });
      }
      case "ai_quiz": {
        const { topic, difficulty, count } = payload || {};
        const apiKey = Deno.env.get("OPENROUTER_API_KEY");
        const quizPrompt = `Generate ${count || 5} multiple choice questions about "${topic}". Difficulty: ${difficulty || 'Medium'}. Return ONLY valid JSON array, each item: {"q": "question text", "options": ["A","B","C","D"], "answer": 0-3 index}. No markdown, no code blocks, just raw JSON.`;
        if (!apiKey) {
          return Response.json({ success: false, error: "AI service not configured" }, { headers: corsHeaders });
        }
        const models = ["google/gemma-2-9b-it:free", "meta-llama/llama-3.2-3b-instruct:free", "meta-llama/llama-3.1-8b-instruct:free"];
        for (const model of models) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://ngoms.ai", "X-Title": "Ngoms AI" },
              body: JSON.stringify({ model, messages: [{ role: "user", content: quizPrompt }], max_tokens: 1500, temperature: 0.8 }),
            });
            if (!response.ok) continue;
            const result: any = await response.json();
            let content = result.choices?.[0]?.message?.content || "[]";
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const questions = JSON.parse(content);
            if (Array.isArray(questions) && questions.length > 0) {
              return Response.json({ success: true, questions }, { headers: corsHeaders });
            }
          } catch { continue; }
        }
        return Response.json({ success: false, error: "Could not generate quiz" }, { headers: corsHeaders });
      }
      case "ai_notes": {
        const { topic, format } = payload || {};
        const apiKey = Deno.env.get("OPENROUTER_API_KEY");
        const notePrompt = `Create study notes about "${topic}" in ${format || 'summary'} format. Be concise, educational, and suitable for African students. Use clear headings and bullet points. Maximum 300 words.`;
        if (!apiKey) {
          return Response.json({ success: false, error: "AI service not configured" }, { headers: corsHeaders });
        }
        const models = ["google/gemma-2-9b-it:free", "meta-llama/llama-3.2-3b-instruct:free", "meta-llama/llama-3.1-8b-instruct:free"];
        for (const model of models) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://ngoms.ai", "X-Title": "Ngoms AI" },
              body: JSON.stringify({ model, messages: [{ role: "user", content: notePrompt }], max_tokens: 1000, temperature: 0.7 }),
            });
            if (!response.ok) continue;
            const result: any = await response.json();
            const content = result.choices?.[0]?.message?.content;
            if (content) return Response.json({ success: true, content }, { headers: corsHeaders });
          } catch { continue; }
        }
        return Response.json({ success: false, error: "Could not generate notes" }, { headers: corsHeaders });
      }
      default:
        return Response.json({ error: "Unknown action: " + action }, { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
  } catch (err: any) {
    return Response.json({ error: err.message || "Internal server error" }, { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
