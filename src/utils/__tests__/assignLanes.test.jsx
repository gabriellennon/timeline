import { assignLanes } from '../assign-lanes'

test('assigns lanes to timeline items without overlap', () => {
  const items = [
    { start: '2023-01-01', end: '2023-01-02' },
    { start: '2023-01-02', end: '2023-01-03' },
    { start: '2023-01-01', end: '2023-01-03' },
  ]
  const result = assignLanes(items)
  expect(result[0].lane).toBeDefined()
  expect(result[1].lane).toBeDefined()
  expect(result[2].lane).toBeDefined()
})
