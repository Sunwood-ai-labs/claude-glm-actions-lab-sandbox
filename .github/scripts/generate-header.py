#!/usr/bin/env python3
"""
ヘッダー画像生成スクリプト 🐱✨
fal.aiのnano-banana-proを使って猫っぽいヘッダー画像を生成するニャ！

Usage:
    python generate-header.py --tag v1.0.0 --theme feature --output header.png
    python generate-header.py --tag v2.0.0 --theme major --aspect-ratio 16:9
"""

import argparse
import os
import sys
from pathlib import Path

# 猫っぽいメッセージ 🐱
def meow_print(message: str, level: str = "info") -> None:
    """猫っぽいメッセージを表示するニャ"""
    icons = {
        "info": "🐱",
        "success": "😺",
        "error": "😿",
        "warning": "😸",
        "debug": "🙀"
    }
    icon = icons.get(level, "🐱")
    print(f"{icon} {message}")

# テーマ別のプロンプトテンプレート 🎨
PROMPT_TEMPLATES = {
    "feature": """A futuristic, abstract background featuring a stunning gradient from deep blue to vibrant purple, reminiscent of a cosmic nebula. Floating geometric particles and digital data streams weave through the composition, creating a sense of innovation and technological advancement. The colors blend seamlessly, evoking the excitement of new features and capabilities being unleashed. Clean, modern, with soft lighting effects and a subtle glass-like texture overlay.""",

    "bugfix": """A serene, abstract background with a smooth gradient from calming green to refreshing blue, symbolizing stability and resolution. Delicate light particles float upward like fireflies, creating a sense of harmony and balance. Soft, ethereal lighting with a subtle wave pattern suggests gentle improvement and refinement. The composition evokes the feeling of a system restored to perfect health, with clean lines and a peaceful atmosphere.""",

    "major": """A spectacular, vibrant abstract background featuring an explosive gradient from deep purple through hot pink to warm orange, creating a sense of momentous occasion and celebration. Dynamic energy flows through the composition with swirling patterns of light and color, like a cosmic event. Golden sparkles and star-like particles dance across the canvas, suggesting something extraordinary and transformative. The image radiates excitement and importance, with rich, saturated colors that demand attention.""",

    "patch": """A clean, minimalist abstract background with an elegant gradient from silver to light blue, conveying precision and reliability. Fine geometric lines and subtle grid patterns create a sense of order and attention to detail. Soft, professional lighting with a subtle metallic texture suggests quality and refinement. The composition embodies the feeling of careful maintenance and improvement, like a finely tuned instrument being perfected.""",

    "first": """A magical, celebratory abstract background featuring a stunning rainbow gradient that flows across the entire spectrum. Ethereal particles of light shimmer and sparkle throughout, creating an atmosphere of wonder and new beginnings. The colors blend in a dreamy, cosmic swirl, suggesting infinite possibilities and the dawn of something special. Soft, glowing orbs of light float gracefully, like wishes being granted. The image radiates hope, excitement, and the joy of a first release, with a captivating otherworldly beauty."""
}

# アスペクト比の設定 📐
ASPECT_RATIOS = {
    "16:9": {"width": 1920, "height": 1080},
    "4:3": {"width": 1440, "height": 1080},
    "1:1": {"width": 1080, "height": 1080},
    "21:9": {"width": 2560, "height": 1080},
}

def get_fal_key() -> str:
    """FAL_KEY環境変数からAPIキーを取得するニャ"""
    api_key = os.environ.get("FAL_KEY")
    if not api_key:
        meow_print("FAL_KEY環境変数が設定されていないニャ... 💦", "error")
        meow_print("export FAL_KEY='your-api-key' って設定してね！", "info")
        sys.exit(1)
    return api_key

def detect_theme_from_tag(tag: str) -> str:
    """タグからテーマを自動検出するニャ"""
    tag_lower = tag.lower()

    # メジャーリリース (v2.0.0, v3.0.0 など)
    if "v0." in tag or tag.count(".") == 2 and tag.split(".")[1] == "0":
        if "v0.1.0" in tag or "v1.0.0" in tag:
            return "first"
        return "major"

    # マイナーリリース (v1.1.0, v1.2.0 など)
    if tag.count(".") == 2 and tag.split(".")[2] == "0":
        return "feature"

    # パッチリリース (v1.1.1, v1.1.2 など)
    if tag.count(".") == 2:
        return "patch"

    # デフォルトはfeature
    return "feature"

