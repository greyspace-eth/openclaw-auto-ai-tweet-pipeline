---
name: scheduled-poster
version: 1.0.0
description: Schedule tweets to be posted at a specific date and time. Supports manual queue and auto-generated tweets. Cron job checks queue every minute and posts when due.
author: local
metadata:
  openclaw:
    emoji: "⏰"
    requires:
      bins:
        - node
      env:
        - QUEUE_FILE
        - TWITTER_POSTER_SCRIPT
    primaryEnv: QUEUE_FILE
---

## When to use this skill
Use this skill whenever the user wants to:
- Schedule a tweet for a specific date and time
- View all pending scheduled tweets
- Remove a scheduled tweet from the queue
- Queue a tweet for later posting

## Instructions

### To schedule a tweet:
~/.openclaw/skills/scheduled-poster/scripts/schedule_tweet.sh "<tweet text>" "<YYYY-MM-DD HH:MM>"

### To list all pending scheduled tweets:
~/.openclaw/skills/scheduled-poster/scripts/list_queue.sh

### To remove a scheduled tweet:
~/.openclaw/skills/scheduled-poster/scripts/remove_tweet.sh <id>

## Examples

User: "Schedule this tweet for tomorrow 9am: [tweet text]"
→ Run: schedule_tweet.sh "<tweet text>" "2026-02-26 09:00"

User: "Show me my scheduled tweets"
→ Run: list_queue.sh

User: "Cancel the tweet with ID abc123"
→ Run: remove_tweet.sh abc123

User: "Schedule this for Friday 3pm"
→ Calculate the correct date → Run: schedule_tweet.sh "<tweet text>" "2026-02-28 15:00"

## Pipeline integration
This skill works with tweet-formatter and content-fetcher:
1. content-fetcher fetches content
2. tweet-formatter formats it
3. scheduled-poster queues it for a specific time
4. Cron job fires tweet.sh at the right time automatically

## Notes
- Cron job checks queue every minute
- Failed posts are logged to scheduler.log
- Queue is stored in queue.json
- Tweets are posted via twitter-poster skill
