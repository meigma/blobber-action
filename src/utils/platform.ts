import * as os from 'node:os'

export interface PlatformInfo {
  os: string
  arch: string
  extension: string
}

/**
 * Get platform information for the current runner.
 * Maps Node.js platform/arch to Blobber binary naming conventions.
 */
export function getPlatformInfo(): PlatformInfo {
  const platform = os.platform()
  const architecture = os.arch()

  let mappedOs: string
  let extension: string

  switch (platform) {
    case 'linux':
      mappedOs = 'linux'
      extension = 'tar.gz'
      break
    case 'darwin':
      mappedOs = 'darwin'
      extension = 'tar.gz'
      break
    case 'win32':
      mappedOs = 'windows'
      extension = 'zip'
      break
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }

  let mappedArch: string
  switch (architecture) {
    case 'x64':
      mappedArch = 'amd64'
      break
    case 'arm64':
      mappedArch = 'arm64'
      break
    default:
      throw new Error(`Unsupported architecture: ${architecture}`)
  }

  // Windows ARM64 is not supported by Blobber
  if (mappedOs === 'windows' && mappedArch === 'arm64') {
    throw new Error('Windows ARM64 is not supported')
  }

  return { os: mappedOs, arch: mappedArch, extension }
}
