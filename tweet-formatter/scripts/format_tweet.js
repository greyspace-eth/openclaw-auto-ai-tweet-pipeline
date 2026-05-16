

// format_tweet.js — Format raw AI content into a tweet in your personal voice
// Usage: node format_tweet.js "<title>" "<summary>" "<url>"

const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// ── Validate ───────────────────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing required env var: ANTHROPIC_API_KEY');
  process.exit(1);
}

// ── Args ───────────────────────────────────────────────────────────────────────
const title = process.argv[2] || '';
const summary = process.argv[3] || '';
const url = process.argv[4] || '';

if (!title && !summary) {
  console.error('Usage: node format_tweet.js "<title>" "<summary>" "<url>"');
  process.exit(1);
}

// ── Prompt ─────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a tweet formatter for someone who tweets about AI with a "Learning in Public" voice.

Their style:
- First person perspective (I learned / I noticed / I've been exploring / I've been thinking about)
- Tone: builder-curious, clear, grounded — not hype, not clickbait, not corporate
- Structure: Insight → supporting point → quiet takeaway or soft CTA
- CTA: only when it fits naturally — sometimes end with a question, sometimes just a quiet statement
- Hashtags: 1-2 max, only super relevant ones, placed at the end
- Length: under 280 characters always
- No buzzwords like "game-changer", "revolutionary", "mind-blowing"
- No excessive emojis — use 1 max if it genuinely adds to the message
- Feel: like a smart friend sharing something they just discovered, not a brand account

Always return ONLY the final tweet text. No explanations, no options, no preamble.`;

const USER_PROMPT = `Format this AI content into a tweet in my voice:

Title: ${title}
Summary: ${summary}
URL: ${url}

Return only the tweet text, nothing else.`;

// ── Call Anthropic API ─────────────────────────────────────────────────────────
function callClaude(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-opus-4-0',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) {
            resolve(parsed.content[0].text.trim());
          } else {
            reject(new Error('Unexpected response: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Formatting tweet...\n');

  try {
    const tweet = await callClaude(SYSTEM_PROMPT, USER_PROMPT);
    const charCount = tweet.length;

    console.log('='.repeat(60));
    console.log(tweet);
    console.log('='.repeat(60));
    console.log('Character count: ' + charCount + '/280');

    if (charCount > 280) {
      console.log('WARNING: Tweet exceeds 280 characters. Consider shortening.');
    } else {
      console.log('Ready to post!');
    }
  } catch (err) {
    console.error('Failed to format tweet: ' + err.message);
    process.exit(1);
  }
}

main();
