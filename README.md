# claude-glm-actions-lab

<p align="center">
  <img src="./assets/header.svg" alt="claude-glm-actions-lab header" width="100%"/>
</p>

<p align="center">
  <a href="https://github.com/Sunwood-ai-labs/claude-glm-actions-lab/stargazers">
    <img src="https://img.shields.io/github/stars/Sunwood-ai-labs/claude-glm-actions-lab?style=flat-square" alt="Stars"/>
  </a>
  <a href="https://github.com/Sunwood-ai-labs/claude-glm-actions-lab/network/members">
    <img src="https://img.shields.io/github/forks/Sunwood-ai-labs/claude-glm-actions-lab?style=flat-square" alt="Forks"/>
  </a>
  <a href="https://github.com/Sunwood-ai-labs/claude-glm-actions-lab/issues">
    <img src="https://img.shields.io/github/issues/Sunwood-ai-labs/claude-glm-actions-lab?style=flat-square" alt="Issues"/>
  </a>
  <a href="https://github.com/Sunwood-ai-labs/claude-glm-actions-lab/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Sunwood-ai-labs/claude-glm-actions-lab?style=flat-square" alt="License"/>
  </a>
</p>

## Overview

Claude Code GitHub Actions with GLM API integration laboratory. This repository contains workflows and configurations for using Claude Code with GLM (General Language Model) API in GitHub Actions.

## Features

- GitHub Actions workflow for Claude Code with GLM API
- Support for issue comments and pull request reviews
- Configurable API endpoints and models
- Bot self-trigger prevention

## Usage

### Requirements

- GitHub repository
- GLM API key (set as `ZAI_API_KEY` in repository secrets)
- Optional: Configure `ANTHROPIC_BASE_URL` variable (default: `https://api.z.ai/api/anthropic`)

### Setup

1. Copy the workflow file to your repository:
   ```bash
   cp .github/workflows/CLAUDE_GLM_DEV.yml <your-repo>/.github/workflows/
   ```

2. Configure secrets in your repository settings:
   - `ZAI_API_KEY`: Your GLM API key

3. Optional: Configure variables:
   - `ANTHROPIC_BASE_URL`: API base URL
   - `API_TIMEOUT_MS`: Request timeout in milliseconds (default: 3000000)
   - `ANTHROPIC_DEFAULT_OPUS_MODEL`: Default Opus model (default: glm-4.7)
   - `ANTHROPIC_DEFAULT_SONNET_MODEL`: Default Sonnet model (default: glm-4.7)
   - `ANTHROPIC_DEFAULT_HAIKU_MODEL`: Default Haiku model (default: glm-4.5-air)

## Workflow Triggers

The workflow is triggered on:
- Issue comments
- Pull request review comments

## ヘッダー画像生成

### リモートから直接実行（推奨）

```bash
# curlで直接実行
curl -s https://raw.githubusercontent.com/Sunwood-AI-OSS-Hub/claude-glm-actions-lab-sandbox/main/.github/scripts/generate-header.py | python3 - --tag v1.0.0

# wgetの場合
wget -qO- https://raw.githubusercontent.com/Sunwood-AI-OSS-Hub/claude-glm-actions-lab-sandbox/main/.github/scripts/generate-header.py | python3 - --tag v1.0.0
```

### ローカルで実行

```bash
# リポジトリをクローンして実行
git clone https://github.com/Sunwood-AI-OSS-Hub/claude-glm-actions-lab-sandbox.git
cd claude-glm-actions-lab-sandbox
python3 .github/scripts/generate-header.py --tag v1.0.0
```

### オプション

| オプション | 説明 | デフォルト値 |
|-----------|-------------|-------------|
| `--tag` | リリースタグ (例: v1.0.0, v2.1.3) | `v1.0.0` |
| `--theme` | テーマ (feature/bugfix/major/patch/first/auto) | `auto` |
| `--output` | 出力ファイルパス | `header.png` |
| `--aspect-ratio` | アスペクト比 (16:9/4:3/1:1/21:9) | `16:9` |

### テーマの自動検出

`--theme auto`（デフォルト）の場合、タグからテーマを自動検出します：

- **first**: v0.1.0, v1.0.0（初回リリース）
- **major**: v2.0.0, v3.0.0（メジャーリリース）
- **feature**: v1.1.0, v1.2.0（マイナーリリース）
- **patch**: v1.1.1, v1.1.2（パッチリリース）

### 必要な環境変数

```bash
export FAL_KEY='your-fal-ai-api-key'
```

### GitHub Actionsでの環境変数設定

| 環境変数 | 説明 | デフォルト値 |
|----------|-------------|-------------|
| `USE_LOCAL_SCRIPT` | ローカルスクリプトを使うか | `false`（リモート使用） |

#### ローカルスクリプトを使う場合

GitHubリポジトリの **Settings > Variables and secrets > Actions** で：

1. **Variables > New repository variable**
2. Name: `USE_LOCAL_SCRIPT`
3. Value: `true`

##### 設定値の動作

- 設定なしまたは `false` → リモートスクリプトを実行（デフォルト）
- `true` → ローカルスクリプトを実行

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Test

This is a test PR to verify the auto review comment feature.

_Made with ❤️ by [Sunwood AI Labs](https://github.com/Sunwood-ai-labs)_




