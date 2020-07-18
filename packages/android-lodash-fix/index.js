var fs = require('fs');
var replace = require('replace-in-file');
var Debug = require('debug');

var logPath = Debug('path');
var logDir = Debug('dir');
var logLodash = Debug('lodash');
var logReplace = Debug('replace');
var logRename = Debug('rename');

var dir = process.cwd();

// find breacked with lodash

var directories = [{ path: dir }];
var breaked = [];

var scanPath = (dir, name) => {
  var path = dir + '/' + name;
  var stat = fs.statSync(path);
  var isDir = stat.isDirectory();
  logPath(path, isDir ? 'dir' : 'file');
  if (isDir) directories.push({ name, path });
  if (name.indexOf('_') !== -1 && name.indexOf('dll_') === -1) {
    logLodash(path, isDir ? 'dir' : 'file');
    breaked.push({ name, path, isDir, stat, dir });
  }
  if (isDir) scanDir(path);
};

var scanDir = (dir) => {
  logDir(dir);
  var names = fs.readdirSync(dir);
  for (var n = 0; n < names.length; n++) scanPath(dir, names[n]);
};

scanDir(dir);

// find all filed with current file

var replaceAll = () => {
  var files = directories.map(dir => dir.path + '/*');
  for (var b = 0; b < breaked.length; b++) {
    var name = breaked[b].name;
    var newName = breaked[b].name.replace(/_/g, 'androidfix');
    if (!breaked[b].isDir) {
      name = name.split('.').slice(0, -1).join('.');
      newName = newName.split('.').slice(0, -1).join('.');
    }
    logReplace(name, newName);
    replace.sync({
      files,
      from: () => new RegExp(name, 'g'),
      to: newName,
    });
  }
  for (var b = breaked.length - 1; b >= 0; b--) {
    var name = breaked[b].name;
    var newName = breaked[b].name.replace(/_/g, 'androidfix');
    logRename(name, newName);
    fs.renameSync(breaked[b].path, breaked[b].dir + '/' + newName);
  }
};

replaceAll();
