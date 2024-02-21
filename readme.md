# Year in Film Colors 🎬🌈

Year in Film Colors is a project where the user's Letterboxd diary is transformed into a dynamic representation in the form of a calendar. 

## Live Demo

The project is hosted on Render. Explore your personalized calendar here: [Year in Film Colors](https://yearinfilmcolors.onrender.com)

## Tech Stack

- **JavaScript:** The project is primarily developed using JavaScript both for frontend and backend functionalities.
- **Node.js:** The backend is built on Node.js.
- **Puppeteer:** Used for web scraping, enabling the extraction of film details from the user's Letterboxd diary pages.
- **Tailwind CSS:** Used for a utility-first and highly customizable styling approach.

## Libraries

- **node-vibrant:** Used to extract dominant colors from the film posters.
- **tailwind-scrollbar & tailwindcss-gradients:** Additional Tailwind CSS plugins for enhanced styling.

## How It Works

1. **User Input:**
   - The process begins with the user providing input, specifying their Letterboxd username and the desired year for the calendar.

2. **Web Scraping:**
   - Puppeteer starts the process of scraping the user's Letterboxd diary pages for the provided year.
   - Each diary page is visited to scrape details such as film names, viewing dates, and film posters.

3. **Color Extracting:**
   - node-vibrant is utilized to identify the dominant color of each film's poster.

4. **Calendar Generation:**
   - The collected data is then used to dynamically generate a personalized calendar.
   - If a day includes multiple films, the dominant colors are blended to create a unique color for that day.

5. **User Interaction:**
   - The calendar is interactive, allowing users to hover over each calendar cell to reveal the related film names and viewing dates.

## Upcoming Feature

- **Download/Share Calendar:** In the future, I plan to introduce a feature that allows users to download or share their personalized calendar. Stay tuned for updates!


