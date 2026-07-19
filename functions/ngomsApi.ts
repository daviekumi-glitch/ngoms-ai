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

  const base44 = createClientFromRequest(req);
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }

  const { action, collection, id, data, payload } = body;

  const entityMap: Record<string, string> = {
    users: "User", courses: "Course", quizzes: "Quiz",
    flashcardDecks: "FlashcardDeck", documents: "Document",
    notifications: "AppNotification", plans: "Plan", badges: "Badge",
    payments: "Payment", features: "FeatureToggle", coupons: "Coupon",
    announcements: "Announcement", faqs: "FAQ", testimonials: "Testimonial",
    logs: "SystemLog", messages: "ContactMessage",
    leaderboard: "LeaderboardEntry", banner: "AppBanner",
    settings: "AppSettings", chatSessions: "ChatSession",
  };

  function getEntity(col: string) {
    const name = entityMap[col];
    if (!name) throw new Error("Unknown collection: " + col);
    return base44.entities[name];
  }

  try {
    switch (action) {
      case "list": {
        const records = await getEntity(collection).list();
        return Response.json({ success: true, data: records }, { headers: corsHeaders });
      }
      case "create": {
        const record = await getEntity(collection).create(data);
        try { await base44.entities.SystemLog.create({ action: `Created ${collection}`, user: "admin", time: new Date().toLocaleString(), level: "success" }); } catch {}
        return Response.json({ success: true, data: record }, { status: 201, headers: corsHeaders });
      }
      case "update": {
        const record = await getEntity(collection).update(id, data);
        return Response.json({ success: true, data: record }, { headers: corsHeaders });
      }
      case "delete": {
        await getEntity(collection).delete(id);
        try { await base44.entities.SystemLog.create({ action: `Deleted ${collection}`, user: "admin", time: new Date().toLocaleString(), level: "warning" }); } catch {}
        return Response.json({ success: true }, { headers: corsHeaders });
      }
      case "admin_login": {
        const { email, password } = payload || {};
        if (email === "daviehackez@gmail.com" && password === "admin2007") {
          try { await base44.entities.SystemLog.create({ action: "Admin login", user: email, time: new Date().toLocaleString(), level: "info" }); } catch {}
          return Response.json({ success: true, session: { email, loginAt: new Date().toISOString() } }, { headers: corsHeaders });
        }
        try { await base44.entities.SystemLog.create({ action: "Failed admin login", user: email || "unknown", time: new Date().toLocaleString(), level: "warning" }); } catch {}
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
      }
      case "get_app_config": {
        const [banner, settings, features, announcements, notifications, plans, leaderboard, badges, courses, quizzes, flashcardDecks, documents, payments, coupons, faqs, testimonials, logs, messages] = await Promise.all([
          base44.entities.AppBanner.list(), base44.entities.AppSettings.list(),
          base44.entities.FeatureToggle.list(), base44.entities.Announcement.list(),
          base44.entities.AppNotification.list(), base44.entities.Plan.list(),
          base44.entities.LeaderboardEntry.list(), base44.entities.Badge.list(),
          base44.entities.Course.list(), base44.entities.Quiz.list(),
          base44.entities.FlashcardDeck.list(), base44.entities.Document.list(),
          base44.entities.Payment.list(), base44.entities.Coupon.list(),
          base44.entities.FAQ.list(), base44.entities.Testimonial.list(),
          base44.entities.SystemLog.list(), base44.entities.ContactMessage.list(),
        ]);
        return Response.json({
          success: true,
          banner: banner[0] || null, appSettings: settings[0] || null,
          features: features || [], announcements: announcements || [],
          notifications: notifications || [], plans: plans || [],
          leaderboard: leaderboard || [], badges: badges || [],
          courses: courses || [], quizzes: quizzes || [],
          flashcardDecks: flashcardDecks || [], documents: documents || [],
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
      default:
        return Response.json({ error: "Unknown action: " + action }, { status: 400, headers: corsHeaders });
    }
  } catch (err: any) {
    return Response.json({ error: err.message || "Internal server error" }, { status: 500, headers: corsHeaders });
  }
});
