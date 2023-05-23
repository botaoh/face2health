from torchvision import transforms
from PIL import Image
import cv2

image_path = "../imgs/test.jpg"
image = cv2.imread(image_path)


#RESNET model

from resnet import *

eval_transforms = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])])

image = eval_transforms(image)
image = torch.reshape(image, (1, 3, 224, 224))

model = torch.load("../model/model_60_gpu.pth")
model.eval()
with torch.no_grad():
    output = model(image.cuda())
    print(output)