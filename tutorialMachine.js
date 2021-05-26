import { createMachine, assign } from "xstate";

const tutorialMachine = createMachine(
  {
    id: "tutorial",
    initial: "ready",
    context: {
      currentIndex: 0,
      items: [
        {
          audio: require("./assets/audio/box.m4a"),
          text: "Box",
        },
        {
          audio: require("./assets/audio/day.m4a"),
          text: "Day",
        },
        {
          audio: require("./assets/audio/no.m4a"),
          text: "No",
        },
        {
          audio: require("./assets/audio/pig.m4a"),
          text: "Pig",
        },
        {
          audio: require("./assets/audio/toy.m4a"),
          text: "Toy",
        },
      ],
    },
    states: {
      ready: {
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
