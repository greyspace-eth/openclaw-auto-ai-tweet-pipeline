
// fetch_content.js — Fetch AI insights from RSS feeds and Reddit
// Usage: node fetch_content.js [topic]

const axios = require('axios');
const RSSParser = require('rss-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const parser = new RSSParser();
const topic = process.argv[2] || process.env.TOPIC || 'AI';
const limit = parseInt(process.env.FETCH_LIMIT) || 5;
const rssFeeds = (process.env.RSS_FEEDS || '').split(',').map(f => f.trim()).filter(Boolean);
const subreddits = (process.env.REDDIT_SUBREDDITS || '').split(',').map(s => s.trim()).filter(Boolean);

// ── AI relevance keywords ──────────────────────────────────────────────────────
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'llm', 'gpt', 'claude', 'gemini', 'openai', 'anthropic', 'deepmind',
  'neural network', 'model', 'chatbot', 'automation', 'research',
  'hugging face', 'transformer', 'diffusion', 'generative', 'agi',
  'tool', 'tutorial', 'breakthrough', 'dataset', 'benchmark', 'inference'
];

function isAIRelevant(text) {
  const lower = (text || '').toLowerCase();
  return AI_KEYWORDS.some(kw => lower.includes(kw));
}

function categorize(text) {
  const lower = (text || '').toLowerCase();
  if (['announce', 'launch', 'release', 'new', 'introduce', 'update'].some(w => lower.includes(w))) return '📢 News';
  if (['how to', 'tutorial', 'guide', 'tool', 'use', 'build', 'create'].some(w => lower.includes(w))) return '🛠 Tool/Tutorial';
  if (['research', 'paper', 'study', 'breakthrough', 'finding', 'benchmark'].some(w => lower.includes(w))) return '🔬 Research';
  return '💡 Insight';
}

// ── Fetch from RSS ─────────────────────────────────────────────────────────────
async function fetchRSS() {
  const results = [];
  for (const feed of rssFeeds) {
    try {
      const parsed = await parser.parseURL(feed);
      for (const item of parsed.items) {
        const combined = (item.title || '') + ' ' + (item.contentSnippet || '');
        if (isAIRelevant(combined)) {
          results.push({
            category: categorize(combined),
            source: 'RSS - ' + (parsed.title || feed),
            title: item.title,
            url: item.link,
            summary: (item.contentSnippet || '').slice(0, 150).trim() + '...',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch RSS: ' + feed + ' - ' + err.message);
    }
  }
  return results;
}

// ── Fetch from Reddit ──────────────────────────────────────────────────────────
async function fetchReddit() {
  const results = [];
  for (const sub of subreddits) {
    try {
      const url = `https://www.reddit.com/r/${sub}/top.json?limit=10&t=week`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'openclaw-content-fetcher/1.0' }
      });

      const posts = response.data.data.children;
      for (const post of posts) {
        const d = post.data;
        const combined = d.title + ' ' + (d.selftext || '');
        if (!d.stickied && isAIRelevant(combined)) {
          results.push({
            category: categorize(combined),
            source: 'Reddit - r/' + sub,
            title: d.title,
            url: 'https://reddit.com' + d.permalink,
            summary: d.selftext ? d.selftext.slice(0, 150).trim() + '...' : 'Link: ' + (d.url || ''),
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch Reddit r/' + sub + ' - ' + err.message);
    }
  }
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching AI insights...\n');

  const [rssResults, redditResults] = await Promise.all([fetchRSS(), fetchReddit()]);

  // Merge, shuffle and limit
  const all = [...rssResults, ...redditResults]
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);

  if (all.length === 0) {
    console.log('No AI content found. Check your RSS feeds and subreddits in .env');
    process.exit(0);
  }


  console.log('Here are ' + all.length + ' AI insight suggestions:\n');
  console.log('='.repeat(60));

  all.forEach((item, i) => {
    console.log('[' + (i + 1) + '] ' + item.category + ' ' + item.title);
    console.log('    Source  : ' + item.source);
    console.log('    Summary : ' + item.summary);
    console.log('    URL     : ' + item.url);
    console.log('='.repeat(60));
  });
}

main();
