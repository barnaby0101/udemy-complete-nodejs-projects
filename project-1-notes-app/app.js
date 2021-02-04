const chalk = require("chalk");
const yargs = require("yargs");
const notes = require("./notes.js");

// set version number
yargs.version("1.1.0");

// define CLI commands
yargs.command({
    command: "add",
    describe: "Add a new note",             // reported by --help
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,             // parameter is required
            type: "string"
        },
        body: {
            describe: "Note body",
            demandOption: true,
            type: "string"
    }
    },
    handler(argv) { notes.addNote(argv.title, argv.body); }
})

yargs.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            describe: "Title of note to be deleted",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) { notes.removeNote(argv.title); }
})

yargs.command({
    command: "listNotes",
    describe: "List all notes",
    handler() { notes.listNotes(); }
})

yargs.command({
    command: "read",
    describe: "Read a note",
    builder: {
        title: {
            describe: "Title of note to read",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) { notes.readNote(argv.title); }
})

yargs.parse();      // parses yarg args without executing additional code