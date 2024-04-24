// chatgptService.js
import axios from 'axios';

const sendToChatGPT = async (userInput) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer YOUR_CHATGPT3_API_KEY`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with ChatGPT-3:', error);
        throw error;
    }
};

export default sendToChatGPT
