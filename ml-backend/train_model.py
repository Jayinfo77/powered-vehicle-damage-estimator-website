from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Conv2D, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import json, os

# === Config ===
img_size = 224
batch_size = 32
dataset_path = "dataset/"
model_dir = "model/"
os.makedirs(model_dir, exist_ok=True)
 
# === Data Augmentation ===
datagen = ImageDataGenerator(
    rescale=1. / 255,
    validation_split=0.2,
    rotation_range=30,
    zoom_range=0.3,
    shear_range=0.2,
    brightness_range=[0.8, 1.2],
    horizontal_flip=True
)

train_generator = datagen.flow_from_directory(
    dataset_path,
    target_size=(img_size, img_size),
    batch_size=batch_size,
    class_mode="categorical",
    subset="training",
    shuffle=True
)

val_generator = datagen.flow_from_directory(
    dataset_path,
    target_size=(img_size, img_size),
    batch_size=batch_size,
    class_mode="categorical",
    subset="validation",
    shuffle=False
)

# === Load Pretrained MobileNetV2 Base ===
base_model = MobileNetV2(include_top=False, weights='imagenet', input_shape=(img_size, img_size, 3))
base_model.trainable = False  # Freeze base layers initially

# === Add Custom CNN Layers ===
x = base_model.output
x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
x = BatchNormalization()(x)  # Add BatchNorm for better training stability
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x)
x = Dropout(0.4)(x)
output = Dense(train_generator.num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)
model.compile(optimizer=Adam(0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

model.summary()

# === Callbacks ===
checkpoint = ModelCheckpoint(
    filepath=os.path.join(model_dir, "best_damage_model.h5"),
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

earlystop = EarlyStopping(
    monitor="val_loss",
    patience=7,
    verbose=1,
    restore_best_weights=True
)

reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=3,
    verbose=1,
    min_lr=1e-7
)

# === Train the Model (Stage 1: Train top layers only) ===
history = model.fit(
    train_generator,
    epochs=15,
    validation_data=val_generator,
    callbacks=[checkpoint, earlystop, reduce_lr]
)

# === Optional: Unfreeze some layers and fine-tune ===
base_model.trainable = True

# Fine-tune from this layer onward (adjust as needed)
fine_tune_at = 100

for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

# Recompile with a lower learning rate
model.compile(optimizer=Adam(1e-5), loss='categorical_crossentropy', metrics=['accuracy'])

# Continue training (fine-tuning)
fine_tune_epochs = 10
total_epochs = 15 + fine_tune_epochs

history_fine = model.fit(
    train_generator,
    epochs=total_epochs,
    initial_epoch=history.epoch[-1],
    validation_data=val_generator,
    callbacks=[checkpoint, earlystop, reduce_lr]
)

# === Save final model and classes ===
model.save(os.path.join(model_dir, "damage_model.h5"))
with open(os.path.join(model_dir, "classes.json"), "w") as f:
    json.dump(train_generator.class_indices, f)

print("[INFO] Model and class labels saved.")
