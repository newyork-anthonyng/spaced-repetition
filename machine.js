import { createMachine, assign } from 'xstate';

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
  initial: 'readyToListen',
  context: {
    currentIndex: 0,
    items: [
      {
        audio: require('./assets/audio/words/box.m4a'),
        answer: 'Box',
        choices: shuffle([
          'Box',
          'Day',
          'No',
          'Pig'
        ]),
      },
      {
        audio: require('./assets/audio/words/day.m4a'),
        answer: 'Day',
        choices: shuffle([
          'Day',
          'Box',
          'No',
          'Pig'
        ])
      },
      {
        audio: require('./assets/audio/words/no.m4a'),
        answer: 'No',
        choices: shuffle([
          'No',
          'Day',
          'Pig',
          'Box'
        ])
      },
      {
        audio: require('./assets/audio/words/pig.m4a'),
        answer: 'Pig',
        choices: shuffle([
          'Pig',
          'No',
          'Toy',
          'Box'
        ])
      },
      {
        audio: require('./assets/audio/words/toy.m4a'),
        answer: 'Toy',
        choices: shuffle([
          'Toy',
          'And',
          'Box',
          'Pig'
        ])
      },
    ]
  },
  states: {
    readyToListen: {
      on: {
        LISTEN: 'idle'
      }
    },
    idle: {
      on: {
        CORRECT: {
          target: 'correct',
          actions: [
            assign((context) => {
              return {
                currentIndex: context.currentIndex + 1
              };
            }),
            'playCorrectAudio'
          ]
        },
        WRONG: {
          target: 'incorrect',
          actions: 'playIncorrectAudio'
        }
      }
    },
    correct: {
      on: {
        NEXT: [
          {
            target: 'complete',
            cond: 'isOnLastCard'
          },
          'readyToListen'
        ]
      }
    },
    incorrect: {
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
