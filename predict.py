import cv2
import torch
import numpy as np
import segmentation_models_pytorch as smp


MODEL_PATH = "model.pt"
IMAGE_PATH = "test.jpg"

IMAGE_SIZE = 256


# =========================
# Device
# =========================
device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# =========================
# Model
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


# =========================
# Read Image
# =========================
image = cv2.imread(IMAGE_PATH)

if image is None:
    raise FileNotFoundError(
        f"Could not find image: {IMAGE_PATH}"
    )


# Save original dimensions
original_height, original_width = image.shape[:2]

print("Original size:")
print(
    f"{original_width} x {original_height}"
)


# =========================
# Preprocessing
# Same preprocessing used
# during validation/testing
# =========================

image_rgb = cv2.cvtColor(
    image,
    cv2.COLOR_BGR2RGB
)

image_resized = cv2.resize(
    image_rgb,
    (IMAGE_SIZE, IMAGE_SIZE)
)

image_float = (
    image_resized.astype(np.float32)
    / 255.0
)


mean = np.array(
    [0.485, 0.456, 0.406],
    dtype=np.float32
)

std = np.array(
    [0.229, 0.224, 0.225],
    dtype=np.float32
)

image_normalized = (
    image_float - mean
) / std


image_tensor = torch.from_numpy(
    image_normalized.transpose(2, 0, 1)
).float()


image_tensor = (
    image_tensor
    .unsqueeze(0)
    .to(device)
)


# =========================
# Prediction
# =========================

with torch.no_grad():

    output = model(image_tensor)

    probability = torch.sigmoid(output)

    mask = (
        probability > 0.5
    ).float()


# =========================
# Mask
# =========================

mask_np = (
    mask
    .squeeze()
    .cpu()
    .numpy()
)

mask_uint8 = (
    mask_np * 255
).astype(np.uint8)


# =========================
# Return Mask to
# Original Image Size
# =========================

mask_original_size = cv2.resize(
    mask_uint8,
    (original_width, original_height),
    interpolation=cv2.INTER_NEAREST
)


# =========================
# Save Mask
# =========================

cv2.imwrite(
    "predicted_mask.png",
    mask_original_size
)


# =========================
# Segmentation Overlay
# =========================

overlay = image.copy()

# Red tumor area
overlay[
    mask_original_size > 0
] = [0, 0, 255]


segmented = cv2.addWeighted(
    image,
    0.7,
    overlay,
    0.3,
    0
)


# =========================
# Save Result
# =========================

cv2.imwrite(
    "segmented_result.png",
    segmented
)


# =========================
# Done
# =========================

print()
print("================================")
print("Prediction completed!")
print("================================")

print(
    "Model:",
    MODEL_PATH
)

print(
    "Image:",
    IMAGE_PATH
)

print(
    "Device:",
    device
)

print(
    "Original size:",
    f"{original_width} x {original_height}"
)

print(
    "Model input:",
    "256 x 256"
)

print(
    "Output size:",
    f"{original_width} x {original_height}"
)

print(
    "Mask saved as: predicted_mask.png"
)

print(
    "Result saved as: segmented_result.png"
)