const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const exportsObject = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/explainer-mapping.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsObject })
const resolve = exportsObject.resolveQuestionExplainer
const registry = { 'ec2-amis': () => {}, 'ec2-instance-types': () => {}, 'lambda-concurrency': () => {} }
for (const questionId of ['28c7e66e-9cf4-5480-a98c-1fb81fc240b6', '2e03566e-5539-5087-af2f-ad2df39072fd']) {
  assert.equal(resolve({ questionId, topic: 'ec2-ami' }, 'ec2', registry), 'ec2-amis')
  assert.equal(resolve({ questionId, topic: 'ec2-networking' }, 'ec2', registry), 'ec2-instance-types')
  assert.equal(resolve({ questionId, topic: 'ec2-ami' }, 'lambda', registry), 'lambda-concurrency')
}
// Same tag is not enough: the other two reviewed AMI-tagged questions stay unchanged.
for (const questionId of ['0c3244be-86ec-46c8-adeb-991f51504f9d', '0f227820-3ed2-5361-ad94-e0d05540a061']) {
  assert.equal(resolve({ questionId, topic: 'ec2-ami' }, 'ec2', registry), 'ec2-instance-types')
}
assert.equal(resolve({ topic: 'ec2-amis' }, 'ec2', registry), 'ec2-amis')
assert.equal(resolve({}, 'ec2', registry), 'ec2-instance-types')
assert.equal(resolve({ questionId: '28c7e66e-9cf4-5480-a98c-1fb81fc240b6', topic: 'ec2-ami' }, 'ec2', {}), null)
assert.equal(resolve({ topic: 'unknown' }, undefined, registry), null)
assert.equal(resolve({ topic: 'constructor', questionId: '__proto__' }, undefined, registry), null)
console.log('Explainer resolution: reviewed matches, isolation, fallback and missing-component checks passed.')

// Explicit ECS approvals work without relying on the legacy service fallback.
for (const questionId of ['d9fa4f8d-2e63-5a6a-bf8a-ecc16e82ad4d', '0be5b89a-cd0f-5906-89fe-13b5c432317b', '6b9b9dc3-94b2-5aef-aadc-cd7af7eb0b4b']) {
  const saved = exportsObject.serviceToExplainerMap.ecs
  delete exportsObject.serviceToExplainerMap.ecs
  assert.equal(resolve({questionId, topic: 'ecs-task-definitions'}, 'ecs', {'task-definitions': true}), 'task-definitions')
  assert.equal(resolve({questionId, topic: 'changed'}, 'ecs', {'task-definitions': true}), null)
  assert.equal(resolve({questionId, topic: 'ecs-task-definitions'}, 'ec2', {'task-definitions': true}), null)
  exportsObject.serviceToExplainerMap.ecs = saved
}
console.log('ECS explicit mappings and review guards passed.')
