import { jest, describe, it, expect, beforeEach } from '@jest/globals'

// Mock os module before importing platform
const mockPlatform = jest.fn<() => NodeJS.Platform>()
const mockArch = jest.fn<() => NodeJS.Architecture>()

jest.unstable_mockModule('node:os', () => ({
  platform: mockPlatform,
  arch: mockArch
}))

// Import after mocking
const { getPlatformInfo } = await import('../src/utils/platform.js')

describe('getPlatformInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should map linux/x64 correctly', () => {
    mockPlatform.mockReturnValue('linux')
    mockArch.mockReturnValue('x64')

    expect(getPlatformInfo()).toEqual({
      os: 'linux',
      arch: 'amd64',
      extension: 'tar.gz'
    })
  })

  it('should map linux/arm64 correctly', () => {
    mockPlatform.mockReturnValue('linux')
    mockArch.mockReturnValue('arm64')

    expect(getPlatformInfo()).toEqual({
      os: 'linux',
      arch: 'arm64',
      extension: 'tar.gz'
    })
  })

  it('should map darwin/x64 correctly', () => {
    mockPlatform.mockReturnValue('darwin')
    mockArch.mockReturnValue('x64')

    expect(getPlatformInfo()).toEqual({
      os: 'darwin',
      arch: 'amd64',
      extension: 'tar.gz'
    })
  })

  it('should map darwin/arm64 correctly', () => {
    mockPlatform.mockReturnValue('darwin')
    mockArch.mockReturnValue('arm64')

    expect(getPlatformInfo()).toEqual({
      os: 'darwin',
      arch: 'arm64',
      extension: 'tar.gz'
    })
  })

  it('should map win32/x64 correctly', () => {
    mockPlatform.mockReturnValue('win32')
    mockArch.mockReturnValue('x64')

    expect(getPlatformInfo()).toEqual({
      os: 'windows',
      arch: 'amd64',
      extension: 'zip'
    })
  })

  it('should throw for unsupported platform', () => {
    mockPlatform.mockReturnValue('freebsd' as NodeJS.Platform)
    mockArch.mockReturnValue('x64')

    expect(() => getPlatformInfo()).toThrow('Unsupported platform: freebsd')
  })

  it('should throw for unsupported architecture', () => {
    mockPlatform.mockReturnValue('linux')
    mockArch.mockReturnValue('ia32')

    expect(() => getPlatformInfo()).toThrow('Unsupported architecture: ia32')
  })

  it('should throw for Windows ARM64', () => {
    mockPlatform.mockReturnValue('win32')
    mockArch.mockReturnValue('arm64')

    expect(() => getPlatformInfo()).toThrow('Windows ARM64 is not supported')
  })
})
