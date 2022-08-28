const fs = require("fs");
const download = require("download");
const homeDir = require("home-dir");
const CZRC = require("./CZRC");

const read = (file) => fs.readFileSync(file, "utf8");
const write = fs.writeFileSync;
const rc_folder_name = homeDir(".czrc.d");
const deafult_rc_file = rc_folder_name + "/default.json";
const project_rc_url_file_name = ".czrc.url";
const project_rc_file_name = ".czrc.json";
const default_file_hosted_url = "https://raw.githubusercontent.com/ShafiqIslam/dotfiles/master/git/.czrc.json";

function CZRCLoader() {
  this.czrc = new CZRC();
}

CZRCLoader.prototype.load = async function () {
  ensureRCFolder();
  await this.loadDefaultRC();
  await this.overwriteFromProject();
  return this.czrc;
};

CZRCLoader.prototype.loadDefaultRC = async function () {
  await this.ensureAndLoadFile(deafult_rc_file, default_file_hosted_url);
};

CZRCLoader.prototype.ensureAndLoadFile = async function (file_fqn, file_url) {
  await ensureFile(file_fqn, file_url);
  this.loadFromFile(file_fqn);
};

CZRCLoader.prototype.loadFromFile = function (file) {
  let czrc = read(file);
  czrc = (czrc && JSON.parse(czrc)) || null;

  if (czrc === null) return;

  czrc.issueTrackers = czrc.issue_trackers;
  czrc.defaultIssueTracker = czrc.default_issue_tracker;
  czrc.subjectMaxLength = czrc.subject_max_length;
  czrc.bodyMaxLength = czrc.body_max_length;
  czrc.sectionHeaders = czrc.section_headers;
  czrc.inlineSeparator = czrc.inline_separator;
  czrc.issueTrackerIdSeparator = czrc.issue_tracker_id_separator;
  czrc.authorEmailTag = czrc.author_email_tag;
  czrc.blockNonImperativeSubject = czrc.block_non_imperative_subject;

  this.czrc.overwrite(czrc);
  this.czrc.pushExtraImperativeVerbs(czrc.extra_imperative_verbs);
};

CZRCLoader.prototype.overwriteFromProject = async function () {
  await this.loadFromProjectURL();
  this.loadFromProjectRC();
};

CZRCLoader.prototype.loadFromProjectURL = async function () {
  let urlFile = process.cwd() + "/" + project_rc_url_file_name;

  if (!fs.existsSync(urlFile)) return;

  await this.ensureAndLoadFile(getProjectRCDownloadFileFQN(), getUrlFromFile(urlFile));
};

CZRCLoader.prototype.loadFromProjectRC = function () {
  let project_rc_file_fqn = process.cwd() + "/" + project_rc_file_name;

  if (!fs.existsSync(project_rc_file_fqn)) return;

  this.loadFromFile(project_rc_file_fqn);
};

function ensureRCFolder() {
  if (!fs.existsSync(rc_folder_name)) {
    createRCFolder();
    return;
  }

  if (fs.lstatSync(rc_folder_name).isDirectory()) return;

  fs.unlinkSync(rc_folder_name);
  createRCFolder();
}

function createRCFolder() {
  fs.mkdirSync(rc_folder_name, { recursive: true });
}

async function ensureFile(file_fqn, file_url) {
  let _download = (async () => {
    write(file_fqn, await download(file_url));
  })();

  if (fs.existsSync(file_fqn)) {
    _download.catch(function (e) {
      console.error(e);
    });
  } else {
    await _download;
  }
}

function getUrlFromFile(urlFile) {
  return read(urlFile)
    .trim()
    .split(/(?:\r\n|\r|\n)/g)[1]
    .replace("URL=", "");
}

function getProjectRCDownloadFileFQN() {
  return rc_folder_name + "/" + process.cwd().replace("/", "").replaceAll("/", "_").replaceAll("-", "_") + ".json";
}

module.exports = CZRCLoader;
