import os
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf

MODEL_INPUT_SIZE = (224, 224)
FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def build_model(input_shape=(224, 224, 3)):
    inputs = tf.keras.Input(shape=input_shape)
    x = tf.keras.layers.Rescaling(1.0 / 255)(inputs)

    x = tf.keras.layers.Conv2D(32, 3, activation="relu", padding="same")(x)
    x = tf.keras.layers.MaxPooling2D(2)(x)
    x = tf.keras.layers.Conv2D(64, 3, activation="relu", padding="same")(x)
    x = tf.keras.layers.MaxPooling2D(2)(x)
    x = tf.keras.layers.Conv2D(128, 3, activation="relu", padding="same")(x)
    x = tf.keras.layers.MaxPooling2D(2)(x)
    x = tf.keras.layers.Conv2D(256, 3, activation="relu", padding="same")(x)
    x = tf.keras.layers.MaxPooling2D(2)(x)

    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(1, activation="sigmoid")(x)

    model = tf.keras.Model(inputs=inputs, outputs=outputs, name="deepfake_cnn")
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
    return model


def load_saved_model(model_path):
    if os.path.exists(model_path):
        return tf.keras.models.load_model(model_path)
    return build_model()


def preprocess_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = image.resize(MODEL_INPUT_SIZE)
    arr = np.array(image, dtype=np.float32)
    arr = arr / 255.0
    return np.expand_dims(arr, axis=0)


def detect_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    if len(faces) == 0:
        return frame
    x, y, w, h = faces[0]
    return frame[y:y+h, x:x+w]


def frame_to_array(frame):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image).resize(MODEL_INPUT_SIZE)
    arr = np.asarray(image, dtype=np.float32) / 255.0
    return arr


def predict_image(model, image_path):
    frame = cv2.imread(image_path)
    if frame is None:
        raise ValueError("Unable to read image file")

    face = detect_face(frame)
    processed = frame_to_array(face)
    prediction = model.predict(np.expand_dims(processed, axis=0), verbose=0)[0][0]
    label = "FAKE" if prediction >= 0.5 else "REAL"
    confidence = prediction if label == "FAKE" else 1.0 - prediction
    return {
        "label": label,
        "confidence": float(confidence * 100),
        "details": "Single image analysis",
        "frame_count": 1,
    }


def predict_video(model, video_path, max_frames=30, skip_every=15):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Unable to open video file")

    scores = []
    frame_index = 0
    selected_frames = 0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)

    while cap.isOpened() and selected_frames < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_index % skip_every == 0:
            selected_frames += 1
            face = detect_face(frame)
            arr = frame_to_array(face)
            prediction = model.predict(np.expand_dims(arr, axis=0), verbose=0)[0][0]
            scores.append(prediction)
        frame_index += 1

    cap.release()
    if len(scores) == 0:
        raise ValueError("No frames could be processed from the video")

    avg_score = float(np.mean(scores))
    label = "FAKE" if avg_score >= 0.5 else "REAL"
    confidence = avg_score if label == "FAKE" else 1.0 - avg_score
    return {
        "label": label,
        "confidence": float(confidence * 100),
        "details": f"Averaged {len(scores)} frames from video",
        "frame_count": len(scores),
    }
