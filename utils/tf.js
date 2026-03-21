// utils/tf.js
import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import fs from "fs";
import path from "path";

let model;
let classifier;

/**
 * Load MobileNet + classifier dataset
 */
export async function loadClassifier() {
  if (!model) {
    model = await mobilenet.load();
    classifier = knnClassifier.create();

    const datasetPath = path.join(process.cwd(), "ml/health_model/classifier.json");
    const dataset = JSON.parse(fs.readFileSync(datasetPath));
    const tensorObj = {};
    Object.entries(dataset).forEach(([label, data]) => {
      tensorObj[label] = tf.tensor(data, [data.length / 1024, 1024]);
    });
    classifier.setClassifierDataset(tensorObj);
  }
  return { model, classifier };
}

/**
 * Predict health status from base64 image
 */
export async function classifyImage(base64Image) {
  const { model, classifier } = await loadClassifier();
  const imgTensor = tf.node.decodeImage(Buffer.from(base64Image, "base64")).expandDims(0);
  const embedding = model.infer(imgTensor, true);
  const result = await classifier.predictClass(embedding);
  imgTensor.dispose();
  return result;
}