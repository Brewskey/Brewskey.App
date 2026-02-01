const fs = require('fs');
const path = require('path');
const base = path.join(
  __dirname,
  '../src/routes/(tabs)/(feed,stats,notifications,menu)',
);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.tsx')) {
      let s = fs.readFileSync(full, 'utf8');
      // Add one ../ to every relative import: ../../../ -> ../../../../, etc.
      s = s.replace(/from '(\.\.\/)+/g, (m) => "from '" + m + '../');
      fs.writeFileSync(full, s);
    }
  }
}
walk(base);
console.log('Done');
