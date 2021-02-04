const fs = require("fs");
const chalk = require("chalk");

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNotes = notes.find((note) => {   // ensure no duplicate titles
        note.title === title; 
    })

    if (duplicateNotes) {
        console.log(chalk.red.inverse("Note title already in use."));
    } else {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes);
        console.log(chalk.green.inverse('New note added!'));
    }
}

const removeNote = (title) => {
    const notes = loadNotes();
    const filteredNotes = notes.filter((note) => {
        return note.title !== title;
    })
    saveNotes(filteredNotes);
    if (filteredNotes.length === 0) {
        console.log(chalk.green.inverse("Removed " + title));
    } else console.log(chalk.red.inverse("No matching note found."));
}

const listNotes = () => {
    const notes = loadNotes();
    notes.forEach(note => {
        console.log(chalk.bold.green(note.title));
    })
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', dataJSON);
}

const loadNotes = () => {
    try {                                   // get parsed data from JSON
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {                           // if file doesn't exist, create empty array
        return [];
        console.log("No file found.");
    }
}

const readNote = (title) => {
    const notes = loadNotes();
    const returnNote = notes.find(note => note.title === title);
    if (returnNote) {
        console.log(chalk.green.bold(returnNote.title));
        console.log(returnNote.body);
    } else console.log(chalk.red.inverse("No matching note found."));
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
}