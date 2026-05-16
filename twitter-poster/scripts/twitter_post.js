#!/usr/bin/env node
const { TwitterApi } = require('twitter-api-v2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const required = ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'];
for (const v of required) {
  if (!process.env[v]) {
    console.error('Missing required env var: ' + v);
    process.exit(1);
  }
}

const tweetText = process.argv[2];
if (!tweetText) {
  console.error('Usage: node twitter_post.js "Your tweet text here"');
  process.exit(1);
}

if (tweetText.length > 280) {
  console.error('Tweet is too long (' + tweetText.length + ' chars). Max is 280.');
  process.exit(1);
}

async function postTweet() {
  console.log('Posting tweet...');
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  try {
    const { data } = await client.v2.tweet(tweetText);
    console.log('Tweet posted successfully!');
    console.log('URL: https://twitter.com/i/web/status/' + data.id);
  } catch (err) {
    console.error('Failed to post tweet.');
    console.error('Status: ' + err.code);
    console.error('Message: ' + err.message);
    console.error('Full error: ' + JSON.stringify(err.data,null,2));
    process.exit(1);
  }
}

postTweet();
