<div align="center">

# hello_app

<!-- 言語切り替えバッジ -->
<a href="README.md"><img src="https://img.shields.io/badge/Documentation-English-white.svg" alt="EN doc"/></a>
<a href="README_JA.md"><img src="https://img.shields.io/badge/ドキュメント-日本語-white.svg" alt="JA doc"/></a>

</div>

## 概要

`hello_app` はシンプルなPythonパッケージです。実行すると「Hello」という挨拶を標準出力に表示します。このパッケージはPythonモジュールとしての実行方法を示すシンプルなサンプルとして作成されました。

## 機能

- コマンドラインから `python -m hello_app` で実行可能
- 「Hello」というメッセージを標準出力に表示
- シンプルで理解しやすいコード構造
- unittestを使用したテストスイート付き

## インストール

このパッケージはPythonの標準ライブラリのみを使用しており、追加の依存関係はありません。

Python 3.6以上がインストールされている環境であれば、すぐに使用できます。

```bash
# リポジトリをクローン
git clone <repository-url>
cd claude-glm-actions-lab-sandbox
```

## 使用方法

### 基本的な実行

Pythonの `-m` オプションを使用してモジュールとして実行します：

```bash
python -m hello_app
```

出力：
```
Hello
```

### Pythonコードから使用する

```python
from hello_app import main

# main関数を呼び出し
main()
```

## テスト

パッケージにはunittestを使用したテストスイートが含まれています。

### すべてのテストを実行

```bash
# プロジェクトルートから実行
python -m unittest discover tests
```

### 特定のテストファイルを実行

```bash
python -m unittest tests.test_hello_app
```

### テストの詳細

`tests/test_hello_app.py` には以下のテストケースが含まれています：

- `test_hello_app_outputs_hello` - 「Hello」が出力されることを確認
- `test_hello_app_no_stderr` - 標準エラー出力に何も出力されないことを確認

## ファイル構造

```
hello_app/
├── __init__.py      # パッケージ初期化、バージョン情報 (v0.1.0)
└── __main__.py      # メインモジュール

tests/
├── __init__.py      # テストパッケージ初期化
└── test_hello_app.py  # unittestテスト
```

## ライセンス

MIT License

Copyright (c) 2025 Sunwood AI Labs

## バージョン

現在のバージョン: **0.1.0**
