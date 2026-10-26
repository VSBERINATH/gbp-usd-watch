// Daily check. Sends a phone alert through ntfy when it is a good time.
// Needs env NTFY_TOPIC (your secret topic name). Node 18+.
const topic = process.env.NTFY_TOPIC;
const d = x => x.toISOString().slice(0, 10);
const end = new Date(), start = new Date();
start.setMonth(start.getMonth() - 6);

const res = await fetch(`https://api.frankfurter.dev/v1/${d(start)}..${d(end)}?base=GBP&symbols=USD`);
const j = await res.json();
const rows = Object.entries(j.rates).map(([k, v]) => [k, v.USD]).sort();
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
const cut = new Date(); cut.setMonth(cut.getMonth() - 3);
const all = rows.map(r => r[1]);
const v3 = rows.filter(r => new Date(r[0]) >= cut).map(r => r[1]);
const today = all.at(-1), min = Math.min(...all), max = Math.max(...all);
const avg3 = avg(v3), avg6 = avg(all), pos = (today - min) / (max - min);

let msg = null;
if (pos <= 0.25 && today < avg3 && today < avg6) msg = 'BEST TIME NOW: convert USD loan money to GBP (you get more GBP per USD than usual)';
if (pos >= 0.75 && today > avg3 && today > avg6) msg = 'BEST TIME NOW: pay back your USD loan (you get more USD per GBP than usual)';

let line = `GBP/USD ${today.toFixed(4)} | 3m avg ${avg3.toFixed(4)} | 6m avg ${avg6.toFixed(4)} | range pos ${Math.round(pos * 100)}%`;
if (msg || process.env.FORCE_TEST === 'true') { const conv = msg ? msg.includes('convert') : true; const A = 100; const now = conv ? A / today : A * today; const av = conv ? A / avg6 : A * avg6; const best = conv ? A / min : A * max; const u = conv ? 'GBP' : 'USD', i = conv ? 'USD' : 'GBP'; line = (msg ? 'Best time now! ' : 'Example: ') + A + ' ' + i + ' gets you ' + now.toFixed(2) + ' ' + u + ' today. Average over 6 months: ' + av.toFixed(2) + ' ' + u + '. Best in 6 months: ' + best.toFixed(2) + ' ' + u + '. | ' + line; }
console.log(line, '->', msg || 'no signal');

if (msg && topic) {
  await fetch(`https://ntfy.sh/${topic}`, {
    method: 'POST',
    headers: { Title: 'GBP/USD Watch' },
    body: `${msg}\n${line}`,
  });
}

import { appendFileSync } from 'node:fs';
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, 'signal=' + (msg || '') + '\nline=' + line + '\n');
