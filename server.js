const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const Vibrant = require("node-vibrant");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const path = require("path");

app.use(express.static('public'));

app.get('/script.js', function (req, res) {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// handle the '/scrape' endpoint
app.get('/scrape', async (req, res) => {
  try {
    // extract query parameters
    const username = req.query.username;
    const year = req.query.year;
    const baseUrl = `https://letterboxd.com/${username}/films/diary/for/${year}/page/`;

    // scrape data from the provided URL
    const scrapedData = await scrapePages(baseUrl);

    // generate color palette for each film
    const colorPaletteData = await generateColorPalette(scrapedData);

    // send the color palette data as a JSON response
    res.json(colorPaletteData);
    console.log(colorPaletteData)
  } catch (error) {
    // handle errors during scraping
    console.error('Error during scraping:', error.message);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

const generateRandomUA = () => {
  // Array of random user agents
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
  ];
  // Get a random index based on the length of the user agents array 
  const randomUAIndex = Math.floor(Math.random() * userAgents.length);
  // Return a random user agent using the index above
  return userAgents[randomUAIndex];
}

async function scrapePages(baseUrl) {
  const scrapedData = [];
  let currentPage = 1;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--no-zygote"
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    while (true) {
      const pageUrl = `${baseUrl}${currentPage}/`;
      const page = await browser.newPage();
     // Custom user agent from generateRandomUA() function
     const customUA = generateRandomUA();
     // Set custom user agent
     await page.setUserAgent(customUA);

      console.log('Before navigating to page:', pageUrl);
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
      console.log('After navigating to page. Waiting for entries...');

      console.log('Navigated to page:', pageUrl);

      // wait for a specific element that indicates the page has loaded
      await page.waitForSelector('#diary-table').catch(e => console.error('Error waiting for selector:', e.message));

      // extract entries
      const entries = await page.$$('tr.diary-entry-row');

      // scroll down multiple times to load more entries
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        // wait for a short delay before extracting data
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // break the loop if no entries are found
      if (entries.length === 0) {
        break;
      }

      // process each entry on the page
      for (const entry of entries) {
        try {
          const filmPosterElement = await entry.$('.react-component.poster div img.image');
          const viewingDateElement = await entry.$('.td-day.diary-day a');

          // ensure both elements are present before proceeding
          if (filmPosterElement && viewingDateElement) {
            // extract film poster URL and viewing date element
            const filmPosterUrl = await filmPosterElement.evaluate(img => img.src || img.getAttribute('src'));
            const viewingDateStr = await viewingDateElement.evaluate(a => a.getAttribute('href'));

            // convert the extracted date string to the desired format
            const viewingDate = convertDateStr(viewingDateStr);

            // ensure the URL and viewing date are valid before pushing to scrapedData
            if (filmPosterUrl && filmPosterUrl !== 'undefined' && viewingDate) {
              scrapedData.push({ filmPosterUrl, viewingDate });
            } else {
              console.error(`Error extracting poster URL or viewing date for an entry`);
            }
          } else {
            console.error(`Error: Film poster or viewing date element not found.`);
          }
        } catch (error) {
          console.error('Error processing entry:', error.message);
        }
      }

      // function to convert date format from "/${username}/films/diary/for/${year}/04/22/" to "04/22" e.g.
      function convertDateStr(dateStr) {
        const match = dateStr.match(/\/(\d{2})\/(\d{2})\//);
        if (match) {
          const [, month, day] = match;
          return `${month}/${day}`;
        }
        return null; // handle the case where the match fails
      }

      // close the page after scraping
      await page.close();
      currentPage++;
    }

    // close the browser instance after all pages have been scraped
    await browser.close();

    // return the collected film data
    return scrapedData;
  } catch (error) {
    // throw any encountered errors
    throw error;
  }
}

async function generateColorPalette(scrapedData) {
  const colorPaletteData = [];

  // iterate over each film entry
  for (const entry of scrapedData) {
    try {
      const palette = await Vibrant.from(entry.filmPosterUrl).getPalette();

      // extract the dominant color if Vibrant color is available
      const dominantColor = palette.Vibrant ? palette.Vibrant.hex : null;

      // extract month and day from the viewing date
      const [month, day] = entry.viewingDate.split('/');

      // log the month, day, and dominant color to the console
      console.log(`Month: ${month}, Day: ${day}, Dominant Color: ${dominantColor}`);

      colorPaletteData.push({ dominantColor, viewingDate: entry.viewingDate });
    } catch (error) {
      console.error('Error generating color palette:', error.message);

      // log the error along with the viewing date
      console.log(`Viewing Date: ${entry.viewingDate}, Error: ${error.message}`);

      colorPaletteData.push({ dominantColor: null, viewingDate: entry.viewingDate });
    }
  }

  // return the generated color palette
  return colorPaletteData;
}

/*
app.get('/screenshot', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/public'); // replace with your server address

  const element = await page.$('#table'); // replace '#divId' with your div's selector
  const screenshot = await element.screenshot();

  await browser.close();

  res.setHeader('Content-Disposition', 'attachment;filename="screenshot.png"');
  res.setHeader('Content-Type', 'image/png');
  res.send(screenshot);
});
*/

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});