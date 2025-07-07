import * as core from '@actions/core'
import {exec} from '../utils/cache'

async function run(): Promise<void> {
  try {
    const cacheHit = core.getState('cache-hit')
    const key = core.getState('key')

    if (cacheHit === 'false') {
      const cachePath = core.getState('cache-path')
      const path = core.getState('path')

      // Check if cachePath already exists
      const pathExists = await exec(`test -d ${cachePath}`)
      if (pathExists.stderr) {
        // Directory doesn't exist, create it
        core.info(`Creating cache directory: ${cachePath}`)
        await exec(`mkdir -p ${cachePath}`)
        const mv = await exec(`mv ./${path} ${cachePath}`)
        core.debug(mv.stdout)
        if (mv.stderr) core.error(mv.stderr)
        if (!mv.stderr) core.info(`Cache saved with key ${key}`)  
      } else {
        core.info(`Cache directory already exists: ${cachePath}`)
      }
    } else {
      core.info(`Cache hit on the key ${key}`)
      core.info(`,not saving cache`)
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()