"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTextBlocks(res) {
    let textBlocks = [];
    let blockIndex = 0;
    res.pages.forEach((page) => {
        textBlocks = textBlocks.concat(page.blocks.map((block) => {
            return {
                blockIndex: blockIndex++,
                text: getBlockText(block),
                x: block.boundingBox.vertices[0].x,
                y: block.boundingBox.vertices[0].y,
            };
        }));
    });
    return textBlocks;
}
exports.getTextBlocks = getTextBlocks;
function getBlockText(block) {
    let result = "";
    block.paragraphs.forEach((paragraph) => {
        paragraph.words.forEach((word) => {
            word.symbols.forEach((symbol) => {
                result += symbol.text;
                if (symbol.property && symbol.property.detectedBreak) {
                    const breakType = symbol.property.detectedBreak.type;
                    if (["EOL_SURE_SPACE", "SPACE"].includes(breakType)) {
                        result += " ";
                    }
                    if (["EOL_SURE_SPACE", "LINE_BREAK"].includes(breakType)) {
                        result += "\n"; // Perhaps use os.EOL for correctness.
                    }
                }
            });
        });
    });
    return result;
}
//# sourceMappingURL=utils.js.map