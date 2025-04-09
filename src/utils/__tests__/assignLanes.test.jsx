import { assignLanes } from '../src/assignLanes'

test('assigns lanes to timeline items without overlap', () => {
  const items = [
    { start: 1, end: 2 },
    { start: 2, end: 3 },
    { start: 1.5, end: 2.5 },
  ]
  const result = assignLanes(items)
  expect(result[0].lane).toBeDefined()
  expect(result[1].lane).toBeDefined()
})
