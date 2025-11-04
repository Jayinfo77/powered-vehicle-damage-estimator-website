from tensorflow.keras.preprocessing import image
import numpy as np

def predict_damage(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # <-- target_size yaha 224x224 hunu parcha
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    predictions = model.predict(img_array)[0]
    # rest of your code
