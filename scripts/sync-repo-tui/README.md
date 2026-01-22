# sync-repo-tui 🚀

[![Release](https://img.shields.io/github/v/release/Sunwood-ai-labs/claude-glm-actions-lab-sandbox)](https://github.com/Sunwood-ai-labs/claude-glm-actions-lab-sandbox/releases)
[![License](https://img.shields.io/github/license/Sunwood-ai-labs/claude-glm-actions-lab-sandbox)](LICENSE)

GitHub リポジトリ同期ツールの TUI 版。カラフルで使いやすいターミナル UI で、Secrets、Workflows、Agents を同期できます。

## ✨ 特徴

- 🎨 **カラフルな TUI** - 見やすく美しいインターフェース
- 📂 **リポジトリ選択** - 自分のリポジトリ一覧から選択可能（最新順）
- ⌨️ **手動入力** - `i` キーでリポジトリを直接入力
- 🔄 **同期項目の ON/OFF** - Secrets、Workflows、Agents を個別に選択
- ⚠️ **スマートなチェック** - .env の有無に応じて警告を表示
- ⚡ **高速** - Rust 製で軽量・高速

## 📸 スクリーンショット

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║   GitHub リポジトリ同期ツール (TUI)                                        ║
║   Sync Secrets, Workflows, and Agents                                     ║
║                                                                            ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 📦 インストール

### ワンライナーでインストール（推奨）

```bash
curl -fsSL https://raw.githubusercontent.com/Sunwood-ai-labs/claude-glm-actions-lab-sandbox/main/scripts/install-sync-repo-tui.sh | bash
```

### GitHub Releases からダウンロード

```bash
# Linux (x86_64)
curl -L -o sync-repo-tui https://github.com/Sunwood-ai-labs/claude-glm-actions-lab-sandbox/releases/latest/download/sync-repo-tui-linux-amd64
chmod +x sync-repo-tui
./sync-repo-tui
```

### Cargo でビルド

```bash
cargo install --git https://github.com/Sunwood-ai-labs/claude-glm-actions-lab-sandbox.git
```

### ソースからビルド

```bash
git clone https://github.com/Sunwood-ai-labs/claude-glm-actions-lab-sandbox.git
cd claude-glm-actions-lab-sandbox/scripts/sync-repo-tui
cargo build --release
./target/release/sync-repo-tui
```

## 🎮 使い方

### 基本的な操作

```bash
./sync-repo-tui
```

### キーバインド

| キー | 動作 |
|------|------|
| ↑ / ↓ | 選択 |
| Enter | 決定 / 続行 |
| Space | ON/OFF 切り替え |
| i | 手動入力モード（リポジトリ選択時） |
| q | 終了 / 戻る |
| Esc | 戻る / 入力キャンセル |
| Y / N | Yes / No |

### 同期の流れ

1. **同期モードを選択**
   - 単一リポジトリ
   - 組織内の全リポジトリ

2. **リポジトリを選択**（単一リポジトリモード時）
   - リストから選択
   - または `i` で手動入力

3. **同期項目を選択**
   - Secrets（.env が必要）
   - Workflows
   - Agents

4. **確認して実行**

## 🔧 開発

```bash
# クローン
git clone https://github.com/Sunwood-ai-labs/claude-glm-actions-lab-sandbox.git
cd claude-glm-actions-lab-sandbox/scripts/sync-repo-tui

# ビルド
cargo build --release

# 実行
./target/release/sync-repo-tui

# 開発モードで実行
cargo run
```

## 📝 依存関係

- Rust 1.92.0+
- [ratatui](https://github.com/ratatui-org/ratatui) 0.29 - TUI フレームワーク
- [crossterm](https://github.com/crossterm-rs/crossterm) 0.28 - ターミナル操作
- [serde_json](https://github.com/serde-rs/json) 1.0 - JSON パース
- [gh](https://cli.github.com/) - GitHub CLI（リポジトリ一覧取得に使用）

## 📄 ライセンス

MIT License

## 🤝 貢献

Contributions are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 作者

[@Sunwood-AI-OSS-Hub](https://github.com/Sunwood-AI-OSS-Hub)

---

Made with ❤️ by [Agent ZERO](https://github.com/Sunwood-AI-OSS-Hub/agent-zero)
