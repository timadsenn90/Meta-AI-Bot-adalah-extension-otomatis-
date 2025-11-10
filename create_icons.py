#!/usr/bin/env python3
"""
Simple script to create placeholder icons for the Chrome extension
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create image with gradient-like background
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)

    # Draw a circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], fill='#764ba2')

    # Draw robot face
    if size >= 48:
        # Eyes
        eye_size = size // 12
        eye_y = size // 3
        draw.ellipse([size//3 - eye_size, eye_y - eye_size,
                     size//3 + eye_size, eye_y + eye_size], fill='white')
        draw.ellipse([2*size//3 - eye_size, eye_y - eye_size,
                     2*size//3 + eye_size, eye_y + eye_size], fill='white')

        # Smile
        mouth_y = 2*size//3
        draw.arc([size//4, mouth_y-size//8, 3*size//4, mouth_y+size//8],
                start=0, end=180, fill='white', width=size//20)

    # Save
    img.save(filename, 'PNG')
    print(f"Created {filename}")

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Create icons
create_icon(16, 'icons/icon16.png')
create_icon(48, 'icons/icon48.png')
create_icon(128, 'icons/icon128.png')

print("\n✅ All icons created successfully!")
print("Icons are located in the 'icons' directory")
