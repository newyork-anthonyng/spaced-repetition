import { createMachine, assign } from "xstate";
import { fetchTest, postPromoteTestItem, postDemoteTestItem } from "./api";

const flashcardMachine = createMachine(
  {
    id: "flashcard",
    initial: "loading",
    context: {
      currentIndex: 0,
      items: null,
      isWrong: false
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
        entry: assign({
          isWrong: false
        }),
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
              "notifyCorrect",
            ],
          },
          WRONG: {
            target: "incorrect",
            actions: [
              "playIncorrectAudio",
              assign({ isWrong: true }),
              "notifyIncorrect"
            ]
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
    actions: {
      notifyCorrect: ({ isWrong, currentIndex, items }) => {
        if (isWrong) return;

        const currentItem = items[currentIndex];

        if (!currentItem) return;

        postPromoteTestItem(currentItem.id);
      },
      notifyIncorrect: ({ currentIndex, items }) => {
        const currentItem = items[currentIndex];

        if (!currentItem) return;

        postDemoteTestItem(currentItem.id);
      }
    }
  }
);

export default flashcardMachine;
