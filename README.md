# 🧠 Brain Tumor MRI Segmentation

An advanced Medical AI project for automatic brain tumor segmentation from MRI scans using **U-Net++** with a **ResNet50 encoder**. The system is designed to identify and highlight tumor regions in brain MRI images through deep learning–based semantic segmentation.

---

## 📌 Overview

Brain tumor segmentation is an important task in medical image analysis. This project utilizes a deep learning segmentation model to generate precise tumor masks from MRI scans, helping visualize tumor regions automatically.

The project combines:

* Medical AI
* Computer Vision
* Deep Learning
* Semantic Segmentation
* Web Deployment

---

## 🚀 Features

* Brain MRI tumor segmentation
* U-Net++ architecture with ResNet50 encoder
* Automated preprocessing pipeline
* Tumor mask generation
* Interactive web-based interface
* Responsive modern UI
* Flask deployment
* Real-time image analysis workflow
* Educational and research-oriented implementation

---

## 🏗️ Model Architecture

### Encoder

* ResNet50 (ImageNet Pretrained)

### Decoder

* U-Net++

### Input Size

* 256 × 256

### Output

* Binary tumor segmentation mask

---

## 🔄 Segmentation Pipeline

```text
MRI Scan
    ↓
Preprocessing
    ↓
ResNet50 Encoder
    ↓
U-Net++ Decoder
    ↓
Segmentation Head
    ↓
Tumor Mask
```

---

## 📊 Performance

| Metric     | Score  |
| ---------- | ------ |
| Dice Score | 91.18% |
| IoU Score  | 83.79% |

---

## 🗂️ Dataset

### LGG MRI Segmentation Dataset

Dataset Statistics:

| Category          | Count |
| ----------------- | ----- |
| Total Images      | 3929  |
| Total Masks       | 3929  |
| Training Images   | 3143  |
| Validation Images | 393   |
| Test Images       | 393   |

---

## 🧰 Technologies Used

### Artificial Intelligence & Deep Learning

* PyTorch
* Segmentation Models PyTorch (SMP)
* U-Net++
* ResNet50

### Image Processing

* OpenCV
* Albumentations
* NumPy

### Web Development

* Flask
* HTML5
* CSS3
* JavaScript

---

## 📁 Project Structure

```text
Brain-Tumor-MRI-Segmentation/
│
├── app.py
├── requirements.txt
├── README.md
│
├── model/
│   ├── best_model.pth
│   └── checkpoints
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│
├── templates/
│   └── index.html
│
└── uploads/
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/Brain-Tumor-MRI-Segmentation.git
```

Move to the project directory:

```bash
cd Brain-Tumor-MRI-Segmentation
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python app.py
```

---

## 🖥️ Web Interface

The project includes a modern web interface that allows users to:

* Upload MRI images
* Run AI segmentation
* View the generated mask
* Compare original and segmented results
* Explore project architecture and performance

---

## ⚠️ Disclaimer

This project is intended for:

* Educational purposes
* Research purposes
* Demonstration of Medical AI techniques

It is **not a medical diagnostic tool** and should not be used for clinical decision-making.

---

## 👨‍💻 Authors

### MOSTAFA ATTIA

**AI & Machine Learning Engineer**

### KAREEM REDA

**AI & Machine Learning Engineer & Back-End / Front-End Developer**

---

## 🌟 Future Improvements

* Multi-class tumor segmentation
* Advanced MRI preprocessing
* Test Time Augmentation (TTA)
* Cloud deployment
* Model optimization for faster inference
* Support for additional medical imaging datasets

---

## 📜 License

This project is released for educational and research purposes.
