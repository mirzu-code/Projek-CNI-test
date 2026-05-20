const fs = require('fs');
const path = require('path');
const file = path.resolve('src/pages/Admin.jsx');
const text = fs.readFileSync(file, 'utf8');
const lines = text.split('\n');
function posToLine(pos) {
  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    idx += lines[i].length + 1;
    if (pos < idx) return i + 1;
  }
  return lines.length;
}

const stack = [];
let inSingle = false;
let inDouble = false;
let inBacktick = false;
let inBrace = 0;
let inTag = false;
let tagStart = -1;
let tagText = '';
let isClosing = false;
for (let i = 0; i < text.length; i++) {
  const ch = text[i];
  const prev = text[i - 1];
  if (!inTag) {
    if (ch === '<' && !inSingle && !inDouble && !inBacktick && inBrace === 0) {
      // ignore fragments like </? or JSX expressions inside text?
      inTag = true;
      tagStart = i;
      isClosing = text[i + 1] === '/';
      tagText = ch;
      continue;
    }
    if (ch === "'" && !inDouble && !inBacktick) inSingle = !inSingle;
    if (ch === '"' && !inSingle && !inBacktick) inDouble = !inDouble;
    if (ch === '`' && !inSingle && !inDouble) inBacktick = !inBacktick;
    if (ch === '{' && !inSingle && !inDouble && !inBacktick) inBrace++;
    if (ch === '}' && !inSingle && !inDouble && !inBacktick && inBrace > 0) inBrace--;
  } else {
    tagText += ch;
    if (ch === '>' && !inSingle && !inDouble && !inBacktick && inBrace === 0) {
      // tag ended
      const pos = tagStart;
      const line = posToLine(pos);
      const inner = tagText.slice(isClosing ? 2 : 1, -1).trim();
      const selfClosing = /\/$/.test(inner) || tagText.endsWith('/>');
      const tagNameMatch = inner.match(/^([A-Za-z][A-Za-z0-9_-]*)/);
      if (tagNameMatch) {
        const tagName = tagNameMatch[1];
        if (!isClosing && !selfClosing) {
          stack.push({ tagName, line, text: tagText });
        } else if (isClosing) {
          if (stack.length === 0) {
            console.log('Extra closing', tagName, 'line', line, 'text', tagText);
            process.exit(0);
          }
          const top = stack.pop();
          if (top.tagName !== tagName) {
            console.log('Mismatch at line', line, 'closing', tagName, 'expected', top.tagName, 'opened at', top.line);
            process.exit(0);
          }
        }
      }
      inTag = false;
      tagText = '';
      tagStart = -1;
      isClosing = false;
    } else if (ch === "'" && !inDouble && !inBacktick) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle && !inBacktick) {
      inDouble = !inDouble;
    } else if (ch === '`' && !inSingle && !inDouble) {
      inBacktick = !inBacktick;
    } else if (ch === '{' && !inSingle && !inDouble && !inBacktick) {
      inBrace++;
    } else if (ch === '}' && !inSingle && !inDouble && !inBacktick && inBrace > 0) {
      inBrace--;
    }
  }
}
console.log('remaining stack length', stack.length);
stack.slice(-20).forEach(item => console.log('open', item.tagName, 'line', item.line, 'text', item.text));
