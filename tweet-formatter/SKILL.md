---
name: tweet-formatter
version: 1.0.0
description: Format raw AI content into a tweet using a consistent personal voice. Learning in public, builder-curious, first person, insight-driven. Uses Claude AI to write the tweet.
author: local
metadata:
  openclaw:
    emoji: "✍️"
    requires:
      bins:
        - node
      env:
        - ANTHROPIC_API_KEY
    primaryEnv: ANTHROPIC_API_KEY
---

## When to use this skill
Use this skill whenever the user wants to:
- Format a piece of content into a tweet
- Turn a raw title/summary into a polished tweet in their voice
- Polish or rewrite a tweet before posting
- Get a tweet draft from an article or insight

## Instructions

When the user has picked content to tweet about (from content-fetcher or manually):

1. Extract the title, summary and URL from the selected content
2. Run the formatter:
~/.openclaw/skills/tweet-formatter/scripts/format_tweet.sh "<title>" "<summary>" "<url>"
3. Present the formatted tweet to the user
4. Ask if they are happy with it or want adjustments
5. If they want changes, re-run with additional context or instructions
6. Once approved, pass the final tweet text to twitter-poster skill to post

## This skill only formats. It does NOT post.
Posting is handled by the twitter-poster skill downstream.

## Examples

User: "Format this into a tweet: [title] [summary] [url]"
→ Run: format_tweet.sh "<title>" "<summary>" "<url>"

User: "Rewrite this tweet to sound more like me"
→ Run: format_tweet.sh "<existing tweet>" "" ""

User picks item 3 from content-fetcher results
→ Extract title/summary/url from item 3 → Run: format_tweet.sh "<title>" "<summary>" "<url>"

## Voice guidelines (for context)
- First person: I learned / I noticed / I've been exploring
- Tone: builder-curious, clear, grounded
- Structure: Insight → supporting point → quiet takeaway or soft CTA
- CTA: only when it fits naturally
- Hashtags: 1-2 max at the end
- No hype words, no buzzwords, max 1 emoji
- Always under 280 characters

## Notes
- Uses Claude API to generate the tweet
- Always shows character count after formatting
- After user approves, hand off to twitter-poster skill
