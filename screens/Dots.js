import React from "react";
import { View, Text, Pressable } from "react-native";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import CorrectImage from "../components/CorrectImage";
import IncorrectImage from "../components/IncorrectImage";
import CompletedScreen from "../components/CompletedScreen";

const testData = [
  { correct: 1, choices: [2, 1] },
  { correct: 5, choices: [3, 5] },
  { correct: 4, choices: [5, 4] },
  { correct: 2, choices: [2, 4] },
];

const machine = createMachine(
  {
    id: "dots",
    initial: "loading",
    context: {
      currentIndex: 0,
      items: testData,
    },
    states: {
      loading: {
        on: {
          "": "ready",
        },
      },
      ready: {
        on: {
          CORRECT: {
            target: "correct",
            actions: [
              assign((context) => {
                return {
                  currentIndex: context.currentIndex + 1,
                };
              }),
            ],
          },
          WRONG: {
            target: "incorrect",
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
            "ready",
          ],
        },
      },
      incorrect: {
        on: {
          NEXT: "ready",
        },
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

function DotCard({ count, color, onPress }) {
  const countArray = new Array(count).fill(undefined);

  function handlePress() {
    onPress(count);
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{
        shadowOffset: {
          width: 8,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: "white",
        borderRadius: 25,
        marginBottom: 25,
        padding: 30,
      }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexDirection: "row",
        }}
      >
        {countArray.map((_, index) => {
          return <Circle key={index} color={color} />;
        })}
      </View>
    </Pressable>
  );
}

function Circle({ color }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color,
      }}
    />
  );
}

function Dots() {
  const [state, send] = useMachine(machine);

  const { context } = state;
  const { currentIndex, items } = context;
  const currentItem = items[currentIndex] || {
    correct: undefined,
    choices: [],
  };
  const rightAnswer = currentItem.correct;
  const [choice1, choice2] = currentItem.choices;

  function handleDotPress(number) {
    return () => {
      const isCorrect = number === rightAnswer;
      if (isCorrect) {
        send("CORRECT");
      } else {
        send("WRONG");
      }
    };
  }

  function handleCorrectImageAnimationEnd() {
    send("NEXT");
  }

  function handleIncorrectImageAnimationEnd() {
    send("NEXT");
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 10,
        right: 0,
        left: 0,
        bottom: 0,
        display: "flex",
      }}
    >
      {state.matches("complete") && (
        <View style={{ position: "fixed" }}>
          <CompletedScreen />
        </View>
      )}
      {state.matches("ready") && (
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View style={{ padding: 16 }}>
              <DotCard
                count={choice1}
                color="red"
                onPress={handleDotPress(choice1)}
              />
            </View>

            <View style={{ padding: 16 }}>
              <DotCard
                count={choice2}
                color="blue"
                onPress={handleDotPress(choice2)}
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <View
              style={{
                textAlign: "center",
                shadowOffset: {
                  width: 8,
                  height: 8,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 15,
                width: 125,
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  textAlign: "center",
                }}
              >
                {rightAnswer}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View
        style={{
          position: "fixed",
          left: "50%",
        }}
      >
        {state.matches("correct") && (
          <CorrectImage onEnd={handleCorrectImageAnimationEnd} />
        )}
        {state.matches("incorrect") && (
          <IncorrectImage onEnd={handleIncorrectImageAnimationEnd} />
        )}
      </View>
    </View>
  );
}

export default Dots;
