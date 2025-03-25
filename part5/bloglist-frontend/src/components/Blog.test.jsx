import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'This title using in Test',
    likes: 10,
    author: 'Freak0121',
    url: 'Http://Url.test.com/',
    user: { username: 'Freak0121' }
  }
  const user = {
    username: 'Freak0121'
  }
  const { container } = render(<Blog blog={ blog } user={ user } />)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('This title using in Test Freak0121')

  const details = container.querySelector('.details')
  expect(details).toHaveStyle('display: none')
})
test('shows the url detail and likes of the blog', async () => {
  const blog = {
    title: 'This title using in Test',
    likes: 10,
    author: 'Freak0121',
    url: 'Http://Url.test.com/',
    user: { username: 'Freak0121' }
  }
  const user = {
    username: 'Freak0121'
  }

  const { container } = render(<Blog blog={ blog } user={ user } />)

  const userE = userEvent.setup()
  const button = screen.getByText('view')
  await userE.click(button)

  const div = container.querySelector('.details')
  expect(div).not.toHaveStyle('display: none')
  expect(div).toHaveTextContent(`likes ${ blog.likes }`)
  expect(div).toHaveTextContent(`${ blog.url }`)
})
test('test to validate 2 clicks to likes button', async () => {
  const blog ={
    title: 'This title using in Test',
    likes: 10,
    author: 'Freak0121',
    url: 'Http://Url.test.com/',
    user: { username: 'Freak0121' }
  }
  const user = {
    username: 'Freak0121'
  }
  const incrementLikes = vi.fn()

  const { container } = render(<Blog blog={ blog } user={ user } incrementLikes={ incrementLikes }/>)

  const userE = userEvent.setup()
  const button = screen.getByText('view')
  await userE.click(button)

  const div = container.querySelector('.details')
  expect(div).not.toHaveStyle('display: none')

  const buttonLikes = screen.getByText('like')
  await userE.click(buttonLikes)
  await userE.click(buttonLikes)

  expect(incrementLikes.mock.calls).toHaveLength(2)
})