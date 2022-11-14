import chai from 'chai';
import Room from '../src/classes/Room.js';
const expect = chai.expect;

const rooms = [
    {
    number: 1,
    roomType: "residential suite",
    bidet: true,
    bedSize: "queen",
    numBeds: 1,
    costPerNight: 358.4
    },
    {
    number: 2,
    roomType: "suite",
    bidet: false,
    bedSize: "full",
    numBeds: 2,
    costPerNight: 477.38
    }
];

describe('Room', () => {
    let newRoom1, newRoom2;

    beforeEach( () => {
        newRoom1 = new Room(rooms[0]);
        newRoom2 = new Room(rooms[1]);
      });

    it('should be a function', () => {
        expect(Room).to.be.a('function');
      });

      it('should be an instance of Customer', () => {
        expect(newRoom1).to.be.an.instanceOf(Room);
        expect(newRoom2).to.be.an.instanceOf(Room);
      });

      it('should have a number', () => {
        expect(newRoom1.number).to.equal(1);
        expect(newRoom2.number).to.equal(2);
      });

      it('should have a type', () => {
        expect(newRoom1.type).to.equal("residential suite");
        expect(newRoom2.type).to.equal("suite");
      });

      it('should have a bed size', () => {
        expect(newRoom1.bedSize).to.equal("queen");
        expect(newRoom2.bedSize).to.equal("full");
      });

      it('should have the number of beds', () => {
        expect(newRoom1.numBeds).to.equal(1);
        expect(newRoom2.numBeds).to.equal(2);
      });

      it('should have the nightly cost', () => {
        expect(newRoom1.costPerNight).to.equal(358.4);
        expect(newRoom2.costPerNight).to.equal(477.38);
      });
});