'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadZip = downloadZip;
exports.unzipFile = unzipFile;
exports.getDirStat = getDirStat;
exports.getFileTree = getFileTree;
exports.loadZipFiles = loadZipFiles;
exports.default = {
  // load json
  load: function assetLoader(path, callback, error_callback) {
    var self = this;
    if (path.includes('.zip')) {
      // eslint-disable-next-line no-use-before-define
      return loadZipFiles(path).then(function (_ref) {
        var data = _ref.data,
            tempDir = _ref.tempDir;

        self.path = tempDir;
        callback(data);
      });
    }
    wx.request({
      url: path,
      success: function success(res) {
        callback(res.data);
      },
      fail: function fail(err) {
        if (typeof error_callback !== 'function') return;
        error_callback(err);
      }
    });
  }
};


var fs = wx.getFileSystemManager();

function downloadZip(url) {
  return new Promise(function (resolve) {
    wx.downloadFile({
      url: url,
      success: function success(res) {
        console.log('downloadZip', res);
        resolve(res.tempFilePath);
      }
    });
  });
}

function unzipFile(tempFilePath) {
  var targetPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : wx.env.USER_DATA_PATH + '/tmp-unzip';

  return new Promise(function (resolve) {
    try {
      fs.rmdirSync(targetPath, true);
    } catch (error) {
      // ignore
    }
    fs.unzip({
      targetPath: targetPath,
      zipFilePath: tempFilePath,
      success: function success(res) {
        console.log('unzipFile', res);
        resolve({
          targetPath: targetPath
        });
      },
      fail: function fail(err) {
        console.error('unzipFile', err);
      }
    });
  });
}

function getDirStat(dir) {
  return fs.statSync(dir);
}

function getFileTree(dir) {
  var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    var filePath = dir + '/' + file;
    var Stats = getDirStat(filePath);
    var isDir = Stats.isDirectory();

    if (isDir) {
      tree[file] = getFileTree(filePath);
    } else {
      tree[file] = filePath;
    }
  });
  return tree;
}

function loadZipFiles(url) {
  var tempDir = '';
  return downloadZip(url).then(function (tempFilePath) {
    return unzipFile(tempFilePath);
  }).then(function (_ref2) {
    var targetPath = _ref2.targetPath;

    tempDir = targetPath + '/';
    var tree = getFileTree(targetPath);
    var keys = Object.keys(tree);
    var dataJsonPath = keys.find(function (key) {
      return key.endsWith('.json');
    });
    if (!dataJsonPath) return;
    return {
      tempDir: tempDir,
      data: JSON.parse(fs.readFileSync(tree[dataJsonPath], 'utf-8') || '{}')
    };
  });
}