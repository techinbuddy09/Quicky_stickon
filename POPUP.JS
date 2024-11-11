// Get references to HTML elements
const noteInput = document.getElementById('noteInput');
const saveButton = document.getElementById('saveNote');
const notesList = document.getElementById('notesList');

// Load notes on popup open
window.onload = () => {
  chrome.storage.local.get({ notes: [] }, (result) => {
    result.notes.forEach(note => addNoteToList(note));
  });
};

// Save note when button clicked
saveButton.addEventListener('click', () => {
  const noteText = noteInput.value;
  if (noteText) {
    chrome.storage.local.get({ notes: [] }, (result) => {
      const notes = result.notes;
      notes.push(noteText);
      chrome.storage.local.set({ notes });
      addNoteToList(noteText);
      noteInput.value = ''; // Clear input
    });
  }
});

// Helper function to add a note to the list with a delete button
function addNoteToList(noteText) {
  const listItem = document.createElement('li');
  listItem.textContent = noteText;

  // Create and add delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteNote(noteText, listItem));
  
  listItem.appendChild(deleteButton);
  notesList.appendChild(listItem);
}

// Delete note function
function deleteNote(noteText, listItem) {
  chrome.storage.local.get({ notes: [] }, (result) => {
    const updatedNotes = result.notes.filter(note => note !== noteText);
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      notesList.removeChild(listItem);
    });
  });
}
