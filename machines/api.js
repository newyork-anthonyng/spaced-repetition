export const API_BASE_URL = "https://infinite-spire-97087.herokuapp.com";

const TUTORIAL_URL = `${API_BASE_URL}/tutorial`;
const TEST_URL = `${API_BASE_URL}/test`;
const LISTEN_TUTORIAL_ITEM_URL = `${API_BASE_URL}/tutorial/learn`;
const PROMOTE_TEST_ITEM_URL = `${API_BASE_URL}/test/promote`;
const DEMOTE_TEST_ITEM_URL = `${API_BASE_URL}/test/demote`;

export function fetchTutorial() {
  return fetch(TUTORIAL_URL).then((res) => res.json());
}

export function fetchTest() {
  return fetch(TEST_URL).then((res) => res.json());
}

export function postListenTutorialItem(id) {
  return fetch(
    LISTEN_TUTORIAL_ITEM_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    }).then((res) => res.json());
}

export function postPromoteTestItem(id) {
  return fetch(
    PROMOTE_TEST_ITEM_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    }
  ).then((res) => res.json());
}

export function postDemoteTestItem(id) {
  return fetch(
    DEMOTE_TEST_ITEM_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    }
  ).then((res) => res.json());
}
