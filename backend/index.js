import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Bottleneck from 'bottleneck';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

// Keep existing /api/generate endpoint for general assistant
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    const completion = await limiter.schedule(() =>
      openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 1000,
      })
    );

    const result = completion.choices?.[0]?.message?.content;
    if (result) {
      console.log('Generated result:', result);
      res.json({ result });
    } else {
      console.error('No valid response received');
      res.status(500).json({ error: 'Failed to generate response', details: 'No valid response received' });
    }
  } catch (error) {
    console.error('Server error:', error);
    if (error.code === 'insufficient_quota') {
      res.status(429).json({ error: 'Rate limit exceeded, please check your API usage and plan.' });
    } else {
      res.status(500).json({
        error: 'Failed to generate response',
        details: error.message,
      });
    }
  }
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add new endpoint for image analysis
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
    
    const analysis = await limiter.schedule(() =>
      openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Describe this room in detail for a property listing:" },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    );

    res.json({
      description: analysis.choices[0].message.content,
      url: imageUrl
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// Add new endpoint for property descriptions
app.post('/api/generate-property-description', async (req, res) => {
  try {
    const { propertyDetails, images, style, location } = req.body;

    const areaInfo = await limiter.schedule(() =>
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Provide a brief summary of why someone would want to live in ${location}. Focus on lifestyle, schools, and amenities.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    );

    const fullDescription = await limiter.schedule(() =>
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Generate a ${style.toLowerCase()} property description combining these elements:
            Property Details: ${propertyDetails}
            Room Descriptions: ${images.map(img => img.description).join('\n')}
            Local Area: ${areaInfo.choices[0].message.content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    );

    res.json({ 
      description: fullDescription.choices[0].message.content,
      areaInfo: areaInfo.choices[0].message.content
    });
  } catch (error) {
    console.error('Description generation error:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

app.post('/api/property-valuation', upload.single('logo'), async (req, res) => {
  try {
    const { address, squareMeters } = req.body;
    const logo = req.file;

    // Call Property Deal Insights API
    const valuationData = await axios.post(
      `${process.env.PROPERTY_DEALS_API_URL}/valuation`,
      {
        address,
        squareMeters,
        logo: logo ? `${process.env.SERVER_URL}/uploads/${logo.filename}` : null
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PROPERTY_DEALS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Process and enhance the valuation data
    const enhancedData = await limiter.schedule(() =>
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Analyze this property valuation data and provide insights:\n${JSON.stringify(valuationData.data)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    );

    res.json({
      ...valuationData.data,
      insights: enhancedData.choices[0].message.content
    });
  } catch (error) {
    console.error('Property valuation error:', error);
    res.status(500).json({ error: 'Failed to generate property valuation' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

