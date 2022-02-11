/**
 * Image converter for instagram.
 */

import path from "path";
import fs from "fs";
import jimp from "jimp";
import parser from "./lib/argument-parser.mjs";

/**
 * @param {string} path
 * @returns {boolean}
 */
const isImagePath = (path) =>
  /.*\.(jpg|jpeg|png|tif|tiff)$/.test(path.toLowerCase());

/**
 * @param {string} imageDirPath
 * @returns {string[]}
 */
const getImagePaths = (imageDirPath) => {
  const resolvedPath = path.resolve(imageDirPath);
  const anyFiles = fs.readdirSync(resolvedPath);
  const imageFiles = anyFiles.filter(isImagePath);
  return imageFiles.map((imageFile) => path.resolve(imageDirPath, imageFile));
};

// main

/**
 * parsed arguments.
 * @type {{input: string, output: string}}
 */
const options = parser.parse(process.argv);

const imagePaths = getImagePaths(options.input);

const promises = imagePaths.map(async (imagePath) => {
  const image = await jimp.read(imagePath);
  const originalImage = await jimp.read(imagePath);

  const width = originalImage.getWidth();
  const height = originalImage.getHeight();
  const longSide = width > height ? width : height;

  await image.cover(
    longSide,
    longSide,
    jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
  );
  await image.blur(100);
  await image.blit(
    originalImage,
    (longSide - width) / 2,
    (longSide - height) / 2
  );

  const outputFilePath = path.resolve(options.output, path.basename(imagePath));
  await image.write(outputFilePath);

  console.log(`done: ${outputFilePath}`);
  return outputFilePath;
});

const values = await Promise.all(promises);
console.log(values);
console.log("complete all!!");
