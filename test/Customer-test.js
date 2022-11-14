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

describe('Customer', () => {
    let newCustomer1, newCustomer2, bookingArray, newBooking1, newBooking2;

    beforeEach( () => {
        newCustomer1 = new Customer(customers[0]);
        newCustomer2 = new Customer(customers[1]);
        newBooking1 = new Booking(bookings[0]);
        newBooking2 = new Booking(bookings[1]);
        bookingArray = [newBooking1, newBooking2];
      });

    it('should be a function', () => {
        expect(Customer).to.be.a('function');
      });

      it('should be an instance of Customer', () => {
        expect(newCustomer1).to.be.an.instanceOf(Customer);
        expect(newCustomer2).to.be.an.instanceOf(Customer);
      });

      it('should have an id', () => {
        expect(newCustomer1.id).to.equal(1);
        expect(newCustomer2.id).to.equal(2);
      });

      it('should have a name', () => {
        expect(newCustomer1.name).to.equal('Leatha Ullrich');
        expect(newCustomer2.name).to.equal('Rocio Schuster');
      });

      it('should store bookings', () => {
        newCustomer1.assignBookings(bookingArray);
        expect(newCustomer1.bookings[0]).to.deep.equal(newBooking1);
        expect(newCustomer1.bookings[1]).to.equal(undefined);
      });
});