# Emu's Big Sorry

Create a cute, interactive apology web app for my best friend Emu.

Theme: "Emu dost SORRY. Please forgive me "

Key Features & Logic:

1. Initial View:

   - Header: "Emu dost, I am really SORRY. Please forgive me! 🥺"

   - Subtitle: "I said sorry 300 times already... please?"

   - Display a cute LINE character sticker/gif (Brown or Cony bear looking hopeful).

   - Two buttons: "Yes" (Primary green/pink) and "No" (Secondary neutral/red).

2. "No" Button Behavior (Tracks click count):

   - Click 1: Change header text to "Are you sure? Please forgive me! 🥺". Make the "Yes" button slightly larger.

   - Click 2: Change header text to "Pretty please? I'm really, really sorry! 😭". Make the "Yes" button even bigger.

   - Click 3+: Change header text to "Look how much you made me cry! 😭💔". Swap the sticker to a LINE character crying hysterically (Moon or Brown bear weeping). Make the "No" button move away from the cursor when hovered, or make it unclickable.

3. "Yes" Button Behavior (Formspree Email Notification):

   - When "Yes" is clicked, trigger a background HTTP POST request to: "https://formspree.io/f/mljdwlez" with the JSON payload: { response: "Emu clicked YES and forgave you!", timestamp: new Date().toISOString() }.

   - Launch a full-screen colorful confetti explosion (use canvas-confetti).

   - Display a celebration screen showing a super happy LINE character sticker and large text: "YAY! 🎉 Thank you Emu! Best friends forever! ❤️".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a11e0b3b-25dd-4f6d-b012-11ab63df42f1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
