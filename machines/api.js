// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = "https://1ecb9bf1de79.ngrok.io";

const TUTORIAL_URL = `${API_BASE_URL}/tutorial`;

export function fetchTutorial() {
  return fetch(TUTORIAL_URL).then((res) => res.json());
}
