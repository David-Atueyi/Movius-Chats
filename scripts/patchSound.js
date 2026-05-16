

'use strict';

const fs = require('fs');
const path = require('path');

const candidates = [
  // standard flat node_modules layout
  path.resolve(__dirname, '..', '..', 'react-native-sound', 'Sound.js'),
  // hoisted monorepo layout (yarn workspaces / pnpm)
  path.resolve(__dirname, '..', '..', '..', 'react-native-sound', 'Sound.js'),
];

const OLD_IMPORT =
  "var resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');";

const NEW_IMPORT = [
  "var _ras = require('react-native/Libraries/Image/resolveAssetSource');",
  '// movius-chats patch: support New Architecture (resolveAssetSource moved to Image)',
  "var resolveAssetSource = typeof _ras === 'function'",
  "  ? _ras",
  "  : (_ras && typeof _ras.default === 'function'",
  "      ? _ras.default",
  "      : require('react-native').Image.resolveAssetSource.bind(require('react-native').Image));",
].join('\n');

const PATCH_MARKER = '// movius-chats patch:';

let patched = false;

for (const soundPath of candidates) {
  if (!fs.existsSync(soundPath)) continue;

  let src = fs.readFileSync(soundPath, 'utf8');

  if (src.includes(PATCH_MARKER)) {
    console.log('[movius-chats] react-native-sound already patched — skipping.');
    patched = true;
    break;
  }

  if (!src.includes(OLD_IMPORT)) {
    // Different version of react-native-sound; the import line changed.
    console.warn(
      '[movius-chats] Could not locate the resolveAssetSource import in ' +
        soundPath +
        '.\n' +
        'If you see a "resolveAssetSource is not a function" error, apply the\n' +
        'patch manually — see the movius-chats README Troubleshooting section.'
    );
    patched = true; // don't repeat the warning for every candidate
    break;
  }

  src = src.replace(OLD_IMPORT, NEW_IMPORT);
  fs.writeFileSync(soundPath, src, 'utf8');
  console.log('[movius-chats] ✅ react-native-sound patched for New Architecture compatibility.');
  patched = true;
  break;
}

if (!patched) {
  // react-native-sound is not installed yet (peer dep, optional dep, etc.)
  // Silently skip — the patch will run again if the user installs it later.
}
