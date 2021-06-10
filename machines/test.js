import { createMachine, assign } from "xstate";
import { fetchTest } from "./api";

const flashcardMachine = createMachine(
  {
    id: "flashcard",
    initial: "loading",
    context: {
      currentIndex: 0,
      items: null,
    },
    states: {
      loading: {
        invoke: {
          src: fetchTest,
          onDone: [
            {
              target: "readyToListen",
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
      readyToListen: {
        on: {
          LISTEN: "idle",
        },
      },
      idle: {
        on: {
          CORRECT: {
            target: "correct",
            actions: [
              assign((context) => {
                return {
                  currentIndex: context.currentIndex + 1,
                };
              }),
              "playCorrectAudio",
            ],
          },
          WRONG: {
            target: "incorrect",
            actions: "playIncorrectAudio",
          },
        },
      },
      correct: {
        on: {
          NEXT: [
            {
              target: "complete",
              cond: "isOnLastCard",
            },
            "readyToListen",
          ],
        },
      },
      incorrect: {
        on: {
          NEXT: "idle",
        },
      },
      complete: {
        type: "final",
      },
      empty: { type: "final" },
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

export default flashcardMachine;
