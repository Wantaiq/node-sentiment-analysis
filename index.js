import fsPromise from 'node:fs/promises';
import fetch from 'node-fetch';

async function readFile(fileName) {
  try {
    const fileContent = await fsPromise.readFile(
      fileName,
      'utf-8',
      (err, data) => {
        if (err) {
          throw new Error();
        }
        return data;
      },
    );
    return fileContent;
  } catch {
    console.log('Oops something went wrong. Please check if there is a typo!');
  }
}

async function getAnalysis(text) {
  const options = {
    method: 'POST',
    body: `text=${text}`,
  };

  try {
    const response = await fetch(
      'http://text-processing.com/api/sentiment/',
      options,
    );
    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json();
    const probabilities = Object.values(data.probability).map((item) =>
      Math.round(item * 100),
    );
    const label = data.label;
    let summary;
    if (label === 'pos') {
      summary = 'Positive';
    } else if (label === 'neg') {
      summary = 'Negative';
    } else if (label === 'neutral') {
      summary = 'Neutral';
    }
    const msg = `Your text has following sentiment:
    ${probabilities[0]}% negative
    ${probabilities[1]}% positive
    ${probabilities[2]}% neutral
    Overall: ${summary}`;
    console.log(msg);
  } catch (err) {
    console.log('Oops something went wrong. Please check if there is a typo!');
  }
}

function checkRequest(file, analysis) {
  let userInput = process.argv.slice(2).join(' ');
  if (userInput.endsWith('.txt')) {
    userInput = file(userInput);
  }

  analysis(userInput);
}

checkRequest(readFile, getAnalysis);
