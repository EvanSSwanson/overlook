import chai from 'chai';
import Booking from '../src/classes/Booking.js';
import Customer from '../src/classes/Customer.js';
const expect = chai.expect;

const customers = [
    {id: 1, name: "Leatha Ullrich" }, {id: 2, name: "Rocio Schuster"}
];

const bookings = [
    {
    id: "5fwrgu4i7k55hl6sz",
    userID: 1,
    date: "2022/04/22",
    roomNumber: 15
    },
    {
    id: "5fwrgu4i7k55hl6t5",
    userID: 2,
    date: "2022/01/24",
    roomNumber: 24
    }
];

describe('Booking', () => {
    let newCustomer1, newCustomer2, customerArray, newBooking1, newBooking2;

    beforeEach( () => {
        newCustomer1 = new Customer(customers[0]);
        newCustomer2 = new Customer(customers[1]);
        newBooking1 = new Booking(bookings[0]);
        newBooking2 = new Booking(bookings[1]);
        customerArray = [newCustomer1, newCustomer2];
      });

    it('should be a function', () => {
        expect(Booking).to.be.a('function');
      });

      it('should be an instance of Booking', () => {
        expect(newBooking1).to.be.an.instanceOf(Booking);
        expect(newBooking2).to.be.an.instanceOf(Booking);
      });

      it('should have an id', () => {
        expect(newBooking1.id).to.equal("5fwrgu4i7k55hl6sz");
        expect(newBooking2.id).to.equal("5fwrgu4i7k55hl6t5");
      });

      it('should have a customer id', () => {
        expect(newBooking1.customerId).to.equal(1);
        expect(newBooking2.customerId).to.equal(2);
      });

      it('should have a date', () => {
        expect(newBooking1.date).to.equal("2022/04/22");
        expect(newBooking2.date).to.equal("2022/01/24");
      });

      it('should have a room number', () => {
        expect(newBooking1.roomNumber).to.equal(15);
        expect(newBooking2.roomNumber).to.equal(24);
      });

      it('should have a millisecond date', () => {
        expect(newBooking1.micro).to.equal(1650603600000);
        expect(newBooking2.micro).to.equal(1643004000000);
      });

      it('should make an American date', () => {
        newBooking1.makeAmericanDate();
        expect(newBooking1.americanDate).to.equal("04/22/2022");
        expect(newBooking2.americanDate).to.equal(undefined);
      });

      it('should attach the customer name', () => {
        newBooking2.attachCustomerName(customerArray);
        expect(newBooking1.customerName).to.equal(undefined);
        expect(newBooking2.customerName).to.equal("Rocio Schuster");
      });
});