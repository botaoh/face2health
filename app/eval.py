'''
This function loads one random recording from CinC Challenge and use pre-trained model in predicting what it is using Residual Networks
For more information visit: https://github.com/fernandoandreotti/cinc-challenge2017

 Referencing this work
   Andreotti, F., Carr, O., Pimentel, M.A.F., Mahdi, A., & De Vos, M. (2017). Comparing Feature Based
   Classifiers and Convolutional Neural Networks to Detect Arrhythmia from Short Segments of ECG. In
   Computing in Cardiology. Rennes (France).
--
 cinc-challenge2017, version 1.0, Sept 2017
 Last updated : 27-09-2017
 Released under the GNU General Public License
 Copyright (C) 2017  Fernando Andreotti, Oliver Carr, Marco A.F. Pimentel, Adam Mahdi, Maarten De Vos
 University of Oxford, Department of Engineering Science, Institute of Biomedical Engineering
 fernando.andreotti@eng.ox.ac.uk

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

# Download some random waveform from challenge database
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