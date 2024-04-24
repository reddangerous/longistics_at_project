import React, { useEffect } from 'react';
import './ChatBot.css'

const Chatbot = () => {
 useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.botpressWebChat.init({
        "composerPlaceholder": "Chat with ElectroAssist",
        "botConversationDescription": "Get instant Help from Our AI enabled Assistant",
        "botId": "5ccdaf82-e127-4349-afc2-0e9e7d5e09b3",
        "hostUrl": "https://cdn.botpress.cloud/webchat/v0",
        "messagingUrl": "https://messaging.botpress.cloud",
        "clientId": "5ccdaf82-e127-4349-afc2-0e9e7d5e09b3",
        "webhookId": "9fbe0b9b-162b-4065-bf13-f696b7b5cda2",
        "lazySocket": true,
        "themeName": "prism",
        "frontendVersion": "v0",
        "enableConversationDeletion": true,
        "theme": "prism",
        "themeColor": "#2563eb",
        "avatarUrl": "https://img.icons8.com/stickers/100/chatbot.png",
        "imageUrl": "https://img.icons8.com/stickers/100/chatbot.png",
        "launcherIcon": "https://img.icons8.com/stickers/100/chatbot.png",
        "stylesheet":"https://webchat-styler-css.botpress.app/prod/a2974ecc-1927-43d7-882b-9068b230001e/v15233/style.css"
      });
    };
 }, []);

 return  <div id="webchat"  />
};

export default Chatbot;
