import { createMachine, assign } from 'xstate';

const flashcardMachine = createMachine({
  id: 'flashcard',
  initial: 'idle',
  context: {
    currentIndex: 0,
    items: [
      {
        choices: [
          'Car',
          'Cat',
          'Cow'
        ]
      },
      {
        choices: [
          'Date',
          'Dowel',
          'Dooo'
        ]
      },
      {
        choices: [
          'Eck',
          'Eagle',
          'Elephant'
        ]
      }
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
