const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Roope Kääriäinen',
        username: 'roope',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('roope')
            await page.getByTestId('password').fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('Roope Kääriäinen logged in')).toBeVisible()
            })


        test('fails with wrong credentials', async ({ page }) => {
            await page.goto('http://localhost:5173')

            await page.getByTestId('username').fill('roope')
            await page.getByTestId('password').fill('salaine')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('wrong credentials')).toBeVisible()
        })

        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await page.getByTestId('username').fill('roope')
                await page.getByTestId('password').fill('salainen')
                await page.getByRole('button', { name: 'login' }).click()
                await page.getByRole('button', { name: 'new blog' }).click()
                await page.getByTestId('author').fill('a test playwright writer')
                await page.getByTestId('title').fill('a blog created by playwright')
                await page.getByTestId('url').fill('www.playwrighttest.fi')
                await page.getByRole('button', { name: 'create' }).click()
            })

            test('a new blog can be created', async ({ page }) => {
                await expect(page.getByText('Blog a blog created by playwright created')).toBeVisible()
                })

            test('a blog can be liked', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText('likes 1')).toBeVisible()
                })

        })
    })
})

