for (const version in start.versions) {
  const versions = start.versions;
  if (Object.prototype.hasOwnProperty.call(versions, version)) {
    const element = versions[version];
    console.log(`${version}: ${element()}`);
  }
}
/*
import { readFile } from 'node:fs/promises';

const data = await readFile('./index.html', 'utf-8');
console.log(data); */

const response = await window.start.handlers.ping();
console.log(response);

