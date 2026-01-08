import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * Stream a single file from an OCI blob to stdout.
 */
export async function runCat(): Promise<void> {
  const reference = core.getInput('reference', { required: true })
  const filePath = core.getInput('file-path', { required: true })

  const args = ['cat', reference, filePath]

  core.info(`Streaming ${filePath} from ${reference}...`)

  const { exitCode, stderr } = await exec.getExecOutput('blobber', args, {
    ignoreReturnCode: true
  })

  if (exitCode !== 0) {
    throw new Error(`blobber cat failed: ${stderr || 'Unknown error'}`)
  }
}
