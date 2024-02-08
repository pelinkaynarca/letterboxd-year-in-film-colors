let username;
const container = document.getElementById('container');

async function fetchColorPalette() {

  clearErrorMessages();
  
  username = document.getElementById('username').value;
  const yearInput = document.getElementById('year').value;
  const year = parseInt(yearInput, 10);

  if (!username && !yearInput) {
    document.getElementById('username').insertAdjacentHTML('afterend', '<p class="error text-sm text-red-600">please enter a username!</p>');
    document.getElementById('year').insertAdjacentHTML('afterend', '<p class="error text-sm text-red-600">please enter a year!</p>');
    return;
  }

  if (!username) {
    document.getElementById('username').insertAdjacentHTML('afterend', '<p class="error text-sm text-red-600">please enter a username!</p>');
    return;
  }

  if (!yearInput) {
    document.getElementById('year').insertAdjacentHTML('afterend', '<p class="error text-sm text-red-600">please enter a year!</p>');
    return;
  }

  if (isNaN(year) || year <= 0 || yearInput.length !== 4) {
    document.getElementById('year').insertAdjacentHTML('afterend', '<p class="error text-sm text-red-600">please enter a valid year!</p>');
    return;
  }

  const containerHomepageContent = document.getElementById('containerHomepageContent');
  containerHomepageContent.classList.remove('flex');
  containerHomepageContent.classList.add('hidden');

  const loaderWrapper = document.getElementById('loaderWrapper');
  loaderWrapper.classList.remove('hidden');
  loaderWrapper.classList.add('block');

  try {
    const response = await fetch(`http://localhost:3000/scrape?username=${username}&year=${year}`);
  
    if (!response.ok) {
      console.error(`Failed to fetch. HTTP error! Status: ${response.status}`);
      return;
    }
  
    const colorPaletteData = await response.json();
    console.log('Color Palette Data:', colorPaletteData);
  
    if (colorPaletteData.length === 0) {
      loaderWrapper.classList.add('hidden');
      const errorMessage = document.createElement('p');
      errorMessage.className = 'text-xl font-medium text-center text-red-600 mb-7 error';
      errorMessage.innerHTML = `no data found for <br> ${username} in ${year}!`;
      container.appendChild(errorMessage);
  
      const tryAgainButton = document.createElement('button');
      tryAgainButton.className = 'flex flex-row items-center justify-center w-36 p-2 text-xl font-medium text-LB-Gray rounded-[4px] h-12 bg-LB-Orange border-2 border-LB-Gray hover:scale-[103%] hover:shadow-md hover:shadow-LB-Gray';
      tryAgainButton.textContent = 'TRY AGAIN';
      tryAgainButton.onclick = redirectToHomepage;
      container.appendChild(tryAgainButton);
  
      function redirectToHomepage() {
        location.href = "./index.html";
      }
      return;
    }
    
    renderYearlyCalendar(colorPaletteData, year);
  
    loaderWrapper.classList.add('hidden');
  } catch (error) {
    console.error('Error during fetch:', error.message);
  }
}

function clearErrorMessages() {
  const usernameError = document.querySelector('#username + .error');
  const yearError = document.querySelector('#year + .error');

  if (usernameError) {
    usernameError.remove();
  }

  if (yearError) {
    yearError.remove();
  }
}

function getColor(date, colorPaletteData) {
  // format date as 'MM/DD'
  const formattedDate = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
  const items = colorPaletteData.filter(item => item.viewingDate === formattedDate);
  const colors = items.map(item => item.dominantColor);
  return colors.length ? averageColor(colors) : 'rgba(0, 0, 0, 0.15)';
}

function averageColor(colors) {
  let r = 0, g = 0, b = 0;

  for (let color of colors) {
    r += parseInt(color.slice(1, 3), 16);
    g += parseInt(color.slice(3, 5), 16);
    b += parseInt(color.slice(5, 7), 16);
  }

  r = Math.floor(r / colors.length);
  g = Math.floor(g / colors.length);
  b = Math.floor(b / colors.length);

  return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

function renderYearlyCalendar(colorPaletteData, year) {
  
  // create and append the title
  const tableTitle = document.createElement('h2');
  tableTitle.innerHTML = `${username}'s ${year}<br> in Film Colors`;
  tableTitle.className = "mb-8 text-2xl font-semibold text-center 2xl:mb-12 xl:text-3xl 2xl:text-4xl font-title-font text-LB-Gray";

  // create table
  const table = document.createElement('table');
  table.id = "table";
  table.className = "border-separate";
  const startDate = new Date(year, 0, 1); // the start date of the calendar
  const startDay = startDate.getDay(); // the day of the week of the start date

  // create a wrapper for the table
  const tableWrapper = document.createElement('div');
  tableWrapper.className = "flex flex-col justify-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-LB-Gray scrollbar-track-headerBgLight";
  tableWrapper.appendChild(table); // append the table to the wrapper

  // append the title and the table to the container
  container.appendChild(tableTitle);
  container.appendChild(tableWrapper);

  // create an array of month names
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // create an array of colspan for each month
  const colSpanForMonth = [4, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 5];

  // create a row for month headings 
  const monthRow = document.createElement('tr');
  for (let i = 0; i < 12; i++) {
    const monthCell = document.createElement('th');
    monthCell.textContent = months[i];
    monthCell.colSpan = colSpanForMonth[i]; // set colspan according to the array
    monthRow.appendChild(monthCell);
  }
  table.appendChild(monthRow);

  for (let i = 0; i < 7; i++) { // for each day of the week
    const row = document.createElement('tr');
    for (let j = 0; j < (isLeapYear(year) ? 53 : 52); j++) { // adjust weeks for leap year
      const cell = document.createElement('td');
      const date = new Date(startDate.getTime() + (((j * 7 + i) - startDay) * 24 * 60 * 60 * 1000));
      cell.style.backgroundColor = getColor(date, colorPaletteData); // pass the date object directly
      cell.className = "w-[12px] h-[12px] min-w-[12px] max-w-[12px] min-h-[12px] max-h-[12px]";
      cell.title = date.toDateString();
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  /*
    // create and append the download button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Table';
    container.appendChild(downloadButton);
    downloadButton.addEventListener('click', async () => {
      const response = await fetch('/screenshot');
      const blob = await response.blob();
    
      // Create a new object URL for the blob
      const url = URL.createObjectURL(blob);
    
      // Create a link and click it to start the download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'screenshot.png';
      document.body.appendChild(a);
      a.click();
    
      // After triggering the download, revoke the object URL and remove the link
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    });
  */
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}