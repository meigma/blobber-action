import * as core from '@actions/core'
import * as exec from '@actions/exec'

interface FileEntry {
  path: string
  size?: number
  mode?: string
}

/**
 * List files in an OCI blob without downloading.
 */
export async function runList(): Promise<void> {
  const reference = core.getInput('reference', { required: true })
  const longFormat = core.getBooleanInput('long-format')

  const args = ['list', reference]
  if (longFormat) {
    args.push('--long')
  }

  core.info(`Listing files in ${reference}...`)

  const { exitCode, stdout, stderr } = await exec.getExecOutput(
    'blobber',
    args,
    {
      ignoreReturnCode: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(`blobber list failed: ${stderr || 'Unknown error'}`)
  }

  const lines = stdout
    .trim()
    .split('\n')
    .filter(line => line.length > 0)

  // Parse output - short format: just paths, long format: "path  size  mode"
  const files: FileEntry[] = lines.map(line => {
    if (longFormat) {
      // Long format: path, size (bytes), mode (octal) separated by whitespace
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 3) {
        return {
          path: parts[0],
          size: parseInt(parts[1], 10),
          mode: parts[2]
        }
      }
    }
    return { path: line.trim() }
  })

  core.setOutput('files', JSON.stringify(files))
  core.setOutput('file-count', files.length.toString())

  core.info(`Found ${files.length} files`)

  // Log file list in a collapsible group
  core.startGroup('File listing')
  for (const file of files) {
    if (longFormat && file.size !== undefined) {
      core.info(`${file.path} (${file.size} bytes, ${file.mode})`)
    } else {
      core.info(file.path)
    }
  }
  core.endGroup()
}
