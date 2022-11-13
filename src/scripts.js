import './css/styles.css';
import './images/turing-logo.png'
import './images/pineapple-logo.png'
import Customer from './classes/Customer.js';
import Room from './classes/Room.js';
import Booking from './classes/Booking.js';


console.log('This is the JavaScript entry file - your code begins here.');

//GLOBAL VARIABLES
let customersData;
let roomsData;
let bookingsData;
let allCustomers;
let allBookings;
let allRooms;
let currentCustomer;

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

//QUERY SELECTORS
const greeting = document.querySelector('.greeting');
const loginReturnButton = document.querySelector('.login-return-button');
const upcomingBookings = document.querySelector('.upcoming-bookings');
const pastBookings = document.querySelector('.past-bookings');
const availableRooms = document.querySelector('.available-rooms');
const totalBill = document.querySelector('.total-bill');
const testButton = document.querySelector('.test-button');
const vacancy = document.querySelector('.vacancy');

//GLOBAL EVENT LISTENERS
window.addEventListener('load', instantiateAllData);
loginReturnButton.addEventListener('click', loadPage);
testButton.addEventListener('click', renderPossibleBookings);

//FUNCTIONS
function setData() {
    getAllBookings(bookingsData);
    getAllCustomers(customersData);
    getAllRooms(roomsData);
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
    let userId = 14 - 1;
    currentCustomer = allCustomers[userId];
    renderDashboard(currentCustomer);
    console.log('allCustomers: ', allCustomers);
    console.log('allBookings: ', allBookings);
    console.log('allRooms: ', allRooms);
    console.log('currentCustomer.bookings: ', currentCustomer.bookings);
};

function renderDashboard(customer) {
    greeting.innerText = '';
    greeting.innerText = `Welcome, ${customer.name}!`;
    renderCustomerBookings();
};

function renderCustomerBookings() {
    findFullyBooked();
    let upcomingRooms = [];
    let pastRooms = [];
    allRooms.forEach(room => {
        return currentCustomer.bookings.forEach(booking => {
            if(booking.roomNumber === room.number && booking.micro > new Date().getTime()) {
                let obj = {};
                obj['roomInfo'] = room;
                obj['date'] = booking.americanDate;
                upcomingRooms.push(obj);
            };
            if(booking.roomNumber === room.number && booking.micro < new Date().getTime()) {
                let obj = {};
                obj['roomInfo'] = room;
                obj['date'] = booking.americanDate;
                pastRooms.push(obj);
            };
        });
    });
    upcomingBookings.innerHTML = '';
    upcomingBookings.innerHTML = upcomingRooms.map(room => {
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
    pastBookings.innerHTML = pastRooms.map(room => {
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

function renderPossibleBookings() {
    let chosenDate = convertVacancyDate();
    const thatDaysBookedRooms = allBookings.reduce((acc, booking) => {
        if(booking.americanDate === chosenDate) {
            acc.push(booking.roomNumber);
        };
        return acc;
    }, []);
    const possibleRooms = allRooms.reduce((acc, room) => {
        if(!thatDaysBookedRooms.includes(room.number)) {
            acc.push(room);
        };
        return acc;
    }, []);
    availableRooms.innerHTML = '';
    availableRooms.innerHTML = possibleRooms.map(room => {
        let bed;
        if(room.numBeds === 1) {
            bed = 'bed'
        } else {
            bed = 'beds'
        };
        return `<li class="booking-card">
            <div class="card-top">
                <h3 class="booking-room">Room ${room.number}</h3>
                <p class="booking-date">${chosenDate}</p>
            </div>
            <p class="booking-type">${room.type}</p>
            <p class="booking-beds">${room.numBeds} ${room.bedSize} ${bed}</p>
            <p class="booking-cost">per night: $${(Math.round(room.costPerNight * 100) / 100).toFixed(2)}</p>
        </li>`
    }).join('');
};

function convertVacancyDate() {
    let backslashVacancyDate = vacancy.value.split('-');
        const date = new Date(backslashVacancyDate.join('/'));
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
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

//This function below is currently just to keep things straight in my own head; IT WILL NOT BE IN THE FINAL COPY!
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
}