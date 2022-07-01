import { hlinkHomeDir, log } from '@hlink/core'
import path from 'node:path'
import fs from 'fs-extra'
import startup from 'user-startup'
import __dirname from './kit/__dirname.js'

const file = path.join(hlinkHomeDir, 'startup')
const serverFile = path.join(__dirname(import.meta.url), 'index.js')
const logFile = path.join(hlinkHomeDir, 'serve.log')

const startApp = () => {
  const port = process.env.PORT || 9090
  const startupFile = startup.getFile('hlink')
  startup.create('hlink', process.execPath, [serverFile], logFile)
  fs.ensureDirSync(hlinkHomeDir)
  fs.writeFileSync(file, startupFile)
  log.success('hlink serve started', `http://localhost:${port}`)
}

const stopApp = () => {
  startup.remove('hlink')
  log.info('hlink serve stopped')
}

const server = {
  start: startApp,
  stop: stopApp,
}

export default server
