/**
 *
 * @param {string} mapType: prep/game
 * @param {string} teamSide: team/enemy
 * @returns
 */
const mapGrid = (mapType, teamSide) => {
    if (!mapType || !teamSide) {
        throw new Error('missing input mapType or teamSide');
    }
    if (typeof teamSide !== 'string' || typeof teamSide !== 'string') {
        throw new Error('mapType and teamSide must be a string');
    }

    const map = {
        mapRows: 10,
        mapCols: 10,
        mapGrid: [],
        mapType,
        teamSide,
        mapCellsSafe: new Set(),
        mapCellsFired: new Set(),
    };

    const buildMapGrid = () => {
        for (let row = 0; row < map.mapRows; row++) {
            map.mapGrid[row] = [];
            for (let col = 0; col < map.mapCols; col++) {
                const cellInfo = mapCell(row, col);
                map.mapGrid[row].push(cellInfo);
                map.mapCellsSafe.add(cellInfo.getCell().id);
            }
        }
        // console.log(mapGrid);
        // return mapGrid;
    };

    const findCellIndexesInMap = (cellId) => {
        let targetCellRow = 0;
        let targetCellCol = 0;
        let foundCell = false;

        for (targetCellRow; targetCellRow < map.mapRows; targetCellRow++) {
            for (targetCellCol; targetCellCol < map.mapCols; targetCellCol++) {
                if (getMapGrid()[targetCellRow][targetCellCol].getCell().id === cellId) {
                    foundCell = true;
                    break;
                }
            }
            if (foundCell) {
                break;
            }
        }

        // console.log({ targetCellRow });
        // console.log({ targetCellCol });

        return {
            targetCellRow,
            targetCellCol,
        };
    };

    const addFiredCellInMap = (cellId) => {
        map.mapCellsFired.add(cellId);
    };

    const removeSafeCellInMap = (cellId) => {
        map.mapCellsSafe.delete(cellId);
    };

    const getCellInfoById = (cellId) => {
        const { targetCellRow, targetCellCol } = findCellIndexesInMap(cellId);

        return getMapGrid()[targetCellRow][targetCellCol].getCell();
    };

    const updateFiredCellInMap = (cellId) => {
        if (!cellId || getFiredCells().has(cellId)) {
            return;
        } else {
            const { targetCellRow, targetCellCol } = findCellIndexesInMap(cellId);

            getMapGrid()[targetCellRow][targetCellCol].toggleCellIsFired();
            addFiredCellInMap(cellId);
            removeSafeCellInMap(cellId);
        }
    };

    const getMap = () => map;
    const getMapGrid = () => map.mapGrid;
    const getSafeCells = () => map.mapCellsSafe;
    const getFiredCells = () => map.mapCellsFired;

    return {
        buildMapGrid,
        getMap,
        getMapGrid,
        getCellInfoById,
        getSafeCells,
        getFiredCells,
        updateFiredCellInMap,
    };
};

const mapCell = (row, col) => {
    if (!row || !col) {
        throw new Error('missing input row or col');
    }
    if (typeof row !== 'number' || typeof col !== 'number' || row < 0 || row > 10 || col < 0 || col > 10) {
        throw new Error('input row and col must be a number from 0 to 10');
    }

    let cell = {
        row: row + 1,
        col: col + 1,
        id: `R,${row + 1},C,${col + 1}`,
        teamSide: '',
        isFired: false,
        isDisabled: false,
        isHasShip: false,
        shipType: '',
    };

    const getCell = () => cell;

    const updateCellTeamSide = (newTeamSide) => {
        if (typeof newTeamSide === 'string') {
            cell.teamSide = newTeamSide;
        } else {
            throw new Error('input team side must be a string');
        }
    };

    const toggleCellIsFired = () => {
        if (cell.isDisabled === false) {
            cell.isFired = !cell.isFired;
            cell.isDisabled = !cell.isDisabled;
        }
    };

    const toggleCellIsHasShip = () => {
        cell.isHasShip = !cell.isHasShip;
    };

    const updateShipType = (newShipType) => {
        if (cell.isHasShip && typeof newShipType === 'string') {
            cell.shipType = newShipType;
        } else if (typeof newShipType !== 'string') {
            throw new Error('input ship type must be a string');
        }
    };

    return {
        getCell,
        updateCellTeamSide,
        toggleCellIsFired,
        toggleCellIsHasShip,
        updateShipType,
    };
};

const shipList = () => {
    const shipTypeList = { carrier: 5, battleship: 4, destroyer: 3, submarine: 3, cruiser: 2 };
};

const shipOverlay = (shipType, shipSize) => {
    if (!shipType || !shipSize) {
        throw new Error('missing input row or shipSize');
    }
    if (typeof shipType !== 'string') {
        throw new Error('input ship type must be a string');
    } else if (typeof shipSize === 'number') {
        throw new Error('input ship size must be a number');
    }

    let ship = {
        shipType,
        shipSize,
        isVertical: false,
        shipColStartPos: 0,
        shipRowStartPos: 0,
    };

    const getShipOverlay = () => ship;

    const toggleShipIsVertical = () => {
        ship.isVertical = !ship.isVertical;
    };

    const updateShipStartCol = (newShipStartColPos) => {
        if (typeof newShipStartColPos === 'number') {
            ship.shipColStartPos = newShipStartColPos;
        } else {
            throw new Error('input ship start col must be a number');
        }
    };

    const updateShipStartRow = (newShipStartRowPos) => {
        if (typeof newShipStartRowPos === 'number') {
            ship.shipRowStartPos = newShipStartRowPos;
        } else {
            throw new Error('input ship start col must be a number');
        }
    };

    return { getShipOverlay };
};

export { mapGrid, mapCell, shipOverlay };
