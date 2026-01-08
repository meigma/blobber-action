import * as core from '@actions/core'

import { runCat } from './commands/cat.js'
import { runList } from './commands/list.js'
import { runPull } from './commands/pull.js'
import { runPush } from './commands/push.js'
import { installBlobber } from './installer.js'

type Mode = 'install' | 'push' | 'pull' | 'list' | 'cat'

/**
 * Main entry point for the Blobber GitHub Action.
 */
export async function run(): Promise<void> {
  try {
    const mode = (core.getInput('mode') || 'install') as Mode
    const version = core.getInput('version') || 'latest'

    // Always install/cache the CLI first
    const { installedVersion, cacheHit } = await installBlobber(version)
    core.setOutput('version', installedVersion)
    core.setOutput('cache-hit', cacheHit.toString())

    // Execute the requested operation
    switch (mode) {
      case 'install':
        core.info(`Blobber ${installedVersion} installed successfully`)
        break
      case 'push':
        await runPush()
        break
      case 'pull':
        await runPull()
        break
      case 'list':
        await runList()
        break
      case 'cat':
        await runCat()
        break
      default:
        throw new Error(`Unknown mode: ${mode as string}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unexpected error occurred')
    }
  }
}
