import test from 'node:test';
import assert from 'node:assert/strict';
import { countCharacterFrequency, processUserData } from './logic-assessment.js';

test('countCharacterFrequency counts letters case-insensitively', () => {
  assert.deepEqual(countCharacterFrequency('Hello, World! 123'), {
    h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1,
  });
});

test('countCharacterFrequency supports Unicode and empty input', () => {
  assert.deepEqual(countCharacterFrequency('Été'), { é: 2, t: 1 });
  assert.deepEqual(countCharacterFrequency('123 !'), {});
  assert.deepEqual(countCharacterFrequency(null), {});
});

test('processUserData filters, groups, rounds, and does not mutate input', () => {
  const users = [
    { id: 1, name: 'Raka', age: 27, gender: 'Male' },
    { id: 2, name: 'Maya', age: 31, gender: 'Female' },
    { id: 3, name: 'Dimas', age: 17, gender: 'Male' },
    { id: 4, name: 'Sari', age: '24', gender: ' female ' },
  ];
  const snapshot = structuredClone(users);

  assert.deepEqual(processUserData(users), {
    male: { count: 1, averageAge: 27, users: [{ ...users[0] }] },
    female: {
      count: 2,
      averageAge: 27.5,
      users: [users[1], { ...users[3], age: 24 }],
    },
  });
  assert.deepEqual(users, snapshot);
});

test('processUserData safely handles incomplete data', () => {
  assert.deepEqual(processUserData([]), {});
  assert.deepEqual(processUserData(null), {});
  assert.deepEqual(processUserData([
    { id: 1, age: 25 },
    { id: 2, gender: 'male' },
    null,
  ]), {});
});
