import os
import uuid
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "mp4", "mov", "avi", "mkv"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

sys.path.append(BASE_DIR)
from model import load_saved_model, predict_image, predict_video  # noqa: E402

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024  # 32 MB upload limit

MODEL_PATH = os.path.join(os.path.dirname(BASE_DIR), "model", "model.h5")
model = load_saved_model(MODEL_PATH)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    filename = secure_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    upload_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
    file.save(upload_path)

    try:
        ext = filename.rsplit('.', 1)[1].lower()
        if ext in {"png", "jpg", "jpeg"}:
            result = predict_image(model, upload_path)
        else:
            result = predict_video(model, upload_path)

        response = {
            "result": result["label"],
            "confidence": round(result["confidence"], 2),
            "details": result.get("details", ""),
            "frame_count": result.get("frame_count", 0),
        }
        return jsonify(response)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        if os.path.exists(upload_path):
            os.remove(upload_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
