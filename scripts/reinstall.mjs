import { execSync } from 'child_process'

try {
  console.log('Running npm install to regenerate package-lock.json...')
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: process.cwd() })
  console.log('Done! package-lock.json regenerated.')
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
