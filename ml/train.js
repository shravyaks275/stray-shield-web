// ml/train.js
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const fs = require('fs');
const path = require('path');
const {Jimp} = require('jimp'); // image loader

// Load image and convert to tensor
async function loadImage(filePath) {
  const image = await Jimp.read(filePath);
  const { data, width, height } = image.bitmap;

  // Convert raw pixel data (RGBA) into a tensor
  const imgTensor = tf.tensor3d(new Uint8Array(data), [height, width, 4]);

  // Remove alpha channel (RGBA → RGB)
  const rgbTensor = imgTensor.slice([0, 0, 0], [-1, -1, 3]);

  // Resize to 224x224 (MobileNet input size)
  const resized = tf.image.resizeBilinear(rgbTensor, [224, 224]);

  // Normalize pixel values to [0,1]
  const normalized = resized.div(255.0);

  // Add batch dimension → shape [1, 224, 224, 3]
  return normalized.expandDims(0);
}

async function train() {
  const classifier = knnClassifier.create();
  const mobilenetModel = await mobilenet.load();

  const classes = ['healthy', 'injured', 'sick'];

  for (const label of classes) {
    const folder = path.join(__dirname, 'dataset', label);
    const files = fs.readdirSync(folder);

    for (const file of files) {
      const imgTensor = await loadImage(path.join(folder, file));
      const embedding = mobilenetModel.infer(imgTensor, true);
      classifier.addExample(embedding, label);
      imgTensor.dispose();
    }
  }

  // Save classifier dataset
  const dataset = classifier.getClassifierDataset();
  const json = JSON.stringify(
    Object.fromEntries(
      Object.entries(dataset).map(([label, data]) => [
        label,
        Array.from(data.dataSync()),
      ])
    )
  );
  fs.writeFileSync(
    path.join(__dirname, 'health_model', 'classifier.json'),
    json
  );
  console.log('✅ Training complete, classifier saved!');
}

train();