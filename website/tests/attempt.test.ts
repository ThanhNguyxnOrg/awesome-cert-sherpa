import assert from "node:assert/strict";
import test from "node:test";
import { prepareAttempt } from "../src/app/exam/engine";

test("an all-A bank does not give full marks for picking the first choice", () => {
  const pool = ["one", "two"].map(id => ({
    id, choices: ["A. Right", "B. Wrong"], answerIndex: 0,
  }));
  const original = structuredClone(pool);
  // Keep question order; swap choices on the first question only.
  const draws = [0.99, 0, 0.99];
  const attempt = prepareAttempt(pool, 2, () => draws.shift()!);
  assert.equal(attempt.filter(q => q.displayChoices[0].sourceIndex === q.answerIndex).length, 1);
  for (const q of attempt) {
    assert.deepEqual(q.displayChoices.find(c => c.sourceIndex === q.answerIndex), {
      sourceIndex: 0, text: "Right",
    });
    assert.deepEqual(q.displayChoices.map(c => c.text).sort(), ["Right", "Wrong"]);
  }
  const retry = prepareAttempt(pool, 2, () => 0.99);
  assert.equal(retry[0].displayChoices[0].text, "Right");
  assert.equal(attempt[0].displayChoices[0].text, "Wrong");
  assert.deepEqual(pool, original);
});

test("choice identity does not depend on text or on an authored label", () => {
  const [q] = prepareAttempt([{ choices: ["Same", "B. Same"], answerIndex: 1 }], 1, () => 0);
  assert.deepEqual(q.displayChoices, [
    { sourceIndex: 1, text: "Same" },
    { sourceIndex: 0, text: "Same" },
  ]);
  assert.equal(q.displayChoices[0].sourceIndex, q.answerIndex);
  assert.equal(q.choices[q.answerIndex], "B. Same");
});
