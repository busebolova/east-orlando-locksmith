import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey: clientKey, model: clientModel } = await req.json();

    // Use env var ZENTIO_API_KEY first, fall back to client-provided key
    const apiKey = process.env.ZENTIO_API_KEY || clientKey;

    if (!apiKey) {
      return NextResponse.json({ error: 'ZENTIO_API_KEY environment variable not set. Set it in Vercel dashboard or provide an API key.' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = clientModel || 'claude-opus-4-6';

    const response = await fetch('https://api.zentio.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO content writer for a locksmith company. Write content in English that is informative, well-structured with HTML formatting (h2, h3, p, ul, li, strong tags), and optimized for local search rankings. Include relevant keywords naturally. Use schema-compatible structure. Never wrap the entire output in a code block — return raw HTML content only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({
        error: `Zentio API error (${response.status}): ${errText}`,
      }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content in API response' }, { status: 500 });
    }

    return NextResponse.json({
      content,
      provider: 'zentio',
      model: data.model || model,
    });

  } catch (err) {
    return NextResponse.json({
      error: `Request failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}
