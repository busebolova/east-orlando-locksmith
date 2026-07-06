import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey, model } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Try Anthropic API first
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model || 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          content: data.content[0].text,
          provider: 'anthropic',
        });
      }

      // If Anthropic returns auth error, try OpenRouter
      if (response.status === 401) {
        const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'anthropic/claude-sonnet',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (orResponse.ok) {
          const orData = await orResponse.json();
          return NextResponse.json({
            content: orData.choices[0].message.content,
            provider: 'openrouter',
          });
        }

        return NextResponse.json({
          error: 'API key not valid for Anthropic or OpenRouter. Please check your key.',
        }, { status: 401 });
      }

      const errData = await response.text();
      return NextResponse.json({
        error: `Anthropic API error (${response.status}): ${errData}`,
      }, { status: response.status });

    } catch (fetchErr) {
      return NextResponse.json({
        error: `API request failed: ${fetchErr instanceof Error ? fetchErr.message : 'Unknown error'}`,
      }, { status: 500 });
    }

  } catch (err) {
    return NextResponse.json({
      error: `Invalid request: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }, { status: 400 });
  }
}
