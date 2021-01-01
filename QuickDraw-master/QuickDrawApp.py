import csv

import cv2
from keras.models import load_model
import numpy as np
from collections import deque
import os

model = load_model('QuickDraw.h5')
names = [
    "apple",
    "bow",
    "candle",
    "door",
    "envelope",
    "fish",
    "guitar",
    "ice-cream",
    "thunder",
    "moon",
    "mountain",
    "star",
    "tent",
    "broom",
    "watch",
    "apple"
]


def main():
    pts = []
    iter = 0
    blackboard = np.zeros((420, 700, 3), dtype=np.uint8)
    with open(f"data.csv") as f:
        lines = [line.rstrip('\n').replace("(", '').replace(")", '') for line in f]
        pts = [(int(cordStr.split(',')[0]), int(cordStr.split(',')[1])) for cordStr in lines]
    for i in range(1, len(pts)):
        if pts[i - 1] is None or pts[i] is None:
            continue
        cv2.line(blackboard, pts[i - 1], pts[i], (255, 255, 255), 7)
    blackboard_gray = cv2.cvtColor(blackboard, cv2.COLOR_BGR2GRAY)
    blur1 = cv2.medianBlur(blackboard_gray, 15)
    blur1 = cv2.GaussianBlur(blur1, (5, 5), 0)
    thresh1 = cv2.threshold(blur1, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    blackboard_cnts = cv2.findContours(thresh1.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)[0]

    if len(blackboard_cnts) >= 1:
        cnt = max(blackboard_cnts, key=cv2.contourArea)
        if cv2.contourArea(cnt) > 2000:
            x, y, w, h = cv2.boundingRect(cnt)
            digit = blackboard_gray[y:y + h, x:x + w]
            pred_probab, pred_class = keras_predict(model, digit)
            #print(pts)
            #print(names[pred_class])
            with open('result.txt', mode='w') as final:
                final.write(names[pred_class])
            # with open(str(names[pred_class]) + str(iter) + '.csv', mode='w') as sample_file:
            #     writer = csv.writer(sample_file, delimiter='\n', quoting=csv.QUOTE_MINIMAL)
            #     writer.writerow(pts)
            #     iter += 1


def keras_predict(model, image):
    processed = keras_process_image(image)
    pred_probab = model.predict(processed)[0]
    pred_class = list(pred_probab).index(max(pred_probab))
    return max(pred_probab), pred_class


def keras_process_image(img):
    image_x = 28
    image_y = 28
    img = cv2.resize(img, (image_x, image_y))
    img = np.array(img, dtype=np.float32)
    img = np.reshape(img, (-1, image_x, image_y, 1))
    return img


if __name__ == '__main__':
    main()
