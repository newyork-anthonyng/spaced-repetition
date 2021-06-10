export const API_BASE_URL = "https://infinite-spire-97087.herokuapp.com";

const TUTORIAL_URL = `${API_BASE_URL}/tutorial`;
const TEST_URL = `${API_BASE_URL}/test`;

export function fetchTutorial() {
  return fetch(TUTORIAL_URL).then((res) => res.json());
}

export function fetchTest() {
  return fetch(TEST_URL).then((res) => res.json());
}
