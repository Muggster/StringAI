import { initializeApp, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

function findServiceAccountKey(): string {
  // Check the conventional name first
  const conventional = resolve(projectRoot, 'serviceAccountKey.json')
  try { readFileSync(conventional); return conventional } catch { /* not found */ }

  // Fall back to any *firebase-adminsdk*.json in the project root
  const files = readdirSync(projectRoot)
  const match = files.find((f) => f.includes('firebase-adminsdk') && f.endsWith('.json'))
  if (match) return resolve(projectRoot, match)

  console.error(
    '❌  Service account key not found.\n' +
    '   Download it from Firebase Console → Project Settings → Service Accounts.\n' +
    '   Place it at the project root (any filename ending in .json containing "firebase-adminsdk").',
  )
  process.exit(1)
}

let initialized = false

export function initAdmin() {
  if (initialized) return getFirestore(getApp())
  const serviceAccountPath = findServiceAccountKey()
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
  initializeApp({ credential: cert(serviceAccount) })
  initialized = true
  return getFirestore()
}
