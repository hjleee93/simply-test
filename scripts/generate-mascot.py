#!/usr/bin/env python3
"""새싹 브랜드 아이콘 → 파비콘 리사이즈"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
SOURCE = PUBLIC / 'brand-sprout.png'


def to_square(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    cropped = image.crop(bbox) if bbox else image
    side = max(cropped.size)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
    return square


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f'Missing source image: {SOURCE}')

    square = to_square(Image.open(SOURCE).convert('RGBA'))
    square.save(PUBLIC / 'brand-icon.png', optimize=True)

    for size in (16, 32, 192):
        square.resize((size, size), Image.NEAREST).save(
            PUBLIC / f'favicon-{size}.png',
            optimize=True,
        )

    print('Exported favicons from brand-sprout.png')


if __name__ == '__main__':
    main()
