import fetch from 'node-fetch';

async function getAnalysis() {
  try {
    const userInput = process.argv.slice(2).join(' ');
    const options = {
      method: 'POST',
      body: 'text=' + userInput,
      'Content-Type': 'text/plain',
    };
    const response = await fetch(
      'http://text-processing.com/api/sentiment/',
      options,
    );
    if (!response.ok) {
      throw new Error(response.status);
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
    } else {
      summary = 'Neutral';
    }
    // msg to print
    const msg = `Your text has the following sentiment:
    ${probabilities[0]}% negative
    ${probabilities[1]}% neutral
    ${probabilities[2]}% positive
    Overall: ${summary}`;

    console.log(msg);
    console.log(userInput);
  } catch (err) {
    console.log(
      `Wou could not analyze your data. Please check for typos. Status code : ${err}`,
    );
  }
}

getAnalysis().catch('');
