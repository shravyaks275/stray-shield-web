// ml/predict.js

const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');
const cliProgress = require('cli-progress');

// Output CSV
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = path.join(__dirname, `predictions_${timestamp}.csv`);
fs.writeFileSync(outputFile, 'image,label,confidence\n');

// ✅ FIXED IMAGE LOADER
async function loadImage(filePath) {
  try {
    const image = await Jimp.read(filePath);
    image.resize(224, 224);

    const { data, width, height } = image.bitmap;

    const buffer = [];

    for (let i = 0; i < data.length; i += 4) {
      buffer.push(data[i]);
      buffer.push(data[i + 1]);
      buffer.push(data[i + 2]);
    }

    const tensor = tf.tensor3d(buffer, [height, width, 3])
      .toFloat()
      .div(255.0)
      .expandDims(0);

    return tensor;

  } catch (err) {
    console.log(`❌ Skipping invalid image: ${filePath}`);
    return null;
  }
}

// ---------------- LOAD MODEL ----------------
async function setupClassifier() {
  const mobilenetModel = await mobilenet.load();
  const classifier = knnClassifier.create();

  const datasetPath = path.join(__dirname, 'health_model', 'classifier.json');

  if (!fs.existsSync(datasetPath)) {
    throw new Error("❌ classifier.json not found. Train model first.");
  }

  const dataset = JSON.parse(fs.readFileSync(datasetPath));

  const tensorObj = {};

  Object.entries(dataset).forEach(([label, data]) => {
    tensorObj[label] = tf.tensor2d(data); // ✅ CORRECT
  });

  classifier.setClassifierDataset(tensorObj);

  console.log("✅ Model & classifier loaded");

  return { mobilenetModel, classifier };
}

// ---------------- PREDICT ----------------
async function predictImage(mobilenetModel, classifier, imagePath) {
  const imgTensor = await loadImage(imagePath);
  if (!imgTensor) return null;

  const activation = mobilenetModel.infer(imgTensor, true);
  const result = await classifier.predictClass(activation);

  const confidence = result.confidences[result.label] || 0;

  const line = `${path.basename(imagePath)},${result.label},${confidence}\n`;
  fs.appendFileSync(outputFile, line);

  tf.dispose([imgTensor, activation]);

  return result.label;
}

// ---------------- BATCH ----------------
async function runBatch(folderPath, mobilenetModel, classifier) {
  const files = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  const summary = {};

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(files.length, 0);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    try {
      const label = await predictImage(mobilenetModel, classifier, filePath);
      if (label) {
        summary[label] = (summary[label] || 0) + 1;
      }
    } catch (err) {
      console.log(`❌ Error processing: ${file}`);
    }

    bar.increment();
  }

  bar.stop();

  console.log(`\n📊 Summary for ${path.basename(folderPath)}:`);
  console.log(summary);
}

// ---------------- MAIN ----------------
(async () => {
  try {
    const { mobilenetModel, classifier } = await setupClassifier();

    const folders = ['healthy', 'sick', 'injured'];

    for (const folder of folders) {
      console.log(`\n=== Running predictions for ${folder} ===`);
      const folderPath = path.join(__dirname, 'dataset', folder);
      await runBatch(folderPath, mobilenetModel, classifier);
    }

    console.log(`\n✅ All predictions saved to:\n${outputFile}`);

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  }
})();