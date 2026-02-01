const fs = require('fs');
const path = require('path');

const dirs = process.argv.slice(2).map((d) => path.join(__dirname, '..', d));

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  // Replace from '../ or from '../../ or from '../../../ or from '../../../../ etc with from '
  // when followed by common/, components/, hooks/, theme, utils/, resources/, stores/, config
  content = content.replace(
    /from ['"](\.\.\/)+(common\/[^'"]+)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(components\/[^'"]+)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(hooks\/[^'"]+)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(theme[^'"]*)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(utils\/[^'"]+)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(resources\/[^'"]+)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(stores\/[^'"]+)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /from ['"](\.\.\/)+(config[^'"]*)['"]/g,
    (_, __, rest) => `from '${rest}'`,
  );
  content = content.replace(
    /import type \{ [^}]+ \} from ['"](\.\.\/)+(components\/[^'"]+)['"]/g,
    (m) => m.replace(/from ['"](\.\.\/)+/, "from '"),
  );
  if (content !== original) fs.writeFileSync(filePath, content);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts'))
      processFile(full);
  }
}

dirs.forEach(walk);
console.log('Done');
