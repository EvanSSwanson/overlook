class Booking {
    constructor(booking) {
        this.id = booking.id;
        this.customerId = booking.userID;
        this.date = booking.date;
        this.roomNumber = booking.roomNumber;
        this.micro = new Date(this.date).getTime();
    };

    makeAmericanDate() {
        const date = new Date(this.date);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        this.americanDate = `${month}/${day}/${year}`
    }

    attachCustomerName(customers) {
        customers.forEach(customer => {
            if(this.customerId === customer.id) {
                this.customerName = customer.name;
            };
        });
    };

};

export default Booking