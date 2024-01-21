import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from './AppFunctional'
import React from 'react'
import { use } from '../../backend/mock-server'

// Write your tests here

let up, down, left, right, reset, submit
let squares, coordinates, steps, message, email

//up = screen.getByTestId('up')

const updateStatelessSelectors = (document) => {
  //up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = (document) => {
  squares = document.querySelectorAll('.square')
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
}

const deneme = (screen) => {
  up = screen.getByTestId('up')
}

beforeEach(() => {
  render(<AppFunctional />)
  updateStatelessSelectors(document)
  updateStatefulSelectors(document)
  deneme(screen)
})

test('Component testi', () => {
  fireEvent.click(up)
  fireEvent.click(up)
  expect(message.textContent).toBe('Yukarıya gidemezsiniz')
})

test('iki kere aşağı', () => {
  fireEvent.click(down)
  fireEvent.click(down)
  expect(message.textContent).toBe('Aşağıya gidemezsiniz')
})

test('e2e test', async () => {
  fireEvent.click(up)
  fireEvent.click(right)
  fireEvent.click(right)
  expect(message.textContent).toBe('Sağa gidemezsiniz')

  fireEvent.click(down)
  fireEvent.click(down)

  fireEvent.change(email, { target: { value: 'foo@bar.baz' } })
  fireEvent.click(submit)

  await screen.findByText('foo@bar.baz failure #111')
})
