import { Router } from 'express';
import { z } from 'zod';
import { getWeatherForDate } from '../services/weather.service.ts';

export const weatherRouter = Router();

const weatherParams = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD.')
    .refine(value => {
      const parsedDate = new Date(`${value}T00:00:00Z`);
      return parsedDate.toISOString().slice(0, 10) === value;
    }, 'Date is not valid.')
});

const weatherQuery = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180)
});

/**
 * @swagger
 * /api/weather/{date}:
 *   get:
 *     tags: [Weather]
 *     summary: Get daily weather from Open-Meteo
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema: { type: string, format: date, example: 2026-08-27 }
 *       - name: latitude
 *         in: query
 *         required: true
 *         description: WGS84 latitude from -90 to 90
 *         schema: { type: number, minimum: -90, maximum: 90, example: 52.52 }
 *       - name: longitude
 *         in: query
 *         required: true
 *         description: WGS84 longitude from -180 to 180
 *         schema: { type: number, minimum: -180, maximum: 180, example: 13.41 }
 *     responses:
 *       200:
 *         description: Weather for the requested date
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WeatherDay' }
 *       400:
 *         description: Invalid date or coordinates
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       502:
 *         description: Open-Meteo could not be reached
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
weatherRouter.get('/weather/:date', async (request, response) => {
  const params = weatherParams.safeParse(request.params);
  const query = weatherQuery.safeParse(request.query);

  if (!params.success || !query.success) {
    response.status(400).json({ error: 'Use a valid date and latitude/longitude.' });
    return;
  }

  try {
    const weather = await getWeatherForDate(
      params.data.date,
      query.data.latitude,
      query.data.longitude
    );

    if (!weather) {
      response.status(404).json({ error: 'No weather data found for this date.' });
      return;
    }

    response.json(weather);
  } catch (error) {
    console.error(error);
    response.status(502).json({ error: 'Weather service is not available.' });
  }
});
