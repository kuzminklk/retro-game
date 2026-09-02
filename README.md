# GRAM // Star Runner

A responsive retro-futurist Telegram Mini App game. It runs as a polished browser demo locally and adopts the Telegram user's name, haptics, expanded view, header/background colors, and Back Button when opened inside Telegram.

## Run locally

```bash
npm install
npm run dev
```

For a deployable static bundle:

```bash
npm run build
```

The generated site is in `dist/`.

## Telegram launch

1. Deploy `dist/` over HTTPS.
2. Create a bot with [@BotFather](https://t.me/BotFather) and set its Menu Button (or a Web App button) to the deployed URL.
3. Open the button in Telegram. The app loads Telegram's official Web App script and automatically calls `ready()` and `expand()`.

## GRAM integration note

The current GRAM balance and rewards are deliberately demo game state stored in `localStorage`; they are not a custodial wallet or an on-chain balance. Before using rewards with monetary value, add a backend that validates `Telegram.WebApp.initData` with the bot token, owns the reward ledger, rate-limits claims, and verifies any TON/GRAM transaction server-side. Never trust a balance or reward calculated in the browser.
