import express from "express";
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import OpenAIApi from 'openai';
import axios from "axios";
import AbortController from 'abort-controller';


global.AbortController = AbortController
  

const openai = new OpenAIApi({
    apiKey: `${process.env.OPENAI_API_KEY}`,
});



const openaiApiKey = process.env.OPENAI_API_KEY;
console.log('Valor da OPENAI_API_KEY:', openaiApiKey);

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
  };
  
app.use(cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', async(req, res) =>{
    res.status(200).send({
        message: 'Hello from Remy'
    })
})


app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "system",
                        "content": "You will be provided with a sentence, and your task is to translate it into French."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature: 0,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        
        res.status(200).send({
            bot: response.data.choices[0].message.content
        });
    } catch (error) {
        console.log('Error:', error.message);
        console.log('Error Stack:', error.stack);
        res.status(500).send({ error });
    }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
