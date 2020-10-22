import * as actions from "./actions";

import {
  CHANGE_SEARCHFIELD,
  REQUEST_ROBOTS_PENDING,
  REQUEST_ROBOTS_SUCCESS,
  REQUEST_ROBOTS_FAILED,
} from "./constants";

import configureStore from "redux-mock-store";
import thunkMiddleware from "redux-thunk";
import fetchMock from "fetch-mock";

const configureMockStore = configureStore([thunkMiddleware]);
const store = configureMockStore();

afterEach(() => {
  fetchMock.restore();
});

it("should create an action to search robots", () => {
  const text = "wooo";
  const expectedAction = {
    type: CHANGE_SEARCHFIELD,
    payload: text,
  };
  expect(actions.setSearchField(text)).toEqual(expectedAction);
});

it("handles requesting the robots API ", () => {
  const store = configureMockStore();
  store.dispatch(actions.requestRobots());
  const action = store.getActions();
  const expectedAction = {
    type: REQUEST_ROBOTS_PENDING,
  };
  expect(action[0]).toEqual(expectedAction);
});

it("handles successful requests to the robots API", () => {
  expect.assertions(1);

  fetchMock.getOnce("https://jsonplaceholder.typicode.com/users", {
    body: { data: [{ name: "Jim" }] },
    headers: { "content-type": "application/json" },
  });

  const expectedAction = [REQUEST_ROBOTS_PENDING, REQUEST_ROBOTS_SUCCESS];

  const store = configureMockStore();
  store.dispatch(actions.requestRobots()).then(() => {
    const actualActions = store.getActions().map((action) => action.type);
    expect(actualActions).toEqual(expectedAction);
  });
});

it("handles failed requests to the robots API", () => {
  expect.assertions(1);

  fetchMock.getOnce("https://jsonplaceholder.typicode.com/users", {
    throws: "Server not found",
  });

  const expectedAction = [REQUEST_ROBOTS_PENDING, REQUEST_ROBOTS_FAILED];

  const store = configureMockStore();
  store.dispatch(actions.requestRobots()).finally(() => {
    const actualActions = store.getActions().map((action) => action.type);
    expect(actualActions).toEqual(expectedAction);
  });
});
