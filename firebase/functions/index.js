const functions = require("firebase-functions");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");
const utils = require("./utils");

admin.initializeApp(functions.config().firebase);
const visionClient = new vision.ImageAnnotatorClient();

exports.getText = functions.storage.object().onFinalize(async (object) => {
  const bucket = object.bucket;
  const filePath = object.name;

  if (filePath) {
    const imageUri = `gs://${bucket}/${filePath}`;
    const docId = filePath.split(".jpg")[0];
    const docRef = admin.firestore().collection("questions").doc(docId);

    const textRequest = await visionClient.documentTextDetection(imageUri);

    if (textRequest[0].textAnnotations) {
      const fullText = textRequest[0].textAnnotations[0];
      return docRef.set({ result: fullText });
    }
  }

  return false;
});

exports.getRound1Questions = functions.https.onRequest(async (req, res) => {
  const imgs = ["q01", "q02"];
  let allData = [];

  for (const img of imgs) {
    const imageUri = `gs://dsm-ocr.appspot.com/round1/${img}.jpg`;
    const docRef = admin.firestore().collection("round1").doc(img);

    const [result] = await visionClient.textDetection(imageUri);

    const data = result.textAnnotations[0];
    const text = data.description;

    const lines = text.split("V:").filter((q) => q.startsWith(" "));

    const questions = lines.map((line) => {
      const q = line.split("A:")[0].trim();
      const a = line.split("A:")[1].trim();

      return {
        question: q,
        answer: a,
      };
    });

    docRef.set({ questions });
    allData.push(data);
  }

  res.send(allData);
});

exports.getRound2Questions = functions.https.onRequest(async (req, res) => {
  const imgs = ["q01", "q02"];
  let allData = [];

  for (const img of imgs) {
    const imageUri = `gs://dsm-ocr.appspot.com/round2/${img}.jpg`;
    const docRef = admin.firestore().collection("round2").doc(img);

    const [result] = await visionClient.textDetection(imageUri);

    const data = result.fullTextAnnotation;

    const blocks = utils.getTextBlocks(data);
    const question = blocks[1].text;
    const answers = blocks
      .slice(2)
      .map((a) => a.text.replace(/^A |B |C |D /, ""))
      .trim();

    docRef.set({ question, answers });

    allData.push(data);
  }

  res.send(allData);
});
