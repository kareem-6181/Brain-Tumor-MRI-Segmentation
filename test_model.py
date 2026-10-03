import torch
import segmentation_models_pytorch as smp

MODEL_PATH = "model.pt"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = smp.UnetPlusPlus(
    encoder_name="resnet50",
    encoder_weights=None,
    in_channels=3,
    classes=1
)

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))

model.to(device)
model.eval()

print("Model loaded successfully!")
print("Device:", device)