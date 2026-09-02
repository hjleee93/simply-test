#!/usr/bin/env python3
"""PNG 마스코트 → brand-icon / favicon 리사이즈 (픽셀 그리드 대신 일러스트용)"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
SOURCE = PUBLIC / 'brand-mascot.png'


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f'Missing source image: {SOURCE}')

    img = Image.open(SOURCE).convert('RGBA')
    bbox = img.getbbox()
    if not bbox:
        raise SystemExit('Source image is empty')

    cropped = img.crop(bbox)
    side = max(cropped.size)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))

    square.save(PUBLIC / 'brand-mascot.png', optimize=True)
    square.save(PUBLIC / 'brand-icon.png', optimize=True)

    for size in (16, 32, 192):
        square.resize((size, size), Image.NEAREST).save(
            PUBLIC / f'favicon-{size}.png',
            optimize=True,
        )

    print('Exported brand-icon.png and favicon PNGs from brand-mascot.png')


if __name__ == '__main__':
    main()
