
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function create(todoV, dateV, timeV){
    const [year, month, day] = dateV.split('-').map(Number);
    const [hour, minute] = timeV.split(':').map(Number); 
    const result = new Date(year, month - 1, day, hour, minute);
    console.log(todoV)
    console.log(dateV)
    console.log(timeV)
    fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: "follow",
        body: JSON.stringify({
            "todo": todoV,
            "date": result.toJSON()
        })
    }).then(() => {
        window.location.reload()
    })
}

function remove(id){ 
    fetch(`http://localhost:3000/delete/${id}`, { 
      method: 'DELETE', 
      redirect: "follow" 
    }).then(() => window.location.reload() ) 
}


function sublistener(ele){
    ele.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const todo = document.querySelector("#todo")
            const date = document.querySelector("#date")
            const time = document.querySelector("#time")
            create(todo.value, date.value, time.value)
            todo.value = ""
            date.value = ""
            time.value = ""
        }
    })
}

async function getTodos() {
    const res = await fetch('http://localhost:3000/all', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    });
    return await res.json();
}

function sortByDate(todos) {
    return todos.sort((todoA, todoB) => {
        const dateA = todoA.date
        const dateB = todoB.date
        if(dateA < dateB) {
            return -1;
        } else if(dateA > dateB) {
            return 1;
        } else {
            return 0;
        }
    })
}

function todosToDate(todos) {
    return todos.map((todo) => {
        todo.date = new Date(todo.date)
        return todo;
    })
}

function getWeek(date) {
    const startWeekDayIndex = 1; // 1 MonthDay 0 Sundays
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDay = firstDate.getDay();

    let weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
    if (startWeekDayIndex === 1) {
        if (date.getDay() === 0 && date.getDate() > 1) {
        weekNumber -= 1;
        }

        if (firstDate.getDate() === 1 && firstDay === 0 && date.getDate() > 1) {
        weekNumber += 1;
        }
    }
    return weekNumber;
}

function hasYear(deets, date) {
    if(deets[date.getFullYear()]) {
        return true;
    }
    return false;
}

function hasMonth(deets, date) {
    if(deets[date.getFullYear()][date.getMonth()]) {
        return true;
    }
    return false
}

function createYear(date) {
    let year = date.getFullYear()
    let yearEle = document.createElement('div')
    yearEle.innerHTML = year;
    yearEle.id = year
    yearEle.className = "year"
    document.querySelector("#todos").append(yearEle);
}

function createMonth(date) {
    let year = date.getFullYear()
    let month = date.getMonth()
    let parent = document.getElementById(year)

    let monthEle = document.createElement('div')
    monthEle.className = "month"
    monthEle.id = `${year}-${month}`
    monthEle.innerHTML = monthNames[month]
    parent.append(monthEle)
}

function hasWeek(deets, date) {
    if(deets[date.getFullYear()][date.getMonth()][getWeek(date)]) {
        return true;
    }
    return false;
}

function createWeek(date) {
    let year = date.getFullYear()
    let month = date.getMonth()
    let week = getWeek(date);
    let parent = document.getElementById(`${year}-${month}`)

    let weekEle = document.createElement('div')
    weekEle.className = "week"
    weekEle.id = `${year}-${month}-${week}`
    weekEle.innerHTML = `Week ${week}`
    parent.append(weekEle)
}

function hasDay(deets, date) {
    if(deets[date.getFullYear()][date.getMonth()][getWeek(date)][date.getDay()]) {
        return true;
    }
    return false;
}

function createDay(date) {
    let year = date.getFullYear()
    let month = date.getMonth()
    let week = getWeek(date);
    let day = date.getDay();
    let parent = document.getElementById(`${year}-${month}-${week}`)

    let dayEle = document.createElement('div')
    dayEle.className = "day"
    dayEle.id = `${year}-${month}-${week}-${day}`
    dayEle.innerHTML = dayNames[day]
    parent.append(dayEle)
}

function addDayta(todo, i) {
    let date = todo.date
    let year = date.getFullYear()
    let month = date.getMonth()
    let week = getWeek(date);
    let day = date.getDay();
    let parent = document.getElementById(`${year}-${month}-${week}-${day}`)

    let container = document.createElement("div")
    container.id = "dayRoot"

    let label = document.createElement("p")
    label.innerHTML = todo.todo
    label.id = "label"
    

    let time = document.createElement("p")
    time.id = i
    timer(date.getTime(), i)

    let deleteBtn = document.createElement("button");
    deleteBtn.type = "button"
    deleteBtn.innerHTML = "Delete"
    deleteBtn.addEventListener("click", () => {
        remove(todo.id)
    })

    container.append(label)
    container.append(time)
    container.append(deleteBtn)
    parent.append(container)
}

function createHtml(todos) {
    let deets = {}
    let i = 0
    todos.forEach((todo) => {
        const date = todo.date;
        console.log(deets)
        if(!hasYear(deets, date)) {
            deets[date.getFullYear()] = {"exists": true}
            createYear(date)
        }

        if(!hasMonth(deets, date)) {
            deets[date.getFullYear()][date.getMonth()] = {"exists": true};
            createMonth(date)
        }

        if(!hasWeek(deets, date)) {
            deets[date.getFullYear()][date.getMonth()][getWeek(date)] = {"exists":true};
            createWeek(date)
        }

        if(!hasDay(deets, date)) {
            deets[date.getFullYear()][date.getMonth()][getWeek(date)][date.getDay()] = {"exists": true};
            createDay(date);
        }

        addDayta(todo, i)

        i++
        console.log(todo)
    })
}

function pad(num) {
    return num.toString().padStart(2, '0');
}


function timer(time, id) {
    let a = setInterval(() => {
        let current = new Date().getTime();
        let dist = (time - current);
        if(dist > 0) {
            let seconds = Math.floor(dist / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            seconds = seconds % 60;
            minutes = minutes % 60;
            
            let display = `${hours}:${pad(minutes)}:${pad(seconds)}`
            document.getElementById(id).innerHTML = display;
        } else {
            document.getElementById(id).innerHTML = "Passed";
            clearInterval(a)
        }
    }, 1000, true)
}

addEventListener("DOMContentLoaded", async () => {

    console.log("datime")

    const data = sortByDate(todosToDate((await getTodos()).todos));

    console.log(data)
    createHtml(data);
    sublistener(document.querySelector("#todo"))
    sublistener(document.querySelector("#date"))
    sublistener(document.querySelector("#time"))
})