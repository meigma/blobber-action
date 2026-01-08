import * as core from '@actions/core'
import * as httpm from '@actions/http-client'

const GITHUB_API = 'https://api.github.com/repos/meigma/blobber/releases'

interface GitHubRelease {
  tag_name: string
}

/**
 * Resolve the requested version to an actual version string.
 * Handles 'latest' by fetching from GitHub API.
 */
export async function resolveVersion(requested: string): Promise<string> {
  if (requested === 'latest') {
    return getLatestVersion()
  }

  // Strip 'v' prefix if present
  return requested.replace(/^v/, '')
}

async function getLatestVersion(): Promise<string> {
  const client = new httpm.HttpClient('blobber-action', [], {
    allowRetries: true,
    maxRetries: 3
  })

  try {
    const response = await client.getJson<GitHubRelease>(`${GITHUB_API}/latest`)

    if (response.result?.tag_name) {
      const version = response.result.tag_name.replace(/^v/, '')
      core.debug(`Resolved latest version: ${version}`)
      return version
    }
  } catch (error) {
    core.warning(
      `Failed to fetch latest version: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  // Fallback version if API fails
  const fallback = '0.1.0'
  core.warning(`Using fallback version: ${fallback}`)
  return fallback
}
