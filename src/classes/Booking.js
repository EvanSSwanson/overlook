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
        if(month < 10 && day < 10) {
            this.americanDate = `0${month}/0${day}/${year}`
        } else if(month < 10 && day > 9) {
            this.americanDate = `0${month}/${day}/${year}`
        } else if(month > 9 && day < 10) {
            this.americanDate = `${month}/0${day}/${year}`
        } else {
            this.americanDate = `${month}/${day}/${year}`
        };
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
