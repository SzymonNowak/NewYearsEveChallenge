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
    with open(f"watch2.csv") as f:
        lines = [line.rstrip('\n').replace("(", '').replace(")", '') for line in f]
        pts = [(int(cordStr.split(',')[0]), int(cordStr.split(',')[1])) for cordStr in lines]
    for i in range(1, len(pts)):
        if pts[i - 1] is None or pts[i] is None:
            continue
        cv2.line(blackboard, pts[i - 1], pts[i], (255, 255, 255), 7)
  #  while True:
   #     cv2.imshow("Frame", blackboard)
    #    k = cv2.waitKey(10)


    blackboard_gray = cv2.cvtColor(blackboard, cv2.COLOR_BGR2GRAY)
    blur1 = cv2.medianBlur(blackboard_gray, 15)
    blur1 = cv2.GaussianBlur(blur1, (5, 5), 0)
    thresh1 = cv2.threshold(blur1, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    # print(cv2.findContours(thresh1.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE))
    blackboard_cnts = cv2.findContours(thresh1.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)[0]

    if len(blackboard_cnts) >= 1:
        cnt = max(blackboard_cnts, key=cv2.contourArea)
        # print(cv2.contourArea(cnt))
        if cv2.contourArea(cnt) > 2000:
            x, y, w, h = cv2.boundingRect(cnt)
            digit = blackboard_gray[y:y + h, x:x + w]
            pred_probab, pred_class = keras_predict(model, digit)
            print(pts)
            print(names[pred_class])
            with open(str(names[pred_class]) + str(iter) + '.csv', mode='w') as sample_file:
                writer = csv.writer(sample_file, delimiter='\n', quoting=csv.QUOTE_MINIMAL)
                writer.writerow(pts)
                iter += 1


def keras_predict(model, image):
    processed = keras_process_image(image)
   # print("processed: " + str(processed.shape))
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


def overlay(image, emoji, x, y, w, h):
    emoji = cv2.resize(emoji, (w, h))
    try:
        image[y:y + h, x:x + w] = blend_transparent(image[y:y + h, x:x + w], emoji)
    except:
        pass
    return image


def blend_transparent(face_img, overlay_t_img):
    # Split out the transparency mask from the colour info
    overlay_img = overlay_t_img[:, :, :3]  # Grab the BRG planes
    overlay_mask = overlay_t_img[:, :, 3:]  # And the alpha plane

    # Again calculate the inverse mask
    background_mask = 255 - overlay_mask

    # Turn the masks into three channel, so we can use them as weights
    overlay_mask = cv2.cvtColor(overlay_mask, cv2.COLOR_GRAY2BGR)
    background_mask = cv2.cvtColor(background_mask, cv2.COLOR_GRAY2BGR)

    # Create a masked out face image, and masked out overlay
    # We convert the images to floating point in range 0.0 - 1.0
    face_part = (face_img * (1 / 255.0)) * (background_mask * (1 / 255.0))
    overlay_part = (overlay_img * (1 / 255.0)) * (overlay_mask * (1 / 255.0))

    # And finally just add them together, and rescale it back to an 8bit integer image
    return np.uint8(cv2.addWeighted(face_part, 255.0, overlay_part, 255.0, 0.0))


keras_predict(model, np.zeros((50, 50, 1), dtype=np.uint8))
if __name__ == '__main__':
    main()
