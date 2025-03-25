const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likesBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'root',
        username: 'root',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })
  test('login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')     
      await expect(page.getByText('Matti Luukkainen')).toBeVisible()
      await expect(page.getByText('logout')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')     
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })
  describe('when logged in', () => { 
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')     
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url') 
      await expect(page.getByText('test title test author')).toBeVisible()
    })
    describe('when you edit a blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title 2', 'test author 2', 'test url 2') 
        await createBlog(page, 'test title 3', 'test author 3', 'test url 3') 
      })
      test('editing blog with likes', async ({ page }) => {
        await likesBlog(page, 'test title 2', 'test author 2')
        const detailsDiv = await page.locator('.details').filter({ hasText: 'test author 2' })
        await expect(detailsDiv.getByText('likes 1')).toBeVisible()
      })
    })
    describe('when blog deleted', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title 2', 'test author 2', 'test url 2') 
        await createBlog(page, 'test title 3', 'test author 3', 'test url 3') 
      })
      test('blog deleted', async ({ page }) => {
        const selectBlog = await page.getByText('test title 3 test author 3')
        await selectBlog.getByRole('button', { name: 'view'}).click()
        const detailsDiv = await page.getByText('test url 3likes 0 liketest')
        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm');
          expect(dialog.message()).toBe(`Remove blog test title 3`); 
          await dialog.accept(); 
        }); 
        await detailsDiv.getByRole('button', { name: 'eliminar'}).click()
        await expect(page).not.toContain('test title 3 test author 3')
      })
    })
    describe('when the blog is deleted', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title 2', 'test author 2', 'test url 2') 
        await createBlog(page, 'test title 3', 'test author 3', 'test url 3') 
      })
      test('only the creator sees the button', async ({ page }) => {
        const selectBlog = await page.getByText('test title 2 test author 2')
        await selectBlog.getByRole('button', { name: 'view'}).click()
        const detailsDiv = await page.getByText('test url 2likes 0 liketest')
        await expect(detailsDiv.getByText('eliminar')).toBeVisible()

        await page.getByRole('button', { name: 'logout'}).click()
        await loginWith(page, 'root', 'salainen')
        const selectBlogRoot = await page.getByText('test title 2 test author 2')
        await selectBlogRoot.getByRole('button', { name: 'view'}).click()
        const detailsDivRoot = await page.getByText('test url 2likes 0 liketest')
        await expect(detailsDivRoot.getByText('eliminar')).not.toBeVisible()
      })
    })
    describe('when the blogs sorted by likes', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title 2', 'test author 2', 'test url 2') 
        await createBlog(page, 'test title 3', 'test author 3', 'test url 3') 
      })
      test('blogs sorted by likes', async ({ page }) => {
        await likesBlog(page, 'test title 2', 'test author 2')
        const detailsDiv = await page.locator('.details').filter({ hasText: 'test author 2' })
        await expect(detailsDiv.getByText('likes 1')).toBeVisible()

        await likesBlog(page, 'test title 3', 'test author 3')
        const detailsDiv3 = await page.locator('.details').filter({ hasText: 'test author 3' })
        await expect(detailsDiv3.getByText('likes 1')).toBeVisible()
  
        const selectBlog = await page.getByText('test title 3')
        await selectBlog.getByRole('button', { name: 'hide'}).click()

        await likesBlog(page, 'test title 3', 'test author 3')

        await page.getByRole('button', { name: 'logout'}).click()
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen')).toBeVisible()

        const blogs = await page.locator('.blog')
        blogs.first().getByText('test title 3').waitFor()
        await expect(blogs.first()).toContainText('test title 3')

      })
    })
  })
})