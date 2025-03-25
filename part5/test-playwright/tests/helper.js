const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}
const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${ title } ${ author }`).waitFor()
}
const likesBlog = async (page, title, author) => {
  const selectBlog = await page.getByText(`${ title } ${ author }`)
  await selectBlog.getByRole('button', { name: 'view'}).click()
  const detailsDiv = await page.locator('.details').filter({ hasText: `${ author }` })
  await detailsDiv.getByRole('button', { name: 'like' }).click()
  // await detailsDiv.getByRole('button', { name: 'like' }).click() 
}
module.exports = { loginWith, createBlog, likesBlog }