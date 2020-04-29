export function getTextBlocks(res: any): any {
  let textBlocks: Array<Object> = [];
  let blockIndex = 0;
  res.pages.forEach((page: any) => {
    textBlocks = textBlocks.concat(
      page.blocks.map((block: any) => {
        return {
          blockIndex: blockIndex++,
          text: getBlockText(block),
          x: block.boundingBox.vertices[0].x,
          y: block.boundingBox.vertices[0].y,
        };
      })
    );
  });
  return textBlocks;
}

function getBlockText(block: any) {
  let result = "";
  block.paragraphs.forEach((paragraph: any) => {
    paragraph.words.forEach((word: any) => {
      word.symbols.forEach((symbol: any) => {
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
