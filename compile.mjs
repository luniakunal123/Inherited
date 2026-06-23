import { createRequire } from 'module'
import { readFileSync, writeFileSync } from 'fs'

const require = createRequire(import.meta.url)
const inkjs = require('inkjs')

console.log('inkjs exports:', Object.keys(inkjs))