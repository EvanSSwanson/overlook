class Booking {
    constructor(booking) {
        this.id = booking.id;
        this.customerId = booking.userID;
        this.date = booking.date;
        this.roomNumber = booking.roomNumber;
        this.micro = new Date(this.date).getTime();
    };

    attachCustomerName(customers) {
        customers.forEach(customer => {
            if(this.customerId === customer.id) {
                this.customerName = customer.name;
            };
        });
    };

};

export default Booking