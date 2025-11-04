import os
from PIL import Image

# Path to your dataset directory
dataset_dir = 'dataset'  # Update if your dataset folder is in a different location

valid_extensions = ('.jpg', '.jpeg', '.png')

for root, dirs, files in os.walk(dataset_dir):
    for file in files:
        filepath = os.path.join(root, file)

        # Skip non-image extensions
        if not file.lower().endswith(valid_extensions):
            print(f"[Deleted - Invalid Extension] {filepath}")
            os.remove(filepath)
            continue

        # Skip unreadable or corrupted image files
        try:
            with Image.open(filepath) as img:
                img.verify()  # Check if it's a readable image
        except:
            print(f"[Deleted - Corrupted Image] {filepath}")
            os.remove(filepath)
