import { finished } from 'stream/promises';
import fs from 'fs';
import path from 'path';
import events from 'events';
import readline from 'readline/promises';

function prepareTxtFile() {
  if (!fs.existsSync('./txt/m3-t3-data.txt')) {
    fs.mkdirSync(path.resolve('./txt'));
    fs.writeFileSync(path.resolve('./txt/m3-t3-data.txt'), '');
  }
}

async function parseCsvFile(readable, writable) {
  const rl = readline.createInterface({ input: readable });
  let headers = [];

  for await (const line of rl) {
    if (!headers.length) {
      headers = transformHeaders(line);
    } else {
      const transformed = transformRow(line, headers);

      if (!writable.write(`${JSON.stringify(transformed)}\n`)) {
        await events.once(writable, 'drain');
      }
    }
  }

  writable.end(); // close stream

  await finished(readable) // notify when a stream is no longer readable/writable or has experienced an error or a premature close event
    .finally(() => {
      console.log('Readable stream is done reading.');
    })
    .catch((err) => {
      console.error('Readable stream failed.', err);
    });

  await finished(writable) // notify when a stream is no longer readable/writable or has experienced an error or a premature close event
    .finally(() => {
      console.log('Writable stream is done writing.');
    })
    .catch((err) => {
      console.error('Writable stream failed.', err);
    });
}

function transformHeaders(line) {
  return line.split(',');
}

function transformRow(line, headers) {
  return line.split(',').reduce((acc, value, index) => {
    acc[headers[index]] = value;
    return acc;
  }, {});
}

prepareTxtFile();

try {
  const readable = fs.createReadStream(path.resolve('./csv/m3-t3-data.csv'));
  const writable = fs.createWriteStream(path.resolve('./txt/m3-t3-data.txt'));
  await parseCsvFile(readable, writable);
} catch (err) {
  if (err) {
    console.error(err);
  }
}
