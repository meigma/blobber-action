# Blobber Action

A GitHub Action for [Blobber](https://github.com/meigma/blobber), a CLI tool that pushes and pulls files to OCI container registries using the eStargz format.

## Features

- Cached installation of Blobber CLI via GitHub's tool cache
- Push directories to OCI registries
- Pull files from OCI registries
- List files in a blob without downloading
- Stream individual files via cat

## Usage

### Install Blobber CLI

```yaml
- uses: meigma/blobber-action@v1
```

### Push Files

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- uses: meigma/blobber-action@v1
  id: push
  with:
    mode: push
    directory: ./dist
    reference: ghcr.io/${{ github.repository }}/artifacts:${{ github.sha }}

- run: echo "Pushed with digest ${{ steps.push.outputs.digest }}"
```

### Pull Files

```yaml
- uses: meigma/blobber-action@v1
  with:
    mode: pull
    reference: ghcr.io/${{ github.repository }}/artifacts:v1.0.0
    directory: ./downloaded
    overwrite: true
```

### List Files

```yaml
- uses: meigma/blobber-action@v1
  id: list
  with:
    mode: list
    reference: ghcr.io/${{ github.repository }}/artifacts:latest
    long-format: true

- run: echo '${{ steps.list.outputs.files }}' | jq '.[].path'
```

### Stream Single File

```yaml
- uses: meigma/blobber-action@v1
  with:
    mode: cat
    reference: ghcr.io/${{ github.repository }}/config:v1
    file-path: config.yaml
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `mode` | Operation mode: `install`, `push`, `pull`, `list`, or `cat` | `install` |
| `version` | Blobber CLI version (e.g., `1.0.0` or `latest`) | `latest` |
| `reference` | OCI reference (e.g., `ghcr.io/owner/repo:tag`) | - |
| `directory` | Directory to push from or pull to | - |
| `compression` | Compression for push: `gzip` or `zstd` | `gzip` |
| `overwrite` | Overwrite existing files during pull | `false` |
| `long-format` | Show size and mode in list output | `false` |
| `file-path` | Path within blob to stream (cat mode) | - |

## Outputs

| Output | Description |
|--------|-------------|
| `digest` | Digest of pushed blob (push mode) |
| `files` | JSON array of files (list mode) |
| `file-count` | Number of files (list/pull modes) |
| `version` | Installed Blobber CLI version |
| `cache-hit` | Whether CLI was restored from cache |

## Authentication

This action uses Docker credentials for registry authentication. Use [docker/login-action](https://github.com/docker/login-action) to authenticate before push/pull operations:

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

## Supported Platforms

| OS | Architecture |
|----|--------------|
| Linux | x64, arm64 |
| macOS | x64, arm64 |
| Windows | x64 |

## License

MIT License
