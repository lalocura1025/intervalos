document.addEventListener('DOMContentLoaded', () => {
    // Aliases for VexFlow classes
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

    // Get references to HTML elements
    const staffDiv = document.getElementById("staff");
    const feedbackEl = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");
    const buttonsContainer = document.getElementById('buttons-container');

    // --- Music Theory Definitions ---

    const noteValues = { 'c': 0, 'c#': 1, 'd': 2, 'd#': 3, 'e': 4, 'f': 5, 'f#': 6, 'g': 7, 'g#': 8, 'a': 9, 'a#': 10, 'b': 11 };
    const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

    const intervals = [
        { name: "2da Menor", semitones: 1 },
        { name: "2da Mayor", semitones: 2 },
        { name: "3ra Menor", semitones: 3 },
        { name: "3ra Mayor", semitones: 4 },
        { name: "4ta Justa", semitones: 5 },
        { name: "Tritono", semitones: 6 },
        { name: "5ta Justa", semitones: 7 },
        { name: "6ta Mayor", semitones: 9 },
        { name: "7ma Mayor", semitones: 11 },
        { name: "8va Justa", semitones: 12 },
    ];

    const baseNotes = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4'];
    let currentCorrectInterval = null;
    let answered = false; // To prevent multiple answers for one interval

    // --- Core Functions ---

    function drawInterval(notesToDraw) {
        staffDiv.innerHTML = '';
        const renderer = new Renderer(staffDiv, Renderer.Backends.SVG);
        renderer.resize(400, 150);
        const context = renderer.getContext();
        const stave = new Stave(20, 40, 360);
        stave.addClef("treble").setContext(context).draw();
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notesToDraw);
        new Formatter().joinVoices([voice]).format([voice], 300);
        voice.draw(context, stave);
    }

    function generateAndDrawRandomInterval() {
        answered = false;
        const firstNoteName = baseNotes[Math.floor(Math.random() * baseNotes.length)];
        const interval = intervals[Math.floor(Math.random() * intervals.length)];
        currentCorrectInterval = interval;

        const [firstNotePitch, firstNoteOctaveStr] = firstNoteName.split('/');
        const firstNoteOctave = parseInt(firstNoteOctaveStr, 10);
        const firstNoteValue = noteValues[firstNotePitch] + firstNoteOctave * 12;
        const secondNoteValue = firstNoteValue + interval.semitones;
        const secondNoteOctave = Math.floor(secondNoteValue / 12);
        const secondNotePitchName = noteNames[secondNoteValue % 12];
        const secondNoteKey = `${secondNotePitchName.replace('#', '')}/${secondNoteOctave}`;

        const notes = [
            new StaveNote({ keys: [firstNoteName], duration: "h" }),
            new StaveNote({ keys: [secondNoteKey], duration: "h" })
        ];

        if (secondNotePitchName.includes('#')) {
            notes[1].addAccidental(0, new Accidental("#"));
        }

        drawInterval(notes);
        feedbackEl.textContent = "Selecciona el intervalo correcto.";
        feedbackEl.style.color = 'black';
        buttonsContainer.style.pointerEvents = 'auto'; // Re-enable buttons
    }

    // --- UI Functions ---

    function populateAnswerButtons() {
        buttonsContainer.innerHTML = '';
        intervals.forEach(interval => {
            const button = document.createElement('button');
            button.textContent = interval.name;
            button.dataset.intervalName = interval.name;
            buttonsContainer.appendChild(button);
        });
    }

    function handleAnswerClick(e) {
        if (e.target.tagName !== 'BUTTON' || answered) return;

        answered = true; // Mark as answered
        buttonsContainer.style.pointerEvents = 'none'; // Disable buttons after answering

        const selectedIntervalName = e.target.dataset.intervalName;
        if (selectedIntervalName === currentCorrectInterval.name) {
            feedbackEl.textContent = "¡Correcto!";
            feedbackEl.style.color = 'green';
        } else {
            feedbackEl.textContent = `Incorrecto. La respuesta era ${currentCorrectInterval.name}.`;
            feedbackEl.style.color = 'red';
        }
    }

    function handleNextButtonClick() {
        generateAndDrawRandomInterval();
    }

    // --- Event Listeners and Initial Setup ---

    buttonsContainer.addEventListener('click', handleAnswerClick);
    nextButton.addEventListener('click', handleNextButtonClick);

    populateAnswerButtons();
    generateAndDrawRandomInterval();
});
