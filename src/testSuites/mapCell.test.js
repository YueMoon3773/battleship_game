import { mapCell } from '../js/factories/mapComponents';

describe('Map cell test suite', () => {
    it('Map cell function exist', () => {
        expect(typeof mapCell).toBe('function');
    });

    it('Func must return an object', () => {
        const retVar = mapCell(1, 1);
        expect(typeof retVar).toBe('object');
    });

    it('Func getMapCell must return an object with 8 child ("row", "col", "id", "isFired", "isHasShip", "isDisabled", teamSide", "shipType")', () => {
        const retVar = mapCell(1, 1).getCell();

        expect(typeof retVar).toBe('object');
        expect(Object.keys(retVar)).toHaveLength(8);
        expect(Object.keys(retVar)).toContain('row');
        expect(Object.keys(retVar)).toContain('col');
        expect(Object.keys(retVar)).toContain('id');
        expect(Object.keys(retVar)).toContain('isFired');
        expect(Object.keys(retVar)).toContain('isDisabled');
        expect(Object.keys(retVar)).toContain('isHasShip');
        expect(Object.keys(retVar)).toContain('shipType');
        expect(Object.keys(retVar)).toContain('teamSide');
    });
});
