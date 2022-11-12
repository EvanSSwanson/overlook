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
let currentCustomer;
let allCustomers;
let allBookings;
let allRooms;

//API CALLS
let gatherData = (url) => {
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

// function instantiateCertainCustomer() {
//     let userId = 14
//     fetch(`http://localhost:3001/api/v1/customers/${userId}`)
//     .then(response => response.json())
//     .then(data => {
//     currentCustomer = new Customer(data);
//     renderDashboard(currentCustomer);
//     })
//     .catch(err => console.log(err))
// };

//QUERY SELECTORS
const greeting = document.querySelector('.greeting');
const loginReturnButton = document.querySelector('.login-return-button');

//GLOBAL EVENT LISTENERS
window.addEventListener('load', instantiateAllData);
loginReturnButton.addEventListener('click', loadPage)

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
    console.log(allCustomers);
    console.log(allBookings);
    console.log(allRooms);
};

function renderDashboard(customer) {
    greeting.innerText = '';
    greeting.innerText = `Welcome, ${customer.name}!`;
    
  };