import { shipList } from '../js/factories/mapComponents';

describe('Ship list overlay test suite', () => {
    it('Ship list function exist', () => {
        expect(typeof shipList).toBe('function');
    });

    it('Func must return an object', () => {
        const retVar = shipList();
        expect(typeof retVar).toBe('object');
    });

    it('Func getShipsOverlay must has an array with 5 child, each child must has 5 properties ("shipType","shipSize","isVertical","shipColStartPos","shipRowStartPos")', () => {
        const ship = shipList();
        ship.createShipList();

        const retVar = ship.getShipList();

        expect(typeof retVar).toBe('object');
        expect(Object.keys(retVar)).toHaveLength(5);
        retVar.forEach((child) => {
            expect(Object.keys(child)).toHaveLength(5);
            expect(Object.keys(child)).toContain('shipType');
            expect(Object.keys(child)).toContain('shipSize');
            expect(Object.keys(child)).toContain('isVertical');
            expect(Object.keys(child)).toContain('shipColStartPos');
            expect(Object.keys(child)).toContain('shipRowStartPos');
        });
    });
});
