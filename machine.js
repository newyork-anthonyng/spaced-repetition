import { createMachine, assign } from 'xstate';
//
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


const flashcardMachine = createMachine({
  id: 'flashcard',
  initial: 'idle',
  context: {
    currentIndex: 0,
    items: [
      {
        audio: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
        answer: 'Dinosaur',
        choices: shuffle([
          'Dog',
          'Donkey',
          'Daisy',
          'Dinosaur'
        ]),
      },
      {
        audio: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
        answer: 'Dinosaur',
        choices: shuffle([
          'Date',
          'Dowel',
          'Dooo',
          'Dinosaur'
        ])
      },
    ]
  },
  states: {
    idle: {
      on: {
        CORRECT: {
          target: 'success',
          actions: assign((context) => {
            return {
              currentIndex: context.currentIndex + 1
            };
          })
        },
        WRONG: 'failure'
      }
    },
    success: {
      on: {
        NEXT: [
          {
            target: 'complete',
            cond: 'isOnLastCard'
          },
          'idle'
        ]
      }
    },
    failure: {
      on: {
        NEXT: 'idle'
      }
    },
    complete: {
      type: 'final'
    }
  }
}, {
  guards: {
    isOnLastCard: (context) => {
      return context.currentIndex === context.items.length;
    }
  }
});

export default flashcardMachine;
