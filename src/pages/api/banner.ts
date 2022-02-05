import { NextApiRequest, NextApiResponse } from "next";
import { getScreenshotBanner } from "./_lib/chromium";
import getBannerTemplate from "./_lib/bannerTemplate";

const isDev = !process.env.AWS_REGION;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const images = req.query.images

    const htmlBanner = getBannerTemplate(images);

    const fileBanner = await getScreenshotBanner(htmlBanner, isDev);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');

    return res.end(fileBanner);
  } catch (err) {
    console.error(err);

    return res.status(500).send('Internal Server Error');
  }
}
