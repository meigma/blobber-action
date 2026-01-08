import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

import { getPlatformInfo } from './utils/platform.js'
import { resolveVersion } from './utils/version.js'

const TOOL_NAME = 'blobber'
const RELEASES_URL = 'https://github.com/meigma/blobber/releases/download'

export interface InstallResult {
  installedVersion: string
  cacheHit: boolean
}

/**
 * Install Blobber CLI, using cache when available.
 */
export async function installBlobber(
  requestedVersion: string
): Promise<InstallResult> {
  const version = await resolveVersion(requestedVersion)
  const { os, arch, extension } = getPlatformInfo()

  core.info(`Installing Blobber ${version} for ${os}/${arch}...`)

  // Check tool cache first
  let cachedPath = tc.find(TOOL_NAME, version, arch)

  if (cachedPath) {
    core.info(`Found cached Blobber ${version}`)
    core.addPath(cachedPath)
    return { installedVersion: version, cacheHit: true }
  }

  core.info(`Downloading Blobber ${version}...`)

  // Construct download URL
  // Format: blobber_<version>_<os>_<arch>.<ext>
  const filename = `blobber_${version}_${os}_${arch}.${extension}`
  const downloadUrl = `${RELEASES_URL}/v${version}/${filename}`

  core.debug(`Download URL: ${downloadUrl}`)

  // Download the archive
  const downloadPath = await tc.downloadTool(downloadUrl)

  // Extract based on platform
  let extractedPath: string
  if (extension === 'zip') {
    extractedPath = await tc.extractZip(downloadPath)
  } else {
    extractedPath = await tc.extractTar(downloadPath)
  }

  // Cache the extracted tool
  cachedPath = await tc.cacheDir(extractedPath, TOOL_NAME, version, arch)
  core.addPath(cachedPath)

  // Verify installation
  await verifyInstallation()

  core.info(`Successfully installed Blobber ${version}`)
  return { installedVersion: version, cacheHit: false }
}

async function verifyInstallation(): Promise<void> {
  const { exitCode } = await exec.getExecOutput('blobber', ['version'], {
    silent: true,
    ignoreReturnCode: true
  })

  if (exitCode !== 0) {
    throw new Error('Failed to verify Blobber installation')
  }
}
