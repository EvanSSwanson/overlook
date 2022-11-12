class Customer {
    constructor(customer) {
        this.name = customer.name;
        this.id = customer.id;
        this.bookings = [];
    };

    assignBookings(bookings) {
        bookings.forEach(booking => {
            if(booking.customerId === this.id) {
                this.bookings.push(booking);
            };
        });
    };
};





export default Customer