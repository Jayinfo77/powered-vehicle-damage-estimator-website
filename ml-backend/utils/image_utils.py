import cv2
import os
import uuid

# Load Haar Cascade
cascade_path = os.path.join(os.path.dirname(__file__), "haarcascade_car.xml")
car_cascade = cv2.CascadeClassifier(cascade_path)

def is_valid_vehicle_image(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None:
            return False

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        cars = car_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3)

        return len(cars) > 0  # Vehicle detected
    except Exception as e:
        print("⚠️ Vehicle detection error:", e)
        return False

def annotate_image(image_path, label, output_dir):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Image not found or unreadable in annotate_image")

    h, w = img.shape[:2]
    cv2.putText(
        img,
        label.upper(),
        (10, h - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),  # Green text color
        2
    )

    unique_filename = f"{uuid.uuid4().hex}_{os.path.basename(image_path)}"
    output_path = os.path.join(output_dir, unique_filename)

    os.makedirs(output_dir, exist_ok=True)
    cv2.imwrite(output_path, img)

    return unique_filename
