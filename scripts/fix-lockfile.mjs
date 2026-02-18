import { execSync } from 'child_process';

try {
  console.log('Regenerating pnpm-lock.yaml...');
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit', cwd: '/vercel/share/v0-project' });
  console.log('Done! Lock file regenerated successfully.');
} catch (error) {
  console.error('Error regenerating lock file:', error.message);
  process.exit(1);
}
