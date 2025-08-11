/**

 * @param {string} teamSide: team/enemy
 * @returns
 */
const mapGrid = (teamSide) => {
    if (teamSide === undefined) {
        throw new Error('missing input teamSide');
    }
    if (typeof teamSide !== 'string' || typeof teamSide !== 'string') {
        throw new Error('mapType and teamSide must be a string');
    }

    const map = {
        mapRows: 10,
        mapCols: 10,
        mapGrid: [],
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
    };

    const findCellIndexesInMapById = (cellId) => {
        if (cellId === undefined) {
            throw new Error('Missing cell id');
        } else if (typeof cellId !== 'string') {
            throw new TypeError('Cell id must be a string');
        }
        let targetCellRow = -99;
        let targetCellCol = -99;
        let foundCell = false;

        for (let i = 0; i < map.mapRows; i++) {
            for (let j = 0; j < map.mapCols; j++) {
                if (getMapGrid()[i][j].getCell().id === cellId) {
                    targetCellRow = i;
                    targetCellCol = j;
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

        return foundCell === true && targetCellRow !== -99 && targetCellCol !== -99
            ? {
                  targetCellRow,
                  targetCellCol,
              }
            : null;
    };

    const addFiredCellInMap = (cellId) => {
        if (cellId === undefined) {
            throw new Error('Missing cell id');
        } else if (typeof cellId !== 'string') {
            throw new TypeError('Cell id must be a string');
        }
        map.mapCellsFired.add(cellId);
    };

    const removeSafeCellInMap = (cellId) => {
        if (cellId === undefined) {
            throw new Error('Missing cell id');
        } else if (typeof cellId !== 'string') {
            throw new TypeError('Cell id must be a string');
        }
        map.mapCellsSafe.delete(cellId);
    };

    const updateFiredCellInMap = (cellId) => {
        if (cellId === undefined) {
            throw new Error('Missing cell id');
        } else if (typeof cellId !== 'string') {
            throw new TypeError('Cell id must be a string');
        } else if (findCellIndexesInMapById(cellId) === null || getFiredCells().has(cellId)) {
            return;
        } else {
            const { targetCellRow, targetCellCol } = findCellIndexesInMapById(cellId);

            getMapGrid()[targetCellRow][targetCellCol].toggleCellIsFired();
            addFiredCellInMap(cellId);
            removeSafeCellInMap(cellId);
        }
    };

    const getCellInfoById = (cellId) => {
        if (cellId === undefined) {
            throw new Error('Missing cell id');
        } else if (typeof cellId !== 'string') {
            throw new TypeError('Cell id must be a string');
        } else if (findCellIndexesInMapById(cellId) === null) {
            return null;
        }

        const { targetCellRow, targetCellCol } = findCellIndexesInMapById(cellId);

        return getMapGrid()[targetCellRow][targetCellCol].getCell();
    };

    const isCellOnMap = (cellId) => {
        if (cellId === undefined) {
            throw new Error('Missing cell id');
        } else if (typeof cellId !== 'string') {
            throw new TypeError('Cell id must be a string');
        } else if (getCellInfoById(cellId) === null) {
            return false;
        }
        const { mapRows, mapCols } = getMap();
        const cellRow = getCellInfoById(cellId).row;
        const cellCol = getCellInfoById(cellId).col;

        return cellRow <= mapRows && cellCol <= mapCols;
    };

    const getMap = () => map;
    const getMapGrid = () => map.mapGrid;
    const getSafeCells = () => map.mapCellsSafe;
    const getFiredCells = () => map.mapCellsFired;

    const getShipHorizontalCells = (cellId, shipSize) => {
        if (cellId === undefined || shipSize === undefined) {
            throw new Error('Missing cell id or ship size');
        } else if (typeof cellId !== 'string' || typeof shipSize !== 'number') {
            throw new TypeError('Cell id must be a string');
        } else if (findCellIndexesInMapById(cellId) === null) {
            return null;
        } else {
            const horizontalCellList = [];
            const { targetCellRow: startRow, targetCellCol: startCol } = findCellIndexesInMapById(cellId);

            let endRow = startRow;
            let endCol = startCol + shipSize;
            let checkCellId = `R,${endRow + 1},C,${endCol}`;

            const checkEndCellId = isCellOnMap(checkCellId);

            if (checkEndCellId) {
                for (let i = startCol + 1; i <= endCol; i++) {
                    horizontalCellList.push(`R,${endRow + 1},C,${i}`);
                }
            } else {
                for (let i = startCol + 1; i <= getMap().mapCols; i++) {
                    horizontalCellList.push(`R,${endRow + 1},C,${i}`);
                }
            }
            // console.log({ startRow, startCol, endRow, endCol });
            // console.log({ cellId, checkCellId });
            // console.log({ checkEndCellId });
            // console.log(horizontalCellList);

            return checkEndCellId
                ? {
                      isShipOnMap: true,
                      horizontalCellList,
                      shipRowStartPos: startRow + 1,
                      shipColStartPos: startCol + 1,
                  }
                : {
                      isShipOnMap: false,
                      horizontalCellList,
                      shipRowStartPos: startRow + 1,
                      shipColStartPos: startCol + 1,
                  };
        }
    };

    const getShipVerticalCells = (cellId, shipSize) => {
        if (cellId === undefined || shipSize === undefined) {
            throw new Error('Missing cell id or ship size');
        } else if (typeof cellId !== 'string' || typeof shipSize !== 'number') {
            throw new TypeError('Cell id must be a string');
        } else if (findCellIndexesInMapById(cellId) === null) {
            return null;
        } else {
            const verticalCellList = [];
            const { targetCellRow: startRow, targetCellCol: startCol } = findCellIndexesInMapById(cellId);

            let endRow = startRow + shipSize;
            let endCol = startCol;
            let checkCellId = `R,${endRow},C,${endCol + 1}`;

            const checkEndCellId = isCellOnMap(checkCellId);

            if (checkEndCellId) {
                for (let i = startRow + 1; i <= endRow; i++) {
                    verticalCellList.push(`R,${i},C,${endCol + 1}`);
                }
            } else {
                for (let i = startRow + 1; i <= getMap().mapRows; i++) {
                    verticalCellList.push(`R,${i},C,${endCol + 1}`);
                }
            }
            // console.log({ startRow, startCol, endRow, endCol });
            // console.log({ cellId, checkCellId });
            // console.log({ checkEndCellId });
            // console.log(verticalCellList);

            return checkEndCellId
                ? {
                      isShipOnMap: true,
                      verticalCellList,
                      shipRowStartPos: startRow + 1,
                      shipColStartPos: startCol + 1,
                  }
                : {
                      isShipOnMap: false,
                      verticalCellList,
                      shipRowStartPos: startRow + 1,
                      shipColStartPos: startCol + 1,
                  };
        }
    };

    return {
        buildMapGrid,
        updateFiredCellInMap,
        getMap,
        getMapGrid,
        getCellInfoById,
        getSafeCells,
        getFiredCells,
        isCellOnMap,
        getShipHorizontalCells,
        getShipVerticalCells,
    };
};

const mapCell = (row, col) => {
    if (row === undefined || col == undefined) {
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
    const shipsInfoList = [
        {
            shipType: 'carrier',
            shipSize: 5,
        },
        {
            shipType: 'battleship',
            shipSize: 4,
        },
        {
            shipType: 'destroyer',
            shipSize: 3,
        },
        {
            shipType: 'submarine',
            shipSize: 3,
        },
        {
            shipType: 'cruiser',
            shipSize: 2,
        },
    ];

    const shipList = [];

    const createShipOverlay = (shipType, shipSize) => {
        if (shipType === undefined || shipSize === undefined) {
            throw new Error('missing input row or shipSize');
        }
        if (typeof shipType !== 'string') {
            throw new Error('input ship type must be a string');
        } else if (typeof shipSize !== 'number') {
            throw new Error('input ship size must be a number');
        }

        return {
            shipType,
            shipSize,
            isVertical: false,
            shipCellList: [],
            shipColStartPos: 0,
            shipRowStartPos: 0,
        };
    };

    const createShipList = () => {
        shipsInfoList.forEach((shipInfo) => {
            shipList.push(createShipOverlay(shipInfo.shipType, shipInfo.shipSize));
        });
    };

    const resetShipList = () => {
        const shipLength = shipList.length;
        for (let i = 0; i < shipLength; i++) {
            shipList.pop();
        }
        createShipList();
    };

    const getShipList = () => shipList;

    const getShipIndexInListByType = (shipType) => {
        if (!shipType) {
            throw new Error('missing input row or shipSize');
        }
        if (typeof shipType !== 'string') {
            throw new Error('input ship type must be a string');
        }

        let shipIndex = -99;
        getShipList().find((ship, index) => {
            if (ship.shipType === shipType) {
                shipIndex = index;
            }
        });
        return shipIndex;
    };

    const getShipInfoByType = (shipType) => {
        const shipIndex = getShipIndexInListByType(shipType);

        return shipIndex === -99 ? null : getShipList()[shipIndex];
    };

    const toggleShipIsVerticalByShipType = (shipType) => {
        if (shipType === undefined) {
            throw new Error('Missing input properties');
        }
        if (typeof shipType === 'string') {
            if (getShipInfoByType(shipType) !== null) {
                getShipInfoByType(shipType).isVertical = !getShipInfoByType(shipType).isVertical;
            } else return;
        } else {
            throw new Error('input ship type must be a string');
        }
    };

    const updateShipStartColByShipType = (shipType, newShipStartColPos) => {
        if (shipType === undefined || newShipStartColPos === undefined) {
            throw new Error('Missing input properties');
        }
        if (typeof shipType === 'string' || typeof newShipStartColPos === 'number') {
            if (getShipInfoByType(shipType) !== null) {
                getShipInfoByType(shipType).shipColStartPos = newShipStartColPos;
            } else return;
        } else {
            throw new Error('input ship type must be a string and ship start col must be a number');
        }
    };

    const updateShipStartRowByShipType = (shipType, newShipStartRowPos) => {
        if (shipType === undefined || newShipStartRowPos === undefined) {
            throw new Error('Missing input properties');
        }
        if (typeof shipType === 'string' || typeof newShipStartRowPos === 'number') {
            if (getShipInfoByType(shipType) !== null) {
                getShipInfoByType(shipType).shipRowStartPos = newShipStartRowPos;
            } else return;
        } else {
            throw new Error('input ship type must be a string and ship start col must be a number');
        }
    };

    const updateShipCellsListByShipType = (shipType, newShipCellsList) => {
        if (shipType === undefined || newShipCellsList === undefined) {
            throw new Error('Missing input properties');
        }
        if (typeof shipType === 'string' || typeof newShipCellsList === 'object') {
            if (getShipInfoByType(shipType) !== null) {
                if (getShipInfoByType(shipType).shipSize === newShipCellsList.length) {
                    getShipInfoByType(shipType).shipCellList = newShipCellsList;
                } else throw new Error('length of cell list not equal to ship size');
            } else return;
        } else {
            throw new Error('input ship type must be a string and cell list must be an array');
        }
    };

    const checkAllShipIsOnMap = () => {
        let ret = true;
        getShipList().forEach((ship) => {
            if (ship.shipCellList.length === 0 || ship.shipCellList.length !== ship.shipSize) {
                ret = false;
            }
        });
        return ret;
    };

    const getCellsContainShips = () => {
        const cellsContainShips = [];
        getShipList().forEach((ship) => {
            cellsContainShips.push(...ship.shipCellList);
        });

        return cellsContainShips;
    };

    return {
        createShipList,
        resetShipList,
        toggleShipIsVerticalByShipType,
        updateShipStartColByShipType,
        updateShipStartRowByShipType,
        updateShipCellsListByShipType,
        checkAllShipIsOnMap,
        getCellsContainShips,
        getShipList,
        getShipInfoByType,
    };
};

// MAP CHECK
// in index file

// SHIP CHECK
// const test = shipList();
// test.createShipList();
// console.log('before: ', test.getShipList());

// test.toggleShipIsVerticalByShipType('submarine');
// console.log('after toggle: ', test.getShipList());

// console.log(test.getShipIndexInListByType('submarine'));
// console.log(test.getShipInfoByType('submarine'));

// test.updateShipCellsListByShipType('carrier', ['R,10,C,4', 'R,10,C,5', 'R,10,C,6', 'R,10,C,7', 'R,10,C,8']);
// test.updateShipCellsListByShipType('battleship', ['R,1,C,5', 'R,1,C,6', 'R,1,C,7', 'R,10,C,8']);
// test.updateShipCellsListByShipType('destroyer', ['R,2,C,5', 'R,2,C,6', 'R,2,C,7']);
// test.updateShipCellsListByShipType('submarine', ['R,6,C,6', 'R,6,C,7', 'R,6,C,8']);
// test.updateShipCellsListByShipType('cruiser', ['R,9,C,4', 'R,9,C,5']);

// console.log('after: ', test.getShipList());
// console.log(test.checkAllShipIsOnMap());
// console.log(test.getCellsContainShips());

// /========================
export { mapGrid, mapCell, shipList };