def build_prompt(tag: str, theme: str) -> str:
    """プロンプトを構築するニャ"""
    base_prompt = PROMPT_TEMPLATES.get(theme, PROMPT_TEMPLATES["feature"])

    # タグ情報を追加
    prompt = f"""{base_prompt}

In the center, subtly incorporate version text "{tag}" in a modern, minimalist style. The text should be elegant and not overpower the abstract beauty of the background. Use a clean, contemporary font with a subtle glow effect that complements the color scheme."""

    return prompt

def generate_image(prompt: str, output_path: str, aspect_ratio: str, api_key: str) -> bool:
    """fal.aiで画像を生成するニャ"""
    try:
        import fal_client
    except ImportError:
        meow_print("fal-clientがインストールされていないニャ... 💦", "error")
        meow_print("pip install fal-client でインストールしてね！", "info")
        return False

    meow_print("fal.aiに接続中... 🚀", "info")

    # アスペクト比からサイズを取得
    size = ASPECT_RATIOS.get(aspect_ratio, ASPECT_RATIOS["16:9"])
    width = size["width"]
    height = size["height"]

    meow_print(f"画像サイズ: {width}x{height} ({aspect_ratio})", "info")
    meow_print("nano-banana-proで生成中... 🎨", "info")

    # 環境変数にFAL_KEYを設定
    import os
    os.environ["FAL_KEY"] = api_key

    try:
        # fal.aiのAPIを呼び出し
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": prompt,
                "num_images": 1,
                "aspect_ratio": aspect_ratio,
                "output_format": "png",
                "resolution": "2K",
                "safety_tolerance": "4"
            },
            with_logs=True
        )

        # 結果から画像を取得
        if isinstance(result, dict) and result.get("images"):
            image_url = result["images"][0]["url"]
        elif hasattr(result, 'get'):
            images = result.get('images', [])
            if images and len(images) > 0:
                image_url = images[0].get('url') if isinstance(images[0], dict) else images[0]
            else:
                image_url = None
        else:
            image_url = getattr(result, 'image_url', None)

        if not image_url:
            meow_print("画像URLが取得できなかったニャ... 💦", "error")
            meow_print(f"結果: {result}", "debug")
            return False

        meow_print(f"画像をダウンロード中... 📥", "info")

        # 画像をダウンロード
        import urllib.request
        urllib.request.urlretrieve(image_url, output_path)

        meow_print(f"画像を保存したニャ！: {output_path} 😺", "success")
        return True

    except Exception as e:
        meow_print(f"画像生成でエラーが発生したニャ... 😿", "error")
        meow_print(f"エラー詳細: {str(e)}", "error")
        return False

def parse_args() -> argparse.Namespace:
    """コマンドライン引数をパースするニャ"""
    parser = argparse.ArgumentParser(
        description="ヘッダー画像生成スクリプト 🐱✨",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        "--tag",
        type=str,
        default="v1.0.0",
        help="リリースタグ (例: v1.0.0, v2.1.3)"
    )

    parser.add_argument(
        "--theme",
        type=str,
        choices=["feature", "bugfix", "major", "patch", "first", "auto"],
        default="auto",
        help="テーマ (autoでタグから自動検出)"
    )

    parser.add_argument(
        "--output",
        type=str,
        default="header.png",
        help="出力ファイルパス"
    )

    parser.add_argument(
        "--aspect-ratio",
        type=str,
        choices=["16:9", "4:3", "1:1", "21:9"],
        default="16:9",
        help="アスペクト比"
    )

    return parser.parse_args()

def main() -> int:
    """メイン関数ニャ"""
    meow_print("ヘッダー画像生成スクリプトを起動するニャ！ 🐱✨", "info")

    args = parse_args()

    # テーマの決定
    theme = args.theme
    if theme == "auto":
        theme = detect_theme_from_tag(args.tag)
        meow_print(f"タグ '{args.tag}' からテーマ '{theme}' を検出したニャ！ 😺", "info")

    # プロンプトの構築
    meow_print(f"プロンプトを構築中... (テーマ: {theme}) 🎨", "info")
    prompt = build_prompt(args.tag, theme)

    # 出力ディレクトリの作成
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 画像の生成
    api_key = get_fal_key()
    success = generate_image(
        prompt=str(prompt),
        output_path=str(output_path),
        aspect_ratio=args.aspect_ratio,
        api_key=api_key
    )

    if success:
        meow_print("ヘッダー画像の生成が完了したニャ！ 🎉😺", "success")
        return 0
    else:
        meow_print("ヘッダー画像の生成に失敗したニャ... 😿", "error")
        return 1

if __name__ == "__main__":
    sys.exit(main())
