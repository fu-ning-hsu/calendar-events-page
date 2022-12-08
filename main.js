import './style.css'


const eventContainer = document.querySelector('#events-container')
const eventAmtToFetch = document.querySelector('#eventAmt')

const getMonth = (month) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month]
const getDayOfWeek = (weekday) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Staurday'][weekday]
const isAm = (hour) => hour < 12
const getHour = (hour) => (hour <= 12 ? hour : hour - 12)
const getMinute = (minute) => (minute == 0 ? '00' : minute)

function processDate(date) {
    const hour = getHour(date.getHours()) == 0 ? false : getHour(date.getHours())
    const minute = getMinute(date.getMinutes())
    const timeSuffix = `<small>${isAm(date.getHours()) ? `AM` : `PM`}</small>`
    const time = hour && `${hour}:${minute}${timeSuffix}`

    return {
        month: getMonth(date.getMonth()),
        weekday: getDayOfWeek(date.getDay()),
        time,
        date: date.getDate()
    }
}

function mapEventObject(event){
    const startDate = event.start.dateTime 
    ? processDate(new Date(event.start.dateTime)) 
    : processDate(new Date(`${event.start.date}T00:00:00`))

    const endDate = event.start.dateTime 
    ? processDate(new Date(event.end.dateTime)) 
    : processDate(new Date(`${event.end.date}T00:00:00`))

    let dateRange
    if (startDate.date !== endDate.date) {
        dateRange = `${startDate.month} ${startDate.date}-${endDate.month} ${endDate.date}`
    } else if (!startDate.time) {
        dateRange = `${startDate.month} ${startDate.date}`
    } else {
        dateRange = `${startDate.weekday}, ${startDate.time}-${endDate.time}`
    }

    return {
        name: event.summary,
        description: event.description,
        location: event.location,
        start: startDate,
        end: endDate,
        dateRange,
        link: event.htmlLink
    }
}

function createEvent(e, i) {
    return (
        `<article class="bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-800 rounded-lg">
            <div class="p-3 shadow bg-emerald-600 text-indigo-50 uppercase grid place-items-center rounded-t-lg">
            <div class="text-sm">${e.start.month}</div>
            <div class="text-3xl font-bold">${e.start.date}</div>
            </div>
            <div class="p-4 md:p-6 lg:p-8 grid gap-4 md:gap-6">
            <div class="grid gap-1">
                <p class="text-slate-400 text-sm">${e.dateRange}</p>
                <h2 class="font-bold text-2xl">
                <a class="tracking-wide" href="${e.link}">${e.name}</a>
                ${e.location ? `<p class="text-slate-400 text-sm font-normal mt-1">${e.location}</p>` : ''}
                </h2>
                ${e.description ? `
                <div class="grid gap-1">
                <button class="text-slate-500 flex gap-1 items-center cursor-pointer" aria-expanded="false" aria-controls="details-${i}" id="btn-${i}">
                    <p class="pointer-events-none tracking-wide mt-1">課程資訊</p>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 pointer-events-none transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div class="grid gap-1 hidden" id="details-${i}" aria-labelledby="btn-${i}">
                    <p class="text-slate-500">${e.description}</p>
                </div>
                </div>` : `<div class="h-4"></div>` }
            </div>
            <a target="_blank" href="${e.link}" class="bg-emerald-600 rounded-md px-4 py-2 text-emerald-50 shadow-2xl shadow-emerald-200 dark:shadow-none text-center font-bold hover:shadow-none ring ring-offset-0 ring-emerald-500 focus:outline-none focus:ring-offset-2 tracking-wider">我有興趣</a>
            </div>
        </article>`
    )
    
}

async function loadEvents(max=8) {
    try {
        const endpoint = await fetch(`./.netlify/functions/calFetch?maxResults=${max}`)
        const data = await endpoint.json()
        const processedEvents = data.map(e => mapEventObject(e))

        eventContainer.innerHTML = processedEvents.map((event, i) => createEvent(event, i)).join('')
    } catch(e) {
        eventContainer.innerHTML = `<p class="text-center text-3xl">Something went wrong!</p>`
        console.log(e)
    }
}

loadEvents()

eventContainer.addEventListener('click', (e) => {
    if (e.target.hasAttribute('aria-expanded')){
        e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') == 'false' ? 'true' : 'false')
        e.target.querySelector('svg').classList.toggle('rotate-180')
        e.target.nextElementSibling.classList.toggle('hidden')
    }
})

eventAmtToFetch.addEventListener('change', (e) => {
    loadEvents(eventAmtToFetch.value)
})
