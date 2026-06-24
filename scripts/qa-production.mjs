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
    if (['error', 'warning'].includes(msg.type())) {
      const t = msg.text()
      if (!t.includes('Download the React DevTools')) consoleIssues.push(`${msg.type()}: ${t}`)
    }
  })
  page.on('pageerror', (error) => pageErrors.push(error.stack || error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`)
  })
  page.on('download', () => { downloaded = true })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })

  // Intro: fill name and click start (by data-testid)
  await page.locator('input[type="text"]').first().fill(`QA ${viewport.width}`)
  await page.getByTestId('start-game-btn').click()

  // Wait for first phase render
  await page.waitForSelector('[data-testid="apply-round-btn"]', { timeout: 10000 })

  const MAX_STEPS = 200
  const seenStates = []
  for (let step = 0; step < MAX_STEPS; step += 1) {
    // Check finished
    if (await page.getByTestId('final-infographic').count()) break

    // Narrative card present? (quick event)
    const narrativeChoice = page.getByTestId('narrative-choice')
    if (await narrativeChoice.count()) {
      await narrativeChoice.first().click({ timeout: 5000 }).catch(() => {})
      // wait for continue
      await page.waitForTimeout(120)
      const cont = page.getByTestId('narrative-continue')
      if (await cont.count()) await cont.first().click({ timeout: 5000 }).catch(() => {})
      await page.waitForTimeout(180)
      seenStates.push(`[${step}] narrative`)
      continue
    }

    // Result section? click footer to continue
    const footer = page.getByTestId('round-result-footer')
    if (await footer.count()) {
      await footer.first().scrollIntoViewIfNeeded()
      await footer.first().click({ timeout: 5000 })
      await page.waitForTimeout(180)
      seenStates.push(`[${step}] result`)
      continue
    }

    // Phase wrap-up?
    const wrapNext = page.getByTestId('phase-wrapup-next')
    if (await wrapNext.count()) {
      await wrapNext.first().scrollIntoViewIfNeeded()
      await wrapNext.first().click({ timeout: 5000 })
      await page.waitForTimeout(250)
      seenStates.push(`[${step}] wrapup`)
      continue
    }

    // Round controls? apply
    const apply = page.getByTestId('apply-round-btn')
    if (await apply.count()) {
      await apply.first().scrollIntoViewIfNeeded()
      await apply.first().click({ timeout: 5000 })
      await page.waitForTimeout(180)
      seenStates.push(`[${step}] apply`)
      continue
    }

    // Stuck
    const body = await page.locator('body').innerText()
    throw new Error(`Stuck at ${viewport.width}x${viewport.height} step ${step}: ${body.slice(0, 400)}; trace=${seenStates.slice(-10).join('|')}`)
  }

  if (!(await page.getByTestId('final-infographic').count())) {
    throw new Error(`Final infographic missing at ${viewport.width}x${viewport.height}; trace=${seenStates.slice(-20).join('|')}`)
  }

  // Test export
  const exportBtn = page.getByTestId('export-json-btn')
  if (await exportBtn.count()) {
    await exportBtn.first().scrollIntoViewIfNeeded()
    await exportBtn.first().click({ timeout: 5000 }).catch(() => {})
    await page.waitForTimeout(500)
  }

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  )

  await page.close()
  return { viewport, downloaded, horizontalOverflow, consoleIssues, badResponses, pageErrors, steps: seenStates.length }
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
]) {
  console.log(`\n=== Running QA at ${viewport.width}x${viewport.height} ===`)
  try {
    const r = await runScenario(viewport)
    results.push(r)
    console.log(`OK ${viewport.width} (steps=${r.steps})`)
  } catch (err) {
    console.error(`FAIL ${viewport.width}: ${err.message}`)
    results.push({ viewport, error: err.message })
  }
}

await browser.close()

const failures = results.flatMap((r) => {
  const out = []
  if (r.error) out.push(`${r.viewport.width}: ${r.error}`)
  if (r.consoleIssues?.length) out.push(...r.consoleIssues.map((c) => `${r.viewport.width}: ${c}`))
  if (r.badResponses?.length) out.push(...r.badResponses.map((c) => `${r.viewport.width}: ${c}`))
  if (r.pageErrors?.length) out.push(...r.pageErrors.map((c) => `${r.viewport.width}: ${c}`))
  if (r.horizontalOverflow) out.push(`${r.viewport.width}: horizontal overflow`)
  if (r.downloaded === false) out.push(`${r.viewport.width}: JSON export did not download`)
  return out
})

console.log('\n=== Summary ===')
for (const r of results) {
  console.log(`${r.viewport.width}x${r.viewport.height}: ${r.error ? 'FAIL ' + r.error : 'PASS (steps=' + r.steps + ')'}`)
}

if (failures.length > 0) {
  console.error(`\nQA failed:\n${failures.join('\n')}`)
  process.exit(1)
}
console.log('\nQA passed.')
