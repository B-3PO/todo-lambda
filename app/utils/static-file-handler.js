const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const typeMap = {
  // see https://www.iana.org/assignments/media-types/media-types.xhtml
  html: 'text/html',
  md: 'text/markdown',
  css: 'text/css',
  js: 'application/javascript',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
  zip: 'application/zip',
  pdf: 'application/pdf',
  mp4: 'audio/mpeg',
  m4a: 'audio/mpeg',
  ico: 'image/x-icon',
  woff2: 'application/font-woff2; charset=utf-8',
  woff: 'application/font-woff; charset=utf-8',
  ttf: 'application/font-sfnt',
  otf: 'application/font-sfnt'
};

const binaryTypes = [
  typeMap.png,
  typeMap.jpg,
  typeMap.jpeg,
  typeMap.gif,
  typeMap.zip,
  typeMap.pdf,
  typeMap.mp4,
  typeMap.m4a,
  typeMap.ico,
  typeMap.woff2,
  typeMap.woff,
  typeMap.ttf,
  typeMap.otf
];

class StaticFileHandler {
  constructor(clientFilesPath, errorPagePath = 'error.html') {
    if (clientFilesPath == null || clientFilesPath.length === 0) throw new Error('clientFilesPath must be specified');
    this.clientFilesPath = clientFilesPath;
    this.errorPagePath = errorPagePath;
  }

  getMimeType(filePath) {
    const parts = filePath.split('.');
    let mimeType = '';
    if (parts.length > 0) {
      const extension = parts[parts.length - 1];
      if (typeMap[extension]) mimeType = typeMap[extension];
      else mimeType = 'application/octet-stream';
    }
    return mimeType;
  }

  isBinaryType(mimeType) {
    return binaryTypes.indexOf(mimeType) >= 0;
  }

  async get(event) {
    if (!event) throw new Error('event object not specified.');
    if (!('path' in event)) throw new Error('No path.');
    if (!event.path) throw new Error('Empty path.');

    let requestPath = event.path.replace('/docs', '/');

    if (typeof requestPath === 'object') {
      const propNames = Object.keys(requestPath);
      if (propNames.length > 1) throw Error('expected only a single property name, but found', propNames.join(','));
      requestPath = `${propNames[0]}/${requestPath[propNames[0]]}`;
    } else if (typeof requestPath !== 'string') throw Error('expected path to be string');

    const filePath = path.join(this.clientFilesPath, requestPath);
    return this.readFileAsResponse(filePath);
  }

  readFileAsResponse(filePath, statusCode = 200) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, stream) => {
        if (err) return reject(err);

        const mimeType = this.getMimeType(filePath);
        if (!mimeType) throw new Error(`Unrecognized MIME type for file ${filePath}`);

        if (this.isBinaryType(mimeType)) return Buffer.from(stream).toString('base64');
        const body = stream.toString('utf8');
        resolve({
          statusCode,
          headers: {
            'Content-Type': mimeType
          },
          body
        });
      });
    });
  }


  responseAsError(errorText, statusCode = 400) {
    return Promise.try(() => {
      logger.info('responseAsError:', errorText);
      const filePath = path.join(this.clientFilesPath, this.errorPagePath);
      return this.readFileAsResponse(filePath, statusCode);
    }).catch(err => {
      throw err;
    });
  }
}

module.exports = StaticFileHandler;
