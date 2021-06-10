import { createMachine, assign } from "xstate";
import { fetchTutorial } from "./api";

const tutorialMachine = createMachine(
  {
    id: "tutorial",
    initial: "loading",
    context: {
      currentIndex: 0,
      items: null,
    },
    states: {
      loading: {
        invoke: {
          src: fetchTutorial,
          onDone: [
            {
              target: "ready",
              actions: assign((_context, event) => {
                return {
                  items: event.data.data,
                };
              }),
              cond: (_context, event) => {
                const validationResponse = event.data;
                if (validationResponse) {
                  return true;
                } else {
                  return false;
                }
              },
            },
            {
              target: "empty",
            },
          ],
        },
      },
      ready: {
        on: {
          listen: "listened",
        },
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
        entry: "onComplete",
      },
      empty: {
        type: "final",
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
