import { createMachine, assign } from "xstate";

const tutorialMachine = createMachine(
  {
    id: "tutorial",
    initial: "ready",
    context: {
      currentIndex: 0,
      items: [
        {
          audio: require("./assets/audio/words/book.m4a"),
          text: "Book",
        },
        {
          audio: require("./assets/audio/words/people.m4a"),
          text: "People",
        },
        {
          audio: require("./assets/audio/words/some.m4a"),
          text: "Some",
        },
        {
          audio: require("./assets/audio/words/which.m4a"),
          text: "Which",
        },
        {
          audio: require("./assets/audio/words/your.m4a"),
          text: "Your",
        },
      ],
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
