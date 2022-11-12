import './css/styles.css';
import './images/turing-logo.png'
import './images/pineapple-logo.png'
import Customer from './classes/Customer.js';


console.log('This is the JavaScript entry file - your code begins here.');

//GLOBAL VARIABLES
let customersData;
let roomsData;
let bookingsData;
let currentCustomer;

//API CALLS
let gatherData = (url) => {
    return fetch(url)
      .then(response => response.json())
      .catch(err => console.log(err))
  };
  
function instantiateAllData() {
    Promise.all([
        gatherData('http://localhost:3001/api/v1/customers'),
        gatherData('http://localhost:3001/api/v1/rooms'),
        gatherData('http://localhost:3001/api/v1/bookings')
    ]).then(data => {
        customersData = data[0].customers;
        roomsData = data[1].rooms;
        bookingsData = data[2].bookings;
    });
};

function instantiateCertainCustomer() {
    let userId = 14
    fetch(`http://localhost:3001/api/v1/customers/${userId}`)
    .then(response => response.json())
    .then(data => {
    currentCustomer = new Customer(data);
    renderCustomer(currentCustomer)
    })
    .catch(err => console.log(err))
};

//QUERY SELECTORS
const greeting = document.querySelector('.greeting');
const loginReturnButton = document.querySelector('.login-return-button');

//GLOBAL EVENT LISTENERS
window.addEventListener('load', instantiateAllData);
loginReturnButton.addEventListener('click', instantiateCertainCustomer)

//FUNCTIONS
function renderCustomer(customer) {
    greeting.innerText = '';
    greeting.innerText = `Welcome, ${customer.name}!`;
  };