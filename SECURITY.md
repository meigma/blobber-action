# Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please report it through GitHub's private vulnerability reporting:

1. Go to the [Security tab](../../security) of this repository
2. Click "Report a vulnerability"
3. Provide a detailed description

**Please do not report security vulnerabilities through public issues or pull requests.**

Include:
- Type of issue
- Steps to reproduce
- Impact assessment

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Scope

This action is a wrapper around the [Blobber CLI](https://github.com/meigma/blobber). Security issues may fall into different categories:

- **Action-specific issues** (input handling, credential exposure in logs, etc.) - Report here
- **Blobber CLI issues** (registry interaction, file handling, etc.) - Report to [meigma/blobber](https://github.com/meigma/blobber/security)

## Response Timeline

- **Initial Response**: Within 3 business days
- **Status Update**: Within 10 business days
- **Resolution**: Critical issues within 30 days
