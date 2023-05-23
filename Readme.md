## Overview
The face2health project focuses on the classification of ECG signals and facial features. The goal is to develop models that can accurately classify ECG signals and extract relevant information from facial images to aid in healthcare applications.

## Models
The project includes the following models:

**Baseline Model** (located in *./model/baselineModel*): This model serves as a starting point for classification and utilizes the ResNet architecture. It provides a basic implementation for ECG signal classification.

**Enhanced ResNet Model** (located in *./model/train_model_resnet*): In this directory, we present an improved version of the baseline model. The model has been redefined and enhanced to improve its classification performance by incorporating advanced techniques and optimizations.

**Transformer-Encoder Model** (located in *./model/train_model_transformer*): Here, we introduce a single-lead ECG classification model based on the Transformer-Encoder framework. This model leverages the power of transformers to capture long-range dependencies and enhance the accuracy of ECG signal classification.

**Pretrained Clip Model** (located in *./model/pretrained_clip*): In this directory, we utilize the Clip Pretrained model to extract facial features from images. By incorporating facial information along with ECG signals, we aim to improve the classification performance and explore potential correlations between facial features and health conditions.

## Data Visualization
We are currently working on data visualization for the face2health project. Stay tuned for updates. As an example, you can visit sankhyan24.github.io/LittleHeartDoctor/ for an initial demonstration of our data visualization capabilities.

