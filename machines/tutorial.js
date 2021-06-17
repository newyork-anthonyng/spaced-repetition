import { createMachine, assign } from "xstate";
import { fetchTutorial, postListenTutorialItem } from "./api";

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
                const data = event.data;
                const hasTutorialItems = data.length > 0;

                return hasTutorialItems;
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
        entry: ['notifyListened'],
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
        entry: "onComplete",
      },
    },
  },
  {
    guards: {
      isOnLastCard: (context) => {
        return context.currentIndex === context.items.length;
      },
    },
    actions: {
      notifyListened: ({ currentIndex, items }) => {
        const currentTutorialItem = items[currentIndex];

        if (!currentTutorialItem) return;

        postListenTutorialItem(currentTutorialItem.id);
      }
    }
  }
);

export default tutorialMachine;
