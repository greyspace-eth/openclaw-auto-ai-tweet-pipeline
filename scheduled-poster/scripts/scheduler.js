#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_FILE = path.join(__dirname, '../.env');
if (fs.existsSync(ENV_FILE)) {
  const lines = fs.readFileSync(ENV_FILE, 'utf8').split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      var parts = line.split('=');
      var key = parts[0].trim();
      var val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
      process.env[key] = val;
    }
  }
}

const QUEUE_FILE = process.env.QUEUE_FILE;
const LOG_FILE = process.env.LOG_FILE;
const TWITTER_POSTER = process.env.TWITTER_POSTER_SCRIPT;

function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

function checkAndPost() {
  const queue = loadQueue();
  const now = new Date();
  let updated = false;

  for (var i = 0; i < queue.length; i++) {
    var entry = queue[i];
    if (entry.status !== 'pending') continue;

    const scheduledAt = new Date(entry.scheduledAt);
    if (scheduledAt <= now) {
      log('Posting scheduled tweet ID: ' + entry.id);
      log('Tweet: ' + entry.tweet);

      try {
        const result = execSync(
          TWITTER_POSTER + ' ' + JSON.stringify(entry.tweet),
          { encoding: 'utf8' }
        );
        log('Posted successfully: ' + result.trim());
        entry.status = 'posted';
        entry.postedAt = now.toISOString();
      } catch (err) {
        log('FAILED to post tweet ID: ' + entry.id);
        log('Error: ' + err.message);
        entry.status = 'failed';
        entry.error = err.message;
      }

      updated = true;
    }
  }

  if (updated) saveQueue(queue);
}

log('Scheduler started. Checking queue every minute...');
checkAndPost();
setInterval(checkAndPost, 60 * 1000);
