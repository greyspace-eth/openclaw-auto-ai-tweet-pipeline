#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const QUEUE_FILE = process.env.QUEUE_FILE;

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

const command = process.argv[2];

if (command === 'add') {
  const tweetText = process.argv[3];
  const scheduledAt = process.argv[4];

  if (!tweetText || !scheduledAt) {
    console.error('Usage: node queue.js add "<tweet text>" "<datetime>"');
    process.exit(1);
  }

  const scheduledDate = new Date(scheduledAt);
  if (isNaN(scheduledDate.getTime())) {
    console.error('Invalid date format. Use: YYYY-MM-DD HH:MM');
    process.exit(1);
  }

  if (scheduledDate < new Date()) {
    console.error('Scheduled time is in the past.');
    process.exit(1);
  }

  const queue = loadQueue();
  const entry = {
    id: generateId(),
    tweet: tweetText,
    scheduledAt: scheduledDate.toISOString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  queue.push(entry);
  queue.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  saveQueue(queue);

  console.log('Tweet scheduled successfully!');
  console.log('ID       : ' + entry.id);
  console.log('Tweet    : ' + entry.tweet);
  console.log('Scheduled: ' + scheduledDate.toLocaleString());

} else if (command === 'list') {
  const queue = loadQueue();
  const pending = queue.filter(function(e) { return e.status === 'pending'; });

  if (pending.length === 0) {
    console.log('No tweets scheduled.');
    process.exit(0);
  }

  console.log('Scheduled tweets (' + pending.length + ' pending):\n');
  console.log('='.repeat(60));
  pending.forEach(function(entry, i) {
    console.log('[' + (i + 1) + '] ID: ' + entry.id);
    console.log('    Tweet    : ' + entry.tweet);
    console.log('    Scheduled: ' + new Date(entry.scheduledAt).toLocaleString());
    console.log('='.repeat(60));
  });

} else if (command === 'remove') {
  const id = process.argv[3];
  if (!id) {
    console.error('Usage: node queue.js remove <id>');
    process.exit(1);
  }

  const queue = loadQueue();
  const index = queue.findIndex(function(e) { return e.id === id; });

  if (index === -1) {
    console.error('Tweet with ID ' + id + ' not found.');
    process.exit(1);
  }

  const removed = queue.splice(index, 1)[0];
  saveQueue(queue);
  console.log('Removed scheduled tweet: ' + removed.tweet);

} else {
  console.error('Usage: node queue.js <add|list|remove>');
  process.exit(1);
}
