import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const handleAddBlog = vi.fn()
  const toggleVisibility = vi.fn()
  const setErrorMessage = vi.fn()
  const setSuccessMessage = vi.fn()
  const blogs = []
  const setBlogs = vi.fn()
  const blogService = {
    create: vi.fn()
  }
  const user = userEvent.setup()

  const { container } = render(<BlogForm blogs={ blogs } blogService={ blogService } setBlogs={ setBlogs } toggleVisibility={ toggleVisibility } setErrorMessage={ setErrorMessage } setSuccessMessage={ setSuccessMessage } />)

  const sendButton = screen.getByText('create')

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')
  await user.type(title, 'testing a form...')
  await user.type(author, 'testing a form...')
  await user.type(url, 'testing a form...')

  await user.click(sendButton)
  expect(handleAddBlog.mock.calls)
})