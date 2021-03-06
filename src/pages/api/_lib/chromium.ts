import puppeteer, { Page } from 'puppeteer-core';
import { getOptions } from './chromiumOptions';

let _page: Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }

    const options = await getOptions(isDev);
    const browser = await puppeteer.launch(options);

    _page = await browser.newPage();

    return _page;
}

export async function getScreenshotThumb(
    html: string,
    isDev: boolean
) {
    const page = await getPage(isDev);

    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html);

    const file = await page.screenshot({ type: 'png' });

    return file;
}

export async function getScreenshotBanner(
    html: string,
    isDev: boolean
) {
    const page = await getPage(isDev);

    await page.setViewport({ width: 1920, height: 398 });
    await page.setContent(html);

    const file = await page.screenshot({ type: 'png' });

    return file;
}
