const tf = require('@tensorflow/tfjs'); 
const mobilenet = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const fs = require('fs');
const {Jimp} = require('jimp');   
const path = require('path');
const cliProgress = require('cli-progress'); // progress bar

// Output file for predictions (with timestamp to avoid overwriting)
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = path.join(__dirname, `predictions_${timestamp}.csv`);
fs.writeFileSync(outputFile, 'image,label,confidence\n'); // header row

// Load image and convert to tensor
async function loadImage(filePath) {
  const image = await Jimp.read(filePath);
  const { data, width, height } = image.bitmap;

  const imgTensor = tf.tensor3d(new Uint8Array(data), [height, width, 4]);
  const rgbTensor = imgTensor.slice([0, 0, 0], [-1, -1, 3]);
  const resized = tf.image.resizeBilinear(rgbTensor, [224, 224]);
  const normalized = resized.div(255.0);
  return normalized.expandDims(0);
}

async function setupClassifier() {
  const mobilenetModel = await mobilenet.load();
  const classifier = knnClassifier.create();

  const dataset = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'health_model', 'classifier.json'))
  );

  const tensorObj = {};
  Object.entries(dataset).forEach(([label, data]) => {
    tensorObj[label] = tf.tensor(data, [data.length / 1024, 1024]);
  });
  classifier.setClassifierDataset(tensorObj);

  return { mobilenetModel, classifier };
}

async function predictImage(mobilenetModel, classifier, imagePath) {
  const imgTensor = await loadImage(imagePath);
  const embedding = mobilenetModel.infer(imgTensor, true);
  const result = await classifier.predictClass(embedding);

  // Save to CSV
  const line = `${path.basename(imagePath)},${result.label},${result.confidences[result.label]}\n`;
  fs.appendFileSync(outputFile, line);

  return result.label;
}

async function runBatch(folderPath) {
  const { mobilenetModel, classifier } = await setupClassifier();
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  const summary = {};
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(files.length, 0);

  for (const file of files) {
    const filePath = path.resolve(folderPath, file);
    const label = await predictImage(mobilenetModel, classifier, filePath);
    summary[label] = (summary[label] || 0) + 1;
    bar.increment();
  }

  bar.stop();
  console.log(`Summary for ${path.basename(folderPath)}:`, summary);
}

// ✅ Run batch predictions on all three folders
(async () => {
  const folders = ['healthy', 'sick', 'injured'];
  for (const folder of folders) {
    console.log(`\n=== Predictions for ${folder} ===`);
    const folderPath = path.resolve(__dirname, 'dataset', folder);
    await runBatch(folderPath);
  }
  console.log(`\nAll predictions saved to: ${outputFile}`);
})();