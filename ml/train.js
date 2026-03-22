// ml/train.js

const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// ✅ FIXED IMAGE LOADER (NO tf.node)
async function loadImage(filePath) {
  try {
    const image = await Jimp.read(filePath);
    image.resize(224, 224);

    const { data, width, height } = image.bitmap;

    const buffer = [];

    for (let i = 0; i < data.length; i += 4) {
      buffer.push(data[i]);     // R
      buffer.push(data[i + 1]); // G
      buffer.push(data[i + 2]); // B
    }

    const tensor = tf.tensor3d(buffer, [height, width, 3])
      .toFloat()
      .div(255.0)
      .expandDims(0);

    return tensor;

  } catch (err) {
    throw new Error("Invalid image");
  }
}

async function train() {
  console.log("🚀 Loading MobileNet...");
  const mobilenetModel = await mobilenet.load();

  const classifier = knnClassifier.create();

  const classes = ['healthy', 'injured', 'sick'];

  for (const label of classes) {
    const folder = path.join(__dirname, 'dataset', label);

    if (!fs.existsSync(folder)) {
      console.log(`❌ Missing folder: ${label}`);
      continue;
    }

    const files = fs.readdirSync(folder).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return VALID_EXTENSIONS.includes(ext);
    });

    console.log(`\n📂 ${label}: ${files.length} images`);

    let processed = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(folder, file);

      try {
        console.log(`➡️ ${label}: ${i + 1}/${files.length}`);

        const imgTensor = await loadImage(filePath);

        const embedding = mobilenetModel.infer(imgTensor, true);

        classifier.addExample(embedding, label);

        tf.dispose([imgTensor, embedding]);

        processed++;

      } catch (err) {
        console.log(`⚠️ Failed: ${file}`);
        failed++;
      }
    }

    console.log(`✅ ${label}: Processed ${processed}, Failed ${failed}`);
  }

  console.log("\n💾 Saving model...");

  const dataset = classifier.getClassifierDataset();
  const datasetObj = {};

  for (let label in dataset) {
    const data = await dataset[label].array(); // ✅ CORRECT
    datasetObj[label] = data;
  }

  const savePath = path.join(__dirname, 'health_model');

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  fs.writeFileSync(
    path.join(savePath, 'classifier.json'),
    JSON.stringify(datasetObj)
  );

  console.log("✅ Training complete, classifier saved!");
}

train();