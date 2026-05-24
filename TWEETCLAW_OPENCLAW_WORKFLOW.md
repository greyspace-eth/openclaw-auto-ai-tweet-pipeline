# TweetClaw OpenClaw Workflow

TweetClaw is an optional OpenClaw plugin companion for this AI tweet pipeline. Keep the existing modules as the local RSS, Reddit, formatter, queue, and direct Twitter API path. Add TweetClaw when an OpenClaw user needs structured X/Twitter search, reply context, follower context, media handling, monitors, webhooks, giveaway draws, or reviewed post and reply actions through Xquik.

## Install

```bash
openclaw plugins install @xquik/tweetclaw
openclaw config set tools.alsoAllow '["explore", "tweetclaw"]'
openclaw plugins inspect tweetclaw --runtime
openclaw skills info tweetclaw
```

Configure the Xquik API key in OpenClaw plugin config or an environment variable. Do not paste API keys into prompts, Markdown files, queue files, screenshots, logs, or shell history.

## Where TweetClaw Fits

| Pipeline stage | Existing module | TweetClaw companion use |
|---|---|---|
| Discover | `content-fetcher` | Search tweets about a topic, search tweet replies for objections, look up users, and export followers before choosing source material. |
| Polish | `tweet-formatter` | Pass only reviewed tweet URLs, IDs, handles, quotes, metrics, and notes into the formatter. Do not pass credentials or private data. |
| Queue | `scheduled-poster` | Keep scheduled drafts local, then use TweetClaw only when the user approves posting, replies, monitors, or webhooks. |
| Publish | `twitter-poster` | Use the local Twitter API script for the direct OAuth path, or use TweetClaw for the OpenClaw plugin path with approval-gated post tweets and post tweet replies. |
| Follow up | Manual review | Search tweet replies, monitor tweets, export followers, inspect media, and run giveaway draws after a campaign goes live. |

## Example Run

1. Ask OpenClaw to search tweets about the campaign topic with TweetClaw.
2. Keep a short source list: tweet URL, tweet ID, handle, date, public metrics, and why it matters.
3. Send that list into `tweet-formatter` with the source article or Reddit item.
4. Queue the final draft with `scheduled-poster` or ask TweetClaw to post after reviewing the exact text.
5. After posting, use TweetClaw to search tweet replies, monitor tweets, or create webhooks only after the user confirms the target account and event scope.

## Approval Boundary

TweetClaw can perform visible and account-scoped actions. Before any post, reply, direct message, media upload, monitor, webhook, follower export, or giveaway draw, show the final target, account, payload, limits, and expected behavior. Wait for explicit user approval before running the action.
