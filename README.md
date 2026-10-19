# Pizzeria

A responsive, static pizzeria website built with HTML, CSS, and vanilla JavaScript. It includes a home page, service information, a searchable pizza menu, a shopping cart, a demo checkout, and a contact page.

## Pages and features

- **Home** — introduction, featured story, and menu links.
- **Our experience** — dine-in, takeaway, delivery, and online ordering information.
- **Menu** — search and sort pizzas, add items to the cart, and update quantities.
- **Shopping cart** — saved in browser local storage so it remains available while browsing.
- **Checkout** — validates delivery details and displays the order total. This is a demo; it does not submit orders or process payments.
- **Contact** — contact form and a map. Sending the form requires an internet connection and the configured form service.
- Responsive layouts and motion effects that respect the user's reduced-motion preference.

## Run locally

You can open `home.html` directly, but using a local web server is recommended so every page and asset loads consistently.

### Python

1. Install Python if it is not already installed.
2. Open a terminal in this project folder (the folder containing `index.html`).
3. Start the local server:

   ```powershell
   python -m http.server 8000
   ```

4. Open **http://localhost:8000/** in Edge or another browser. You can also go directly to **http://localhost:8000/home.html**.
5. Keep the terminal open while using the site. Press **Ctrl+C** in the terminal to stop the server.

If `python` is not recognized, try:

```powershell
py -m http.server 8000
```

## Publish with GitHub Pages

1. Create a GitHub repository. Make it **Public** if the site should be viewable by everyone. It is simplest to leave the option to add a README unchecked, since this project already has one.
2. From this project folder, initialize Git and push the files. Replace the placeholders with your GitHub username and repository name:

   ```powershell
   git init
   git add .
   git commit -m "Publish Pizzeria website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. On GitHub, open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Wait for GitHub Pages to finish deploying. The Pages settings will show the public website address.

The included `index.html` redirects visitors to `home.html`, so the site's root address opens the home page. A local address such as `localhost` only works on your own computer; use the GitHub Pages address to share the published site.

## Project files

- `index.html`, `home.html`, `about.html`, `contact.html`, `ordernow.html`, `checkout.html` — site pages.
- `style.css`, `style1.css`, `style2.css`, `contact.css`, `brand.css` — page and shared styles.
- `script.js`, `checkout.js`, `site.js` — cart, checkout, and shared page effects.
- `images/` and the image, video, and icon files in the project folder — site media.

## Notes

- The cart uses browser local storage. Its contents are local to a visitor's browser and are not shared between devices.
- Checkout is for demonstration only. Taking real orders or payments requires a server-side service and a payment provider.
- Google Fonts, the embedded Google Map, and the contact form service need an internet connection.
