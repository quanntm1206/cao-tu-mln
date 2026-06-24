import { chromium } from 'playwright'

const baseUrl = process.env.QA_URL || 'http://127.0.0.1:4173/'
const executablePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const browser = await chromium.launch({ headless: true, executablePath })
const results = []

async function runScenario(viewport) {
  const page = await browser.newPage({ viewport, acceptDownloads: true })
  const consoleIssues = []
  const badResponses = []
  const pageErrors = []
  let downloaded = false

  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) consoleIssues.push(`${msg.type()}: ${msg.text()}`)
  })
  page.on('pageerror', (error) => pageErrors.push(error.stack || error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`)
  })
  page.on('download', () => { downloaded = true })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.locator('input').first().fill(`QA ${viewport.width}`)
  await page.getByRole('button', { name: /Mở xưởng sản xuất/ }).click()

  for (let step = 0; step < 70; step += 1) {
    const body = await page.locator('body').innerText()
    if (body.includes('Kết thúc học phần!')) break

    if (await page.getByText(/Tình huống sản xuất/).count()) {
      const buttons = page.locator('button')
      const count = await buttons.count()
      if (count >= 2) await buttons.nth(1).click()
      const confirm = page.getByRole('button', { name: /Áp dụng lựa chọn/ })
      if (await confirm.count()) await confirm.first().click()
      continue
    }

    const next = page.getByRole('button', { name: /Tiếp tục|Xem tổng kết/ })
    if (await next.count()) {
      await next.first().click()
      continue
    }

    const produce = page.getByRole('button', { name: /Thực hiện vòng sản xuất/ })
    if (await produce.count()) {
      await produce.click()
      continue
    }

    throw new Error(`Scenario stuck at ${viewport.width}x${viewport.height}: ${body.slice(0, 500)}`)
  }

  const finalText = await page.locator('body').innerText()
  if (!finalText.includes('Kết thúc học phần!')) {
    throw new Error(`Game did not reach final screen at ${viewport.width}x${viewport.height}`)
  }

  await page.getByRole('button', { name: /Xuất báo cáo/ }).click()
  await page.waitForTimeout(250)

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  )

  await page.close()
  return {
    viewport,
    downloaded,
    horizontalOverflow,
    consoleIssues,
    badResponses,
    pageErrors,
  }
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
]) {
  results.push(await runScenario(viewport))
}

await browser.close()

const failures = results.flatMap((result) => [
  ...result.consoleIssues,
  ...result.badResponses,
  ...result.pageErrors,
  ...(result.horizontalOverflow ? [`Horizontal overflow at ${result.viewport.width}`] : []),
  ...(!result.downloaded ? [`Report did not download at ${result.viewport.width}`] : []),
])

console.log(JSON.stringify(results, null, 2))
if (failures.length > 0) {
  console.error(`QA failed:\n${failures.join('\n')}`)
  process.exit(1)
}
