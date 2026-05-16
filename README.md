# OpenClaw Auto Tweet

An automated AI content pipeline that discovers, formats, and posts AI insights to Twitter/X — in my voice, on my schedule.

Built as a personal tool to maintain a consistent "Learning in Public" presence on Twitter without spending hours curating and writing content manually.

---

## What It Does

The system is a four-stage pipeline:

```
content-fetcher → tweet-formatter → scheduled-poster → twitter-poster
   Discover           Polish              Queue               Post
```

1. **Discovers** fresh AI content from curated RSS feeds and Reddit subreddits
2. **Formats** raw content into polished tweets using Claude API, matching a specific personal voice
3. **Queues** tweets to post at optimal times via a scheduler daemon
4. **Posts** directly to Twitter/X via the official API

Each stage is an independent module — you can use them together as a full pipeline or individually.

---

## Project Structure

```
openclaw_auto_tweet/
├── content-fetcher/      # RSS & Reddit content discovery
├── tweet-formatter/      # Claude AI-powered tweet formatting
├── twitter-poster/       # Direct Twitter/X API posting
└── scheduled-poster/     # Queue management & scheduler daemon
```

---

## Modules

### content-fetcher

Fetches AI-related content from curated sources, filters by relevance, and returns categorized results ready to be formatted.

**Sources:**
- RSS Feeds: OpenAI Blog, Anthropic Blog, DeepMind Blog, MIT Technology Review, HuggingFace Blog, DeepLearning.AI
- Reddit: `r/artificial`, `r/MachineLearning`, `r/ChatGPT`, `r/LocalLLaMA`, `r/AINews`

**Filtering:**
- 20+ AI/ML keyword filter (AI, LLM, Claude, GPT, neural network, etc.)
- Categorizes results as: News, Tool/Tutorial, Research, or Insight
- Returns shuffled, deduplicated list of 5–10 items

**Setup:**
```bash
cd content-fetcher
npm install
cp .env.example .env   # fill in your config
```

**Usage:**
```bash
bash scripts/fetch_content.sh [optional topic]
```

**Environment Variables:**
```env
RSS_FEEDS=https://openai.com/blog/rss.xml,https://www.anthropic.com/rss.xml,...
REDDIT_SUBREDDITS=artificial,MachineLearning,ChatGPT,LocalLLaMA,AINews
FETCH_LIMIT=10
```

---

### tweet-formatter

Takes raw content (title + summary + URL) and rewrites it into a polished tweet using Claude AI via API. The system prompt enforces a consistent personal voice.

**Voice Guidelines:**
- First person perspective ("I learned", "I noticed", "I've been exploring")
- Tone: builder-curious, clear, and grounded — no hype, no buzzwords
- Structure: Insight → supporting point → quiet takeaway or soft CTA
- Max 1–2 hashtags, max 1 emoji
- Always under 280 characters
- No "game-changer", "revolutionary", or similar language

**Setup:**
```bash
cd tweet-formatter
npm install
cp .env.example .env   # add your Anthropic API key
```

**Usage:**
```bash
bash scripts/format_tweet.sh "<title>" "<summary>" "<url>"
```

**Environment Variables:**
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

### twitter-poster

Posts a tweet directly to Twitter/X using the official API v2 with OAuth 1.0a authentication. Validates character length before posting.

**Setup:**
```bash
cd twitter-poster
npm install
cp .env.example .env   # add your Twitter API credentials
```

**Usage:**
```bash
bash scripts/tweet.sh "Your tweet text here"
```

**Environment Variables:**
```env
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

**Getting Twitter API credentials:**
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create a project and app with Read & Write permissions
3. Generate access tokens under your app settings
4. Copy all four values into your `.env` file

---

### scheduled-poster

Manages a persistent tweet queue (`queue.json`) and runs a background scheduler daemon that checks every 60 seconds and posts tweets when their scheduled time arrives.

**Setup:**
```bash
cd scheduled-poster
npm install
cp .env.example .env   # configure paths to other module scripts
```

**Queue Management:**
```bash
# Add a tweet to the queue
bash scripts/schedule_tweet.sh "Tweet text here" "2026-06-01 09:00"

# List all pending tweets
bash scripts/list_queue.sh

# Remove a tweet by ID
bash scripts/remove_tweet.sh <tweet_id>
```

**Run the scheduler daemon:**
```bash
node scripts/scheduler.js
```

**Queue Entry Structure:**
```json
{
  "id": "unique_id",
  "tweet": "tweet content",
  "scheduledAt": "2026-06-01T09:00:00.000Z",
  "createdAt": "2026-05-30T12:00:00.000Z",
  "status": "pending",
  "postedAt": null,
  "error": null
}
```

**Environment Variables:**
```env
QUEUE_FILE=/path/to/queue.json
LOG_FILE=/path/to/scheduler.log
TWITTER_POSTER_SCRIPT=/path/to/twitter-poster/scripts/tweet.sh
FORMATTER_SCRIPT=/path/to/tweet-formatter/scripts/format_tweet.sh
CONTENT_FETCHER_SCRIPT=/path/to/content-fetcher/scripts/fetch_content.sh
```

---

## Full Workflow Example

```bash
# Step 1: Discover content
bash content-fetcher/scripts/fetch_content.sh "AI agents"

# Output example:
# [1] 🔬 Research — "Reflexion: Language Agents with Verbal Reinforcement Learning"
#     Source: ArXiv via r/MachineLearning
#     Summary: A new framework where LLMs improve through verbal self-reflection...
#     URL: https://arxiv.org/abs/2303.11366

# Step 2: Format the content into a tweet
bash tweet-formatter/scripts/format_tweet.sh \
  "Reflexion: Language Agents with Verbal Reinforcement Learning" \
  "A new framework where LLMs improve through verbal self-reflection instead of weight updates" \
  "https://arxiv.org/abs/2303.11366"

# Output example:
# "Verbal self-reflection > gradient updates? Reflexion lets LLMs critique
#  their own outputs to improve — no retraining needed. Still wrapping my
#  head around the implications. arxiv.org/abs/2303.11366 #MachineLearning"
# Character count: 241/280

# Step 3: Schedule the tweet
bash scheduled-poster/scripts/schedule_tweet.sh \
  "Verbal self-reflection > gradient updates? ..." \
  "2026-06-01 09:00"

# Step 4: Start the scheduler daemon (posts automatically at scheduled time)
node scheduled-poster/scripts/scheduler.js
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Twitter API | `twitter-api-v2` — OAuth 1.0a |
| AI Formatting | Anthropic API (Claude) |
| RSS Parsing | `rss-parser` |
| HTTP Requests | `axios` |
| Env Config | `dotenv` |
| Persistence | JSON flat files |
| Shell Scripts | Bash |

---

## Prerequisites

- Node.js v18+
- A [Twitter Developer account](https://developer.twitter.com) with a project app (Read + Write permissions)
- An [Anthropic API key](https://console.anthropic.com)

---

## Security Notes

- Each module has its own `.env` file for credentials — **never commit `.env` files to version control**
- A `.gitignore` should be set up to exclude all `.env` files before pushing
- Twitter API keys give write access to your account — treat them like passwords

---

## Author

**Grayson Lim**

---

## License

MIT
