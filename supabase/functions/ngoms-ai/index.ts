import { supabase } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function jsonResponse(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extra },
  });
}

const SYSTEM_PROMPT = `You are Ngoms AI Tutor, a helpful education assistant for African students.
Be encouraging, clear, and provide examples. Keep responses concise but thorough.
Use simple language and relate concepts to everyday life when possible.`;

const FREE_MODELS = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
];

async function callOpenRouter(messages, maxTokens, temperature) {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) {
    return { reply: "I'm here to help! The AI service is being configured. Please try again shortly.", model: 'fallback' };
  }

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ngoms.ai',
          'X-Title': 'Ngoms AI',
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
      });
      if (!response.ok) continue;
      const result = await response.json();
      const reply = result.choices?.[0]?.message?.content;
      if (reply) return { reply, model };
    } catch { continue; }
  }
  return { reply: "I'm having trouble connecting right now. Please try again!", model: 'fallback' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();

    switch (action) {
      case 'chat': {
        const { messages } = payload || {};
        const chatMessages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(messages || []).map((m) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.text || m.content,
          })),
        ];
        const { reply, model } = await callOpenRouter(chatMessages, 800, 0.7);
        return jsonResponse({ success: true, reply, model });
      }

      case 'quiz': {
        const { topic, difficulty, count } = payload || {};
        const prompt = `Generate ${count || 5} multiple choice questions about "${topic}". Difficulty: ${difficulty || 'Medium'}. Return ONLY a valid JSON array. Each item: {"question":"...","options":["A","B","C","D"],"answer":"exact option text"}. No markdown, no code fences, just raw JSON.`;
        const { reply } = await callOpenRouter([{ role: 'user', content: prompt }], 1500, 0.8);
        let questions = [];
        try {
          let cleaned = reply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          questions = JSON.parse(cleaned);
        } catch {
          try {
            const match = reply.match(/\[[\s\S]*\]/);
            if (match) questions = JSON.parse(match[0]);
          } catch { questions = []; }
        }
        if (!Array.isArray(questions) || questions.length === 0) {
          return jsonResponse({ success: false, error: 'Could not generate quiz questions' });
        }
        return jsonResponse({ success: true, questions });
      }

      case 'notes': {
        const { topic, format } = payload || {};
        const prompt = `Create study notes about "${topic}" in ${format || 'summary'} format. Be concise, educational, and suitable for African students. Use clear headings and bullet points. Maximum 300 words.`;
        const { reply } = await callOpenRouter([{ role: 'user', content: prompt }], 1000, 0.7);
        return jsonResponse({ success: true, content: reply });
      }

      default:
        return jsonResponse({ error: 'Unknown action: ' + action }, 400);
    }
  } catch (err) {
    return jsonResponse({ error: err.message || 'Internal server error' }, 500);
  }
});
