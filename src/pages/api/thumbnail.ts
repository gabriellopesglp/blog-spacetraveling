import { NextApiRequest, NextApiResponse } from "next";
import { getScreenshotThumb } from "./_lib/chromium";
import getThumbnailTemplate from "./_lib/thumbTemplate";

const isDev = !process.env.AWS_REGION;

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        const title = String(req.query.title)

        const images = req.query.images


        if (!title) {
            throw new Error('Title is required');
        }

        const html = getThumbnailTemplate(title, images);

        const file = await getScreenshotThumb(html, isDev);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');

        return res.end(file);
    } catch (err) {
        console.error(err);

        return res.status(500).send('Internal Server Error');
    }
}
