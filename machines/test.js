import { createMachine, assign } from 'xstate';
import { testData } from './testData';

const flashcardMachine = createMachine({
  id: 'flashcard',
  initial: 'readyToListen',
  context: {
    currentIndex: 0,
    items: testData
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
