import { createMachine, assign } from "xstate";
import { tutorialData } from './testData';

const tutorialMachine = createMachine(
  {
    id: "tutorial",
    initial: "ready",
    context: {
      currentIndex: 0,
      items: tutorialData
    },
    states: {
      ready: {
        on: {
          listen: "listened"
        }
      },
      listened: {
        exit: assign((context) => {
          return {
            currentIndex: context.currentIndex + 1,
          };
        }),
        on: {
          next: "processing",
        },
      },
      processing: {
        always: [
          {
            cond: "isOnLastCard",
            target: "complete",
          },
          "ready",
        ],
      },
      complete: {
        type: "final",
        entry: "onComplete"
      },
    },
  },
  {
    guards: {
      isOnLastCard: (context) => {
        return context.currentIndex === context.items.length;
      },
    },
  }
);

export default tutorialMachine;
