import time
from random import randint
import urllib.request


# Load data
import scipy.io

mat_data = scipy.io.loadmat("./datas/ECG.mat")
data = mat_data['val']
print("Data loaded")

# Parameters
FS = 300
maxlen = 30 * FS
classes = ['A', 'N', 'O', '~']

# Load and apply model
print("Loading model")
from keras.models import load_model

model = load_model('./checkpoints/ResNet_30s_34lay_16conv.hdf5')
print("Model loaded")


import numpy as np
X = np.zeros((1, maxlen))
data = np.nan_to_num(data)  # removing NaNs and Infs
data = data[0, 0:maxlen]
data = data - np.mean(data)
data = data / np.std(data)
X[0, :len(data)] = data.T  # padding sequence
data = X
data = np.expand_dims(data, axis=2)  # required by Keras
del X

print("Applying model ..")
prob = model.predict(data)
print('prob',prob)
ann = np.argmax(prob)
print("Record classified as {} with {:3.1f}% certainty".format( classes[ann], 100 * prob[0, ann]))
with open("result.txt","w") as f:
    f.write(np.str(prob[0]))