import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * Pull files from an OCI registry to a directory.
 */
export async function runPull(): Promise<void> {
  const reference = core.getInput('reference', { required: true })
  const directory = core.getInput('directory', { required: true })
  const overwrite = core.getBooleanInput('overwrite')

  const args = ['pull', reference, directory]
  if (overwrite) {
    args.push('--overwrite')
  }

  core.info(`Pulling ${reference} to ${directory}...`)

  const { exitCode, stderr } = await exec.getExecOutput('blobber', args, {
    ignoreReturnCode: true
  })

  if (exitCode !== 0) {
    throw new Error(`blobber pull failed: ${stderr || 'Unknown error'}`)
  }

  // Get file count by running list
  const { stdout: listOutput } = await exec.getExecOutput(
    'blobber',
    ['list', reference],
    {
      silent: true,
      ignoreReturnCode: true
    }
  )

  const fileCount = listOutput
    .trim()
    .split('\n')
    .filter(line => line.length > 0).length

  core.setOutput('file-count', fileCount.toString())
  core.info(`Successfully pulled ${fileCount} files to ${directory}`)
}
