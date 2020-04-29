"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        if (result && result.textAnnotations) {
            const data = result.textAnnotations[0];
            const text = data.description;
            if (text) {
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
        }
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
            .map((a) => a.text.replace(/^A |B |C |D /, ""));
        docRef.set({ question, answers });
        allData.push(data);
    }
    res.send(allData);
});
exports.getRound3Questions = functions.https.onRequest(async (req, res) => {
    const imgs = ["q01A", "q01B"];
    let allData = [];
    const docRef = admin.firestore().collection("round3").doc("puzzle01");
    for (const img of imgs) {
        const imageUri = `gs://dsm-ocr.appspot.com/round3/${img}.jpg`;
        const [result] = await visionClient.textDetection(imageUri);
        const data = result.fullTextAnnotation;
        allData.push(data);
    }
    const formattedData = allData.map((d) => {
        const blocks = utils.getTextBlocks(d);
        const puzzlePieces = blocks.slice(3, 15);
        const answers = blocks
            .slice(15, 18)
            .map((answer) => (Object.assign(Object.assign({}, answer), { pieces: [] })));
        const puzzleGroups = blocks
            .slice(18)
            .sort((a, b) => a.x - b.x)
            .reduce((acc, curr, i, src) => {
            const prev = src[i - 1];
            if (prev && curr.x - prev.x < 50) {
                const newAcc = [...acc];
                newAcc[newAcc.length - 1].text =
                    newAcc[newAcc.length - 1].text + " " + curr.text;
                return newAcc;
            }
            else {
                return [...acc, curr];
            }
        }, []);
        return {
            puzzlePieces,
            answers,
            puzzleGroups,
        };
    });
    const q01 = {
        puzzlePieces: formattedData[0].puzzlePieces,
        answers: formattedData[1].answers,
        puzzleGroups: formattedData[1].puzzleGroups,
    };
    q01.puzzlePieces.forEach((term) => {
        const t = term.text.toLowerCase().trim();
        q01.puzzleGroups.forEach((group, i) => {
            const g = group.text.toLowerCase().trim();
            if (g.includes(t)) {
                q01.answers[i].pieces.push(term);
            }
        });
    });
    const q02 = {
        puzzlePieces: formattedData[1].puzzlePieces,
        answers: formattedData[0].answers,
        puzzleGroups: formattedData[0].puzzleGroups,
    };
    q02.puzzlePieces.forEach((term) => {
        const t = term.text.toLowerCase().trim();
        q02.puzzleGroups.forEach((group, i) => {
            const g = group.text.toLowerCase().trim();
            if (g.includes(t)) {
                q02.answers[i].pieces.push(term);
            }
        });
    });
    const q01Obj = {
        pieces: q01.puzzlePieces,
        answers: q01.answers,
    };
    const q02Obj = {
        pieces: q02.puzzlePieces,
        answers: q02.answers,
    };
    const qObj = {
        q01: q01Obj,
        q02: q02Obj,
    };
    docRef.set({ puzzle: qObj });
    res.send(allData);
});
//# sourceMappingURL=index.js.map