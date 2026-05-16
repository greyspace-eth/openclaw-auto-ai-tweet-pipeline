---
name: content-fetcher
version: 1.0.0
description: Fetch relevant AI insights from curated RSS feeds and Reddit. Returns a numbered list of categorized suggestions for the user to pick from.
author: local
metadata:
  openclaw:
    emoji: "🔍"
    requires:
      bins:
        - node
      env:
        - RSS_FEEDS
        - REDDIT_SUBREDDITS
    primaryEnv: RSS_FEEDS
---

## When to use this skill
Use this skill whenever the user wants to:
- Find AI content to tweet about
- Get AI insight suggestions or inspiration
- Fetch latest AI news, tools, tutorials or research
- Browse trending AI content from Reddit and blogs

## Instructions

When the user asks for content suggestions:

1. Extract the topic if mentioned, otherwise fetch general AI content
2. Run the fetch script:
~/.openclaw/skills/content-fetcher/scripts/fetch_content.sh "<topic>"
3. Present the numbered list to the user clearly
4. Wait for the user to pick a number
5. Once they pick, confirm the selected item and store the title, summary and URL for the next skill in the pipeline to use

## This skill only fetches and presents content.
It does NOT format or post. Formatting and posting are handled by separate skills downstream in the pipeline.

## Examples

User: "Find me some AI content to tweet about"
→ Run: fetch_content.sh ""

User: "Get me AI news"
→ Run: fetch_content.sh "news"

User: "Find something about LLMs to tweet"
→ Run: fetch_content.sh "LLM"

User: "What's trending in AI research this week?"
→ Run: fetch_content.sh "research"

## Output format
Each result is displayed as:
[N] CATEGORY TITLE
    Source  : where it came from
    Summary : brief description
    URL     : original link

Categories: 📢 News | 🛠 Tool/Tutorial | 🔬 Research | 💡 Insight

## Notes
- Sources are curated AI-focused RSS feeds and subreddits
- Returns maximum 5 suggestions by default
- After user picks, pass the selected content to tweet-formatter skill
