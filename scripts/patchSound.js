'use strict';

/**
 * postinstall patch — react-native-sound + New Architecture compatibility
 *
 * react-native-sound imports resolveAssetSource the old internal way:
 *   require('react-native/Libraries/Image/resolveAssetSource')
 * In React Native New Architecture (Fabric / TurboModules) that path no
 * longer exports a bare function; it exports an object whose .default IS the
 * function.  This causes:
 *   TypeError: resolveAssetSource is not a function (it is Object)
 *
 * This script is run automatically via the `postinstall` hook so every
 * consumer of movius-chats gets the fix without any manual steps.
 */

const fs = require('fs');
const path = require('path');

// Possible locations for react-native-sound's main file.
// Note: the filename is lowercase "sound.js" in all published versions.
const candidates = [
  // 1. Nested inside movius-chats own node_modules (npm didn't hoist it)
  path.resolve(__dirname, '..', 'node_modules', 'react-native-sound', 'sound.js'),
  // 2. Hoisted to the project root node_modules (flat layout)
  path.resolve(__dirname, '..', '..', 'react-native-sound', 'sound.js'),
  // 3. One level up further (yarn workspaces / pnpm monorepo)
  path.resolve(__dirname, '..', '..', '..', 'react-native-sound', 'sound.js'),
  // 4. Some older publish had an uppercase S — kept as a fallback
  path.resolve(__dirname, '..', 'node_modules', 'react-native-sound', 'Sound.js'),
  path.resolve(__dirname, '..', '..', 'react-native-sound', 'Sound.js'),
];

const OLD_IMPORT =
  'var resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource");';

// Some versions use single quotes
const OLD_IMPORT_SQ =
  "var resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');";

const NEW_IMPORT = [
  "var _ras = require('react-native/Libraries/Image/resolveAssetSource');",
  '// movius-chats patch: support New Architecture (resolveAssetSource moved to Image)',
  "var resolveAssetSource = typeof _ras === 'function'",
  '  ? _ras',
  "  : (_ras && typeof _ras.default === 'function'",
  '      ? _ras.default',
  "      : require('react-native').Image.resolveAssetSource.bind(require('react-native').Image));",
].join('\n');

const PATCH_MARKER = '// movius-chats patch:';

let attempted = false;

for (const soundPath of candidates) {
  if (!fs.existsSync(soundPath)) continue;

  attempted = true;
  let src = fs.readFileSync(soundPath, 'utf8');

  if (src.includes(PATCH_MARKER)) {
    console.log('[movius-chats] react-native-sound already patched — skipping.');
    break;
  }

  const hasDQ = src.includes(OLD_IMPORT);
  const hasSQ = src.includes(OLD_IMPORT_SQ);

  if (!hasDQ && !hasSQ) {
    console.warn(
      '[movius-chats] react-native-sound found at ' + soundPath + ' but the\n' +
      '  resolveAssetSource import line was not recognised (different version?).\n' +
      '  If you see "resolveAssetSource is not a function" errors, apply the\n' +
      '  patch manually — see the movius-chats README Troubleshooting section.'
    );
    break;
  }

  if (hasDQ) src = src.replace(OLD_IMPORT, NEW_IMPORT);
  if (hasSQ) src = src.replace(OLD_IMPORT_SQ, NEW_IMPORT);

  fs.writeFileSync(soundPath, src, 'utf8');
  console.log('[movius-chats] ✅ react-native-sound patched at ' + soundPath);
  break;
}

// Silently do nothing if react-native-sound isn't installed yet
// (e.g. during the movius-chats dev build itself).
if (!attempted) {
  // No-op — react-native-sound may be installed later as a peer dependency.
}
