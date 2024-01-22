function showSpinner() {
  const table = document.getElementById('table');
  const spinner = document.createElement('div');
  spinner.className = 'inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]';
  const span = document.createElement('span');
  span.className = '!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]';
  span.innerText = 'Loading...';
  table.appendChild(spinner);
  table.appendChild(span);

  const formContainer = document.getElementById('homepageFormContainer');
  formContainer.classList.add('hidden', 'transition-opacity', 'duration-500', 'ease-in-out');
}

// Function to hide the spinner and show the form
function hideSpinner() {
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.remove();
  }

  const formContainer = document.getElementById('homepageFormContainer');
  formContainer.classList.remove('opacity-0');
}

async function fetchColorPalette() {
  const username = document.getElementById('username').value;
  const yearInput = document.getElementById('year').value;
  const year = parseInt(yearInput, 10);

  // check if username or year is empty
  if (!username) {
    document.getElementById('username').insertAdjacentHTML('afterend', '<p class="error text-LB-Orange">Please enter a username.</p>');
    return;
  }

  if (!yearInput) {
    document.getElementById('year').insertAdjacentHTML('afterend', '<p class="error text-LB-Orange">Please enter a year.</p>');
    return;
  }

  // check if year is a 4-digit number
  if (isNaN(year) || year <= 0 || yearInput.length !== 4) {
    document.getElementById('year').insertAdjacentHTML('afterend', '<p class="error text-LB-Orange">Please enter a valid year.</p>');
    return;
  }

  // show the spinner and hide the form before starting the fetch
  showSpinner();

  try {
    const response = await fetch(`https://yearinfilmcolors.onrender.com/scrape?username=${username}&year=${year}`);

    if (!response.ok) {
      console.error(`Failed to fetch. HTTP error! Status: ${response.status}`);
      return;
    }

    const colorPaletteData = await response.json();
    console.log('Color Palette Data:', colorPaletteData);
    renderYearlyCalendar(colorPaletteData, year);
  } catch (error) {
    console.error('Error during fetch:', error.message);
  } finally {
    // Hide the spinner and show the form after the fetch is done
    hideSpinner();
  }
}

function getColor(date, colorPaletteData) {
  // format date as 'MM/DD'
  const formattedDate = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
  const items = colorPaletteData.filter(item => item.viewingDate === formattedDate);
  const colors = items.map(item => item.dominantColor);
  return colors.length ? averageColor(colors) : 'rgba(0, 0, 0, 0.05)';
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
  const table = document.querySelector('#calendar');
  const startDate = new Date(year, 0, 1); // the start date of the calendar
  const startDay = startDate.getDay(); // the day of the week of the start date

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
      cell.title = date.toDateString();
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}




