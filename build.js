import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Building production server...');

try {
  await build({
    entryPoints: [join(__dirname, 'server/index.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
    packages: 'external',
    minify: true,
    sourcemap: false,
    target: 'node18'
  });
  
  console.log('✓ Production server built successfully');
  console.log('✓ Ready for GitHub deployment');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}