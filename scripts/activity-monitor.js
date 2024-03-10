import childProcess from 'child_process';
import fs from 'fs';
import process from 'process';
import os from 'os';

const LINUX_OS = 'Linux';
const MAC_OS = 'Darwin';
const WINDOWS_OS = 'Windows_NT';

const CommandMap = {
  [LINUX_OS]: "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1 | tr -d '\n'",
  [MAC_OS]: "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1 | tr -d '\n'",
  [WINDOWS_OS]: "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }",
};

const WINDOWS_SHELL = 'powershell.exe';

function runActivityLog(osType) {
  const command = CommandMap[osType];
  let logData = '';

  setInterval(
    () => {
      execProcess(command, osType, (data) => {
        logData = `${logData} ${Date.now()} : ${data}\n`;
      });
    },
    100,
  ); // execute command ten times per second

  setInterval(
    () => {
      updateLog('activity-monitor.log', logData);
      logData = '';
    },
    60000,
  ); // log output to file once per minute
};

function execProcess(command, osType, cb) {
  const controller = new AbortController();
  const options = {
    signal: controller.signal,
  };

  if (osType === WINDOWS_OS) {
    options.shell = WINDOWS_SHELL;
  }

  childProcess.exec(command, options, (error, stdout, stderr) => {
    const data = stdout.length > process.stdout.columns
      ? `${stdout.slice(0, process.stdout.columns - 3)}...`
      : stdout; // always display in one row
    process.stdout.clearLine();
    process.stdout.write(`\r${data.trim()}`);

    cb(data);

    controller.abort();
  });
};

function updateLog(fileName, data) {
  fs.appendFile(fileName, data, 'utf8', (err) => {
    if (err) throw err;
  });
};

runActivityLog(os.type());
