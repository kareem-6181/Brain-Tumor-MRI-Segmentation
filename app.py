from flask import Flask, request, jsonify, send_from_directory, render_template
import os
import uuid
import cv2
import numpy as np
import torch
import segmentation_models_pytorch as smp


# =========================
# Flask App
# =========================

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


# =========================
# Model Settings
# =========================

MODEL_PATH = os.path.join(BASE_DIR, "model.pt")

IMAGE_SIZE = 256

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# =========================
# Load Model
# =========================

model = smp.UnetPlusPlus(
    encoder_name="resnet50",
    encoder_weights=None,
    in_channels=3,
    classes=1
)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model.to(device)
model.eval()


print("======================================")
print("Brain Tumor MRI Segmentation")
print("======================================")
print("Model: U-Net++ with ResNet50")
print("Device:", device)
print("Model loaded successfully!")
print("======================================")


# =========================
# Prediction Function
# =========================

def predict_image(image_path):

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Could not read the image.")

    original_height, original_width = image.shape[:2]

    # BGR -> RGB
    image_rgb = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    # Resize
    resized = cv2.resize(
        image_rgb,
        (IMAGE_SIZE, IMAGE_SIZE)
    )

    # Normalize
    resized = resized.astype(np.float32) / 255.0

    mean = np.array(
        [0.485, 0.456, 0.406],
        dtype=np.float32
    )

    std = np.array(
        [0.229, 0.224, 0.225],
        dtype=np.float32
    )

    resized = (resized - mean) / std

    # HWC -> CHW
    tensor = torch.from_numpy(
        resized.transpose(2, 0, 1)
    ).float()

    # Add batch dimension
    tensor = tensor.unsqueeze(0)

    # Move to device
    tensor = tensor.to(device)

    # =========================
    # Model Inference
    # =========================

    with torch.no_grad():

        prediction = model(tensor)

        prediction = torch.sigmoid(prediction)

    # Convert to numpy
    prediction = prediction.squeeze().cpu().numpy()

    # Threshold
    mask = (prediction > 0.5).astype(np.uint8) * 255

    # Resize mask to original image size
    mask = cv2.resize(
        mask,
        (original_width, original_height),
        interpolation=cv2.INTER_NEAREST
    )

    # =========================
    # Create Red Overlay
    # =========================

    overlay = image.copy()

    red_mask = np.zeros_like(image)

    red_mask[:, :, 2] = 255

    mask_bool = mask > 0

    overlay[mask_bool] = cv2.addWeighted(
        image[mask_bool],
        0.45,
        red_mask[mask_bool],
        0.55,
        0
    )

    # =========================
    # Save Results
    # =========================

    unique_id = uuid.uuid4().hex

    mask_filename = f"mask_{unique_id}.png"
    result_filename = f"result_{unique_id}.png"

    mask_path = os.path.join(
        OUTPUT_FOLDER,
        mask_filename
    )

    result_path = os.path.join(
        OUTPUT_FOLDER,
        result_filename
    )

    cv2.imwrite(
        mask_path,
        mask
    )

    cv2.imwrite(
        result_path,
        overlay
    )

    return {
        "mask": mask_filename,
        "result": result_filename,
        "width": original_width,
        "height": original_height
    }


# =========================
# Home Page
# =========================

@app.route("/")
def home():

    return render_template("index.html")


# =========================
# Prediction API
# =========================

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:

        return jsonify({
            "success": False,
            "message": "No image uploaded."
        }), 400

    file = request.files["image"]

    if file.filename == "":

        return jsonify({
            "success": False,
            "message": "No file selected."
        }), 400

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".tif",
        ".tiff"
    }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed_extensions:

        return jsonify({
            "success": False,
            "message": "Unsupported image format."
        }), 400

    # =========================
    # Save Uploaded Image
    # =========================

    unique_id = uuid.uuid4().hex

    original_filename = (
        f"original_{unique_id}{extension}"
    )

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        original_filename
    )

    file.save(upload_path)

    try:

        result = predict_image(
            upload_path
        )

        return jsonify({

            "success": True,

            "message": "MRI analysis completed successfully.",

            "original":
                f"/uploads/{original_filename}",

            "mask":
                f"/outputs/{result['mask']}",

            "result":
                f"/outputs/{result['result']}",

            "width":
                result["width"],

            "height":
                result["height"],

            "model":
                "U-Net++ with ResNet50",

            "input_size":
                "256x256",

            "device":
                str(device)

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message":
                f"Prediction failed: {str(e)}"

        }), 500


# =========================
# Serve Uploaded Images
# =========================

@app.route("/uploads/<filename>")
def uploaded_file(filename):

    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )


# =========================
# Serve Output Images
# =========================

@app.route("/outputs/<filename>")
def output_file(filename):

    return send_from_directory(
        OUTPUT_FOLDER,
        filename
    )


# =========================
# Run Flask
# =========================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )