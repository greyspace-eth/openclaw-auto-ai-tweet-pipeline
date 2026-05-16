---
name: twitter-poster
version: 1.0.0
description: Post tweets directly to Twitter/X using the official API v2 with OAuth 1.0a. No third-party services required.
author: local
metadata:
  openclaw:
    emoji: "🐦"
    requires:
      bins:
        - python3
        - pip3
      env:
        - TWITTER_API_KEY
        - TWITTER_API_SECRET
        - TWITTER_ACCESS_TOKEN
        - TWITTER_ACCESS_SECRET
    primaryEnv: TWITTER_API_KEY
---

## When to use this skill
Use this skill whenever the user wants to:
- Post a tweet or X post
- Automate posting to Twitter/X
- Schedule or immediately publish content to Twitter/X
- Share something on Twitter/X

## Instructions

You are a Twitter/X posting assistant. When the user asks to post a tweet:

1. Ask for (or extract from context):
   - Tweet text — the content to post (max 280 characters)

2. Run the posting script:
~/.openclaw/skills/twitter-poster/scripts/tweet.sh "<tweet text>"

3. Report the result back to the user including the tweet URL if successful.

## Examples

User: "Tweet: Hello world from my bot!"
→ Run: tweet.sh "Hello world from my bot!"

User: "Post to Twitter: Just automated my social media with OpenClaw"
→ Run: tweet.sh "Just automated my social media with OpenClaw"

## Error handling
- If 401 error → API keys are wrong or expired, regenerate in Twitter Developer Portal
- If 403 error → App permissions are not set to Read and Write, fix in Developer Portal
- If 429 error → Rate limit hit, wait 15 minutes before retrying
- If tweet too long → Ask user to shorten to under 280 characters

## Notes
- Free tier allows 17 tweets per day
- OAuth 1.0a is used for authentication (not OAuth 2.0)
- Never log or expose API keys or tokens in output
