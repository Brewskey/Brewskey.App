const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, '../src');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.ts') || e.name.endsWith('.tsx')) {
      let s = fs.readFileSync(full, 'utf8');
      const orig = s;
      // Remove duplicate "from '" and relative path prefix
      s = s.replace(/from 'from '((?:\.\.\/|\.\.\.\.\/)+)/g, "from '");
      // Convert remaining relative to absolute (from '../../../../X' -> from 'X')
      s = s.replace(/from '(\.\.\/)+/g, "from '");
      if (s !== orig) fs.writeFileSync(full, s);
    }
  }
}
walk(srcDir);
console.log('Done fixing broken imports');
