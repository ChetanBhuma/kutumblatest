const fs = require('fs');
const har = JSON.parse(fs.readFileSync('./kutumb-frontend.vercel.app.har', 'utf8'));

const apiEntries = har.log.entries
  .filter(e => e.request.url.includes('/api/v1/'))
  .map(e => ({
    url: e.request.url.replace('https://kutumb-frontend.vercel.app', ''),
    totalTime: Math.round(e.time),
    waitTime: Math.round(e.timings.wait),
    status: e.response.status,
    method: e.request.method
  }))
  .sort((a, b) => b.waitTime - a.waitTime);

let output = '\n=== SLOWEST API CALLS (by server wait time) ===\n\n';

apiEntries.slice(0, 15).forEach((e, i) => {
  output += `${i+1}. [${e.waitTime}ms wait, ${e.totalTime}ms total] ${e.method} ${e.url} (${e.status})\n`;
});

output += '\n=== ALL API CALLS ===\n\n';
apiEntries.forEach((e, i) => {
  output += `${i+1}. [${e.waitTime}ms] ${e.method} ${e.url}\n`;
});

output += '\n=== SUMMARY ===\n';
output += `Total API calls: ${apiEntries.length}\n`;
output += `Average wait time: ${Math.round(apiEntries.reduce((sum, e) => sum + e.waitTime, 0) / apiEntries.length)}ms\n`;

console.log(output);
fs.writeFileSync('./har-analysis.txt', output);
