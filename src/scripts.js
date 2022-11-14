import './css/styles.css';
import './images/turing-logo.png'
import './images/pineapple-logo.png'
import Customer from './classes/Customer.js';
import Room from './classes/Room.js';
import Booking from './classes/Booking.js';

//GLOBAL VARIABLES
let loginId;
let customersData;
let roomsData;
let bookingsData;
let allCustomers;
let allBookings;
let allRooms;
let currentCustomer;
let possibleRooms;
let pickedRoom;
let vacancyMicro;
let filteredSelection = 'all';
let tempRoom;

//API CALLS
function gatherData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(err => console.log(err))
};

function instantiateAllData() {
    Promise.all([
        gatherData('http://localhost:3001/api/v1/bookings'),
        gatherData('http://localhost:3001/api/v1/customers'),
        gatherData('http://localhost:3001/api/v1/rooms')
    ]).then(data => {
        bookingsData = data[0].bookings;
        customersData = data[1].customers;
        roomsData = data[2].rooms;
        setData();
    });
};

function postBooking(customer, date, room) {
    const dateArray = date.value.split('-');
    console.log(customer.id, dateArray.join('/'), room.number);
    fetch('http://localhost:3001/api/v1/bookings', {
      method: 'POST',
      body: JSON.stringify({
        "userID": customer.id,
        "date": dateArray.join('/'),
        "roomNumber": room.number
    }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

//QUERY SELECTORS
const usernameInput = document.querySelector('.username-input');
const passwordInput = document.querySelector('.password-input');
const loginButton = document.querySelector('.login-button');
const loginPromptContainer = document.querySelector('.login-prompt-container');
const loginView = document.querySelector('.login-view');
const dashView = document.querySelector('.home-view');
const bookingView = document.querySelector('.booking-view');
const greeting = document.querySelector('.greeting');
const loginReturnButton = document.querySelector('.login-return-button');
const dashReturnButton = document.querySelector('.dash-return-button');
const upcomingBookings = document.querySelector('.upcoming-bookings');
const pastBookings = document.querySelector('.past-bookings');
const bookButton = document.querySelector('.book-button');
const availableRooms = document.querySelector('.available-rooms');
const totalBill = document.querySelector('.total-bill');
const submitButton = document.querySelector('.submit-button');
const centralDropdownContainer = document.querySelector('.central-dropdown-container');
const manipulatedCentralContainer = document.querySelector('.manipulated-central-container');
const vacancy = document.querySelector('.vacancy');
const allButton = document.querySelector('#all');
const singleButton = document.querySelector('#single');
const juniorButton = document.querySelector('#junior');
const suiteButton = document.querySelector('#suite');
const residentialButton = document.querySelector('#residential');

//GLOBAL EVENT LISTENERS
window.addEventListener('load', instantiateAllData);
loginButton.addEventListener('click', checkLogin);
loginReturnButton.addEventListener('click', showLoginView);
dashReturnButton.addEventListener('click', loadDashView);
bookButton.addEventListener('click', showBookingView);
submitButton.addEventListener('click', renderPossibleBookings);
allButton.addEventListener('click', showFilteredRooms);
singleButton.addEventListener('click', showFilteredRooms);
juniorButton.addEventListener('click', showFilteredRooms);
suiteButton.addEventListener('click', showFilteredRooms);
residentialButton.addEventListener('click', showFilteredRooms);

//FUNCTIONS
function setData() {
    getAllBookings(bookingsData);
    getAllCustomers(customersData);
    getAllRooms(roomsData);
};

function checkLogin() {
    const customerCheck = usernameInput.value.slice(0, 8);
    loginId = usernameInput.value.split('r')[1];
    if(customerCheck === 'customer' && (loginId % 1 === 0) && (1 <= loginId <= 50) && passwordInput.value === 'overlook2021') {
        loadPage();
    } else {
        loginPromptContainer.innerHTML = '';
        loginPromptContainer.innerHTML = `<img class="mini-pineapple" src="./images/pineapple-logo.png" alt="hospitality pineapple">
        <h2 class="fail-prompt">Your inputs do not match any user profiles; please try again:</h2>
        <img class="mini-pineapple" src="./images/pineapple-logo.png" alt="hospitality pineapple">`
    };
};

function getAllBookings(data) {
    allBookings = data.reduce((acc, datum) => {
        let booking = new Booking(datum);
        booking.attachCustomerName(customersData);
        booking.makeAmericanDate();
        acc.push(booking);
        return acc;
    }, []);
};

function getAllCustomers(data) {
    allCustomers = data.reduce((acc, datum) => {
        let customer = new Customer(datum);
        customer.assignBookings(allBookings);
        acc.push(customer);
        return acc;
    }, []);
};

function getAllRooms(data) {
    allRooms = data.reduce((acc, datum) => {
        acc.push(new Room(datum));
        return acc;
    }, []);
};

function loadPage() {
    const loginPosition = loginId - 1;
    currentCustomer = allCustomers[loginPosition];
    renderDashboard(currentCustomer);
    console.log('allCustomers: ', allCustomers);
    console.log('allBookings: ', allBookings);
    console.log('allRooms: ', allRooms);
    console.log('currentCustomer.bookings: ', currentCustomer.bookings);
    showDashView();
};

function renderDashboard(customer) {
    greeting.innerText = '';
    greeting.innerText = `Welcome, ${customer.name}!`;
    renderCustomerBookings();
};

function renderCustomerBookings() {
    findFullyBooked();
    let upcomingRooms = [];
    if(tempRoom !== undefined) {
        upcomingRooms.push(tempRoom);
    };
    let pastRooms = [];
    allRooms.forEach(room => {
        return currentCustomer.bookings.forEach(booking => {
            if(booking.roomNumber === room.number && booking.micro > new Date().getTime()) {
                let obj = {};
                obj['roomInfo'] = room;
                obj['date'] = booking.americanDate;
                obj['micro'] = booking.micro;
                upcomingRooms.push(obj);
            };
            if(booking.roomNumber === room.number && booking.micro < new Date().getTime()) {
                let obj = {};
                obj['roomInfo'] = room;
                obj['date'] = booking.americanDate;
                obj['micro'] = booking.micro;
                pastRooms.push(obj);
            };
        });
    });
    const sortedUpcomings = upcomingRooms.sort((a, b) => {
        return a['micro'] - b['micro'];
    });
    const sortedPasts = pastRooms.sort((a, b) => {
        return b['micro'] - a['micro'];
    });
    console.log('tempRoom: ', tempRoom)
    console.log('sortedUpcomings: ', sortedUpcomings);
    upcomingBookings.innerHTML = '';
    upcomingBookings.innerHTML = sortedUpcomings.map(room => {
        let bed;
        if(room.roomInfo.numBeds === 1) {
            bed = 'bed'
        } else {
            bed = 'beds'
        };
        return `<li class="booking-card">
            <div class="card-top">
                <h3 class="booking-room">Room ${room.roomInfo.number}</h3>
                <p class="booking-date">${room.date}</p>
            </div>
            <p class="booking-type">${room.roomInfo.type}</p>
            <p class="booking-beds">${room.roomInfo.numBeds} ${room.roomInfo.bedSize} ${bed}</p>
            <p class="booking-cost">per night: $${(Math.round(room.roomInfo.costPerNight * 100) / 100).toFixed(2)}</p>
        </li>`
    }).join('');
    pastBookings.innerHTML = '';
    pastBookings.innerHTML = sortedPasts.map(room => {
        let bed;
        if(room.roomInfo.numBeds === 1) {
            bed = 'bed'
        } else {
            bed = 'beds'
        };
        return `<li class="booking-card">
            <div class="card-top">
                <h3 class="booking-room">Room ${room.roomInfo.number}</h3>
                <p class="booking-date">${room.date}</p>
            </div>
            <p class="booking-type">${room.roomInfo.type}</p>
            <p class="booking-beds">${room.roomInfo.numBeds} ${room.roomInfo.bedSize} ${bed}</p>
            <p class="booking-cost">per night: $${(Math.round(room.roomInfo.costPerNight * 100) / 100).toFixed(2)}</p>
        </li>`
    }).join('');
    totalBill.innerText = '';
    totalBill.innerText = `Total Bill: $${(Math.round(pastRooms.reduce((acc, room) => {
        return acc + room.roomInfo.costPerNight
    }, 0) * 100) / 100).toFixed(2)}`;
};

function showFilteredRooms(event) {
    filteredSelection = event.target.id;
    renderPossibleBookings();
};

function renderPossibleBookings() {
    let chosenDate = convertVacancyDate();
    if(vacancyMicro < Date.now()) {
       showInvalidMessage('future');
    } else if(chosenDate.includes('N')) {
        showInvalidMessage('valid');
    } else {
        const thatDaysBookedRooms = allBookings.reduce((acc, booking) => {
            if(booking.americanDate === chosenDate) {
                acc.push(booking.roomNumber);
            };
            return acc;
        }, []);
        if(filteredSelection === 'all') {
            possibleRooms = allRooms.reduce((acc, room) => {
                if(!thatDaysBookedRooms.includes(room.number)) {
                    acc.push(room);
                };
                return acc;
            }, []);
        } else {
            possibleRooms = allRooms.reduce((acc, room) => {
                if(!thatDaysBookedRooms.includes(room.number) && room.type.split(' ')[0] === filteredSelection) {
                    acc.push(room);
                };
                return acc;
            }, []);
        };
        if(possibleRooms.length === 0) {
            apologizeProfusely();
        } else {
            showDatePicker();
        };
        availableRooms.innerHTML = '';
        availableRooms.innerHTML = possibleRooms.map(room => {
            let bed;
            if(room.numBeds === 1) {
                bed = 'bed'
            } else {
                bed = 'beds'
            };
            return `<li class="booking-card">
                <button class="card-button" id="button-${room.number}"><div class="booking-card-top" id="top-${room.number}">
                    <h3 class="booking-room" id="room-${room.number}">Room ${room.number}</h3>
                    <p class="booking-date" id="date-${room.number}">${chosenDate}</p>
                </div>
                <p class="booking-type" id="type-${room.number}">${room.type}</p>
                <p class="booking-beds" id="beds-${room.number}">${room.numBeds} ${room.bedSize} ${bed}</p>
                <p class="booking-cost" id="cost-${room.number}">per night: $${(Math.round(room.costPerNight * 100) / 100).toFixed(2)}</p></button>
            </li>`
        }).join('');
        const cardButton = document.querySelectorAll('.card-button', '.booking-card-top', '.booking-room', '.booking-date', '.booking-type', 'booking-beds', '.bookinh-cost');
        cardButton.forEach(button => {
            button.addEventListener('click', selectRoom)
        });
    };
};

function convertVacancyDate() {
    let backslashVacancyDate = vacancy.value.split('-');
        const date = new Date(backslashVacancyDate.join('/'));
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        vacancyMicro = date.getTime();
        if(month < 10 && day < 10) {
            return `0${month}/0${day}/${year}`
        } else if(month < 10 && day > 9) {
            return `0${month}/${day}/${year}`
        } else if(month > 9 && day < 10) {
            return `${month}/0${day}/${year}`
        } else {
            return `${month}/${day}/${year}`
        };
};

function selectRoom(event) {
    const targetId = event.target.id.split('-');
    pickedRoom = possibleRooms.find(room => room.number === parseInt(targetId[1]));
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="chosen-message">You have chosen Room ${pickedRoom.number} on ${convertVacancyDate()}</h2>
        <button class="confirm-button">Confirm Reservation</button>
        <button class="backtrack-button">Pick Another Date</button>`
    const confirmButton = document.querySelector('.confirm-button');
    const backtrackButton = document.querySelector('.backtrack-button');
    confirmButton.addEventListener('click', reserveRoom);
    backtrackButton.addEventListener('click', showDatePicker);
    console.log(possibleRooms);
    console.log(pickedRoom);
    centralDropdownContainer.classList.add('hidden');
    manipulatedCentralContainer.classList.remove('hidden');
};

function reserveRoom() {
    postBooking(currentCustomer, vacancy, pickedRoom);
    tempRoom = {};
    tempRoom['roomInfo'] = pickedRoom;
    tempRoom['date'] = convertVacancyDate();
    tempRoom['micro'] = vacancyMicro;
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="success-message">Success! Room ${pickedRoom.number} will be ready for you on ${convertVacancyDate()}.</h2>
        <button class="book-another-button">Book Another Room</button>`
    const bookAnotherButton = document.querySelector('.book-another-button');
    bookAnotherButton.addEventListener('click', showDatePicker);
    instantiateAllData();
};

function loadDashView() {
    loadPage();
    showDashView();
};

function showInvalidMessage(invalid) {
    availableRooms.innerHTML = '';
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="too-early-message">Please pick a *${invalid}* day</h2>
    <button class="backtrack-button">Pick Another Date</button>`;
    const backtrackButton = document.querySelector('.backtrack-button');
    backtrackButton.addEventListener('click', showDatePicker);
    centralDropdownContainer.classList.add('hidden');
    manipulatedCentralContainer.classList.remove('hidden');
};

function apologizeProfusely() {
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="apology-message">im so sorry bro you gotta forgive me bro please but theres no rooms available bro forgive me im so sorry bro please pick another room dont be mad at me bro please</h2>
    <button class="backtrack-button">Pick Another Date</button>`;
    const backtrackButton = document.querySelector('.backtrack-button');
    backtrackButton.addEventListener('click', showDatePicker);
    centralDropdownContainer.classList.add('hidden');
    manipulatedCentralContainer.classList.remove('hidden');
};

function showDatePicker() {
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="choose-message">Choose a Date to Find Available Rooms:</h2>
    <div class="date-picker-container">
        <input type="date" class="vacancy" id="vacancy" name="vacancy">
        <button class="submit-button">Find Rooms</button>
    </div>`
    manipulatedCentralContainer.classList.add('hidden');
    centralDropdownContainer.classList.remove('hidden');
};

//This function below is currently just to keep things straight in my own head. IT WILL NOT BE IN THE FINAL COPY!
function findFullyBooked() {
    const firstArray = allBookings.reduce((acc, booking) => {
        const hhh = booking.americanDate;
        if(acc[hhh] === undefined) {
            acc[hhh] = [];
        };
        acc[hhh].push(booking);
        return acc;
    }, []);
    
    console.log('firstArray: ', firstArray)
};

//TOGGLE HIDDEN FUNCTIONS
function showLoginView() {
    usernameInput.value = '';
    passwordInput.value = '';
    dashView.classList.add('hidden');
    loginReturnButton.classList.add('hidden');
    loginView.classList.remove('hidden');
}

function showBookingView() {
    bookingView.classList.remove('hidden');
    loginReturnButton.classList.add('hidden');
    dashView.classList.add('hidden');
    dashReturnButton.classList.remove('hidden');
};

function showDashView() {
    dashView.classList.remove('hidden');
    dashReturnButton.classList.add('hidden');
    bookingView.classList.add('hidden');
    loginReturnButton.classList.remove('hidden');
    loginView.classList.add('hidden');
};