# sync-repo-tui

GitHub リポジトリ同期ツールの TUI 版。

Secrets、Workflows、Agents をインタラクティブな TUI で同期できます。

## 機能

- **矢印キー**で選択可能なシンプルなインターフェース
- 同期モードの選択（単一リポジトリ / 組織内全リポジトリ）
- 同期項目の ON/OFF 切り替え
- .env ファイルの自動チェック

## 使い方

```bash
# プロジェクトルートから実行
./scripts/sync-repo-tui.sh

# または直接バイナリを実行
./scripts/sync-repo-tui/target/release/sync-repo-tui
```

## キーバインド

| キー | 動作 |
|------|------|
| ↑ / ↓ | 選択 |
| Enter | 決定 / 続行 |
| Space | ON/OFF 切り替え |
| q | 終了 / 戻る |
| Y / N | Yes / No |

## 開発

```bash
cd scripts/sync-repo-tui

# ビルド
cargo build --release

# 実行
cargo run
```

## 依存関係

- Rust 1.92.0+
- ratatui 0.29
- crossterm 0.28
- dotenvy 0.15
