const fs = require('fs');

function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

const origMkdirSync = fs.mkdirSync;
fs.mkdirSync = function(path, options) {
  for (let i = 0; i < 10; i++) {
    try {
      return origMkdirSync.call(fs, path, options);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'EACCES') && i < 9) {
        sleepSync(30);
        continue;
      }
      throw err;
    }
  }
};

const origMkdir = fs.mkdir;
fs.mkdir = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  let attempts = 0;
  function attempt() {
    origMkdir.call(fs, path, options, (err) => {
      if (err && (err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'EACCES') && attempts < 10) {
        attempts++;
        setTimeout(attempt, 30);
      } else if (callback) {
        callback(err);
      }
    });
  }
  attempt();
};

if (fs.promises && fs.promises.mkdir) {
  const origPromisesMkdir = fs.promises.mkdir;
  fs.promises.mkdir = async function(path, options) {
    for (let i = 0; i < 10; i++) {
      try {
        return await origPromisesMkdir.call(fs.promises, path, options);
      } catch (err) {
        if ((err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'EACCES') && i < 9) {
          await new Promise(r => setTimeout(r, 30));
          continue;
        }
        throw err;
      }
    }
  };
}
