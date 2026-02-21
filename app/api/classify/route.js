import { NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import fs from "fs";
import path from "path";

let model;
let classifier;

/**
 * Load MobileNet + classifier dataset from saved JSON
 */
async function loadModel() {
  if (!model) {
    // Load MobileNet
    model = await mobilenet.load();
    classifier = knnClassifier.create();

    // Load saved classifier dataset
    const datasetPath = path.join(process.cwd(), "ml/health_model/classifier.json");
    if (!fs.existsSync(datasetPath)) {
      throw new Error("Classifier dataset not found. Please run ml/train.js first.");
    }

    const dataset = JSON.parse(fs.readFileSync(datasetPath));
    const tensorObj = {};
    Object.entries(dataset).forEach(([label, data]) => {
      tensorObj[label] = tf.tensor(data, [data.length / 1024, 1024]);
    });
    classifier.setClassifierDataset(tensorObj);
  }
}

/**
 * POST handler for /api/classify
 * Expects: { imageBuffer: <base64 string> }
 * Returns: { label: "Healthy", confidence: 0.92 }
 */
export async function POST(req) {
  try {
    await loadModel();

    const { imageBuffer } = await req.json();
    if (!imageBuffer) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Decode base64 image → tensor
    const imgTensor = tf.node.decodeImage(Buffer.from(imageBuffer, "base64")).expandDims(0);

    // Extract embedding from MobileNet
    const embedding = model.infer(imgTensor, true);

    // Predict class
    const result = await classifier.predictClass(embedding);

    // Clean up tensor
    imgTensor.dispose();

    return NextResponse.json({
      label: result.label,
      confidence: result.confidences[result.label],
    });
  } catch (err) {
    console.error("Classification error:", err);
    return NextResponse.json({ error: "Failed to classify image" }, { status: 500 });
  }
}