Method : Termux + Node.js + Playwright

If you liked the sound of Playwright, you can actually run it directly on your Android phone using Termux (a terminal emulator for Android).

By combining Termux with an automation app like Tasker or MacroDroid, you can create a homescreen shortcut that triggers the script in the background.
How to set it up:

Install Termux: Download it (preferably from F-Droid, as the Play Store version is outdated).

Install Node.js & Chromium: Inside Termux, run:
Bash

```
pkg update && pkg install nodejs chromium
```

Write your script: You can use the exact same Playwright script mentioned earlier. (You will just need to configure Playwright to use Termux's installed Chromium binary).

Create the Shortcut: Install the Termux:Widget add-on. This allows you to place a 1x1 widget script on your Android homescreen. When you tap it, Termux wakes up, launches the headless browser, fills the Vue form, submits it, and closes.

Comment installer et lancer le projet maintenant ?

Une fois que tu as tes trois fichiers (submit-form.js, .env, et package.json) dans le même dossier :

    Installe les paquets (cela va lire le package.json et installer playwright et dotenv d'un coup) :
    Bash

    `npm install`

    Installe les navigateurs de Playwright (obligatoire lors de la première installation pour que Playwright télécharge son binaire Chromium léger) :
    Bash

    npx playwright install chromium

    (Note : Si tu es sur Termux/Android, tu n'as pas besoin de faire cette commande npx. À la place, tu utilises le Chromium du système via pkg install chromium et tu indiques son chemin dans le script si nécessaire).

    Lance ton script en une seule commande :
    Bash

    npm start
