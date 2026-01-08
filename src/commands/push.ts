import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * Push a directory to an OCI registry.
 */
export async function runPush(): Promise<void> {
  const directory = core.getInput('directory', { required: true })
  const reference = core.getInput('reference', { required: true })
  const compression = core.getInput('compression') || 'gzip'

  // Validate compression option
  if (!['gzip', 'zstd'].includes(compression)) {
    throw new Error(
      `Invalid compression: ${compression}. Must be 'gzip' or 'zstd'`
    )
  }

  const args = ['push', directory, reference, '--compression', compression]

  core.info(`Pushing ${directory} to ${reference} with ${compression}...`)

  const { exitCode, stdout, stderr } = await exec.getExecOutput(
    'blobber',
    args,
    {
      ignoreReturnCode: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(`blobber push failed: ${stderr || 'Unknown error'}`)
  }

  // blobber push outputs just the digest on stdout (e.g., "sha256:abc123...")
  // Verified from blobber/cmd/blobber/cli/push.go:71 - fmt.Println(digest)
  const digest = stdout.trim()

  if (digest) {
    core.setOutput('digest', digest)
    core.info(`Successfully pushed with digest: ${digest}`)
  } else {
    core.warning('Could not parse digest from blobber output')
  }
}
