import { shipOverlay } from '../js/factories/mapComponents';

describe('Map ships overlay test suite', () => {
    it('Map cell function exist', () => {
        expect(typeof shipOverlay).toBe('function');
    });

    it('Func must return an object', () => {
        const retVar = shipOverlay();
        expect(typeof retVar).toBe('object');
    });

    it('Func getShipsOverlay must return an object with 4 child ("shipSize", "position", isVertical", "shipType")', () => {
        const retVar = shipOverlay().getShipOverlay();

        expect(typeof retVar).toBe('object');
        expect(Object.keys(retVar)).toHaveLength(4);
        expect(Object.keys(retVar)).toContain('shipType');
        expect(Object.keys(retVar)).toContain('shipSize');
        expect(Object.keys(retVar)).toContain('isVertical');
        expect(Object.keys(retVar)).toContain('position');
    });
});
