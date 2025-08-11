import htmlElements from '../elementsToDom/elementAddToHtml';

const domDisplay = () => {
    const appendDomEle = (parent, childToAdd) => {
        if (childToAdd && parent) {
            parent.appendChild(childToAdd);
        } else if (!childToAdd) {
            throw new Error('missing child element');
        } else {
            throw new Error('missing parent element');
        }
    };

    const insertDomEle = (parent, childToAdd) => {
        if (childToAdd !== '' && parent) {
            parent.insertAdjacentHTML('beforeend', childToAdd);
        } else if (!childToAdd || childToAdd === '') {
            throw new Error('missing child element');
        } else {
            throw new Error('missing parent element');
        }
    };

    /**
     *
     * @param {object} parentElement - map cells parent
     * @param {string} playerTeamSide - team/enemy
     * @param {object} playerMapGrid - mapGrid object
     * @param {boolean} allCellsAreDisabled - team map in game play, all cell disabled
     */
    const renderMapCells = (parentElement, playerTeamSide, playerMapGrid, allCellsAreDisabled = false) => {
        if (!parentElement || !playerTeamSide || !playerMapGrid) {
            throw new Error('missing input parameters');
        }
        parentElement.innerHTML = '';

        for (let row = 0; row < playerMapGrid.length; row++) {
            for (let col = 0; col < playerMapGrid[row].length; col++) {
                // let cellPosId = `R,${row},C,${col}`;
                let cellPosId = playerMapGrid[row][col].getCell().id;
                let mapCell;

                allCellsAreDisabled
                    ? (mapCell = htmlElements().mapCellElement(cellPosId, true))
                    : (mapCell = htmlElements().mapCellElement(cellPosId));

                appendDomEle(parentElement, mapCell);
            }
        }
    };

    const changeActivePrepDirectionBtns = (btnToOff, btnToActive) => {
        if (!btnToOff.classList.contains('active') || btnToActive.classList.contains('active')) return;
        else {
            btnToOff.classList.remove('active');
            btnToActive.classList.add('active');
        }
    };

    const addShipCardDraggingEffect = (shipCard) => {
        shipCard.classList.add('dragging');
    };

    const addShipCardDragEndEffect = (shipCard) => {
        shipCard.classList.remove('dragging');
    };

    const addShipCardDropEffect = (shipCard) => {
        shipCard.classList.remove('dragging');
        shipCard.classList.add('drop');
    };

    const removeShipCardDropEffect = (shipCard) => {
        shipCard.classList.remove('drop');
    };

    /**
     *
     * @param {Array} allCellsOnMapList
     * @param {Array} cellsContainShipsList - cells that have ships (result from getCellsContainShips)
     * @param {Array} cellsWithEffectList - check result of horizontalCellList/verticalCellList by getShipHorizontalCells, getShipVerticalCells
     * @param {boolean} isDraggingShipOnMap - check result of isShipOnMap by getShipHorizontalCells, getShipVerticalCells
     * @param {boolean} isEffectCellsOverlapCellsHaveShip - check if effect cell overlap with cells have ship
     */
    const addCellColorEffectWhileDraggingShipCard = (
        allCellsOnMapList,
        cellsContainShipsList,
        cellsWithEffectList,
        isDraggingShipOnMap,
        isEffectCellsOverlapCellsHaveShip,
    ) => {
        // Case 1: green cells
        // effect cells on map + effect cell not in the cells have ships list
        // => cell is ok add GREEN class
        if (isDraggingShipOnMap && !isEffectCellsOverlapCellsHaveShip) {
            cellsWithEffectList.forEach((cell) => {
                const cellElement = document.querySelector(`.prepScreen .mapCell[data-cell_pos="${cell}"]`);
                cellElement.classList.remove('red');
                cellElement.classList.add('green');
            });
        }
        // Case 2: red cells
        // otherwise means cell is out of map or overlay with other ship
        // => cell not ok => add RED class
        else {
            cellsWithEffectList.forEach((cell) => {
                const cellElement = document.querySelector(`.prepScreen .mapCell[data-cell_pos="${cell}"]`);
                cellElement.classList.remove('green');
                cellElement.classList.add('red');
            });
        }

        // remove effect of old cells
        // filter all cells in map not in cellsWithEffectList
        const removeCellEffectList = allCellsOnMapList.filter((cell) => !cellsWithEffectList.includes(cell));
        removeCellColorEffect(removeCellEffectList);
    };

    const removeCellColorEffect = (removeCellEffectList) => {
        if (removeCellEffectList.length > 0) {
            removeCellEffectList.forEach((cell) => {
                const cellElement = document.querySelector(`.prepScreen .mapCell[data-cell_pos="${cell}"]`);
                cellElement.classList.remove('green');
                cellElement.classList.remove('red');
            });
        }
    };

    const addDisablePrepConfirmBtn = (confirmBtn) => {
        if (!confirmBtn.classList.contains('disabled')) {
            confirmBtn.classList.add('disabled');
        }
    };

    const removeDisablePrepConfirmBtn = (confirmBtn) => {
        if (confirmBtn.classList.contains('disabled')) {
            confirmBtn.classList.remove('disabled');
        }
    };

    return {
        appendDomEle,
        insertDomEle,
        renderMapCells,
        changeActivePrepDirectionBtns,
        addShipCardDraggingEffect,
        addShipCardDragEndEffect,
        addShipCardDropEffect,
        removeShipCardDropEffect,
        addCellColorEffectWhileDraggingShipCard,
        removeCellColorEffect,
        addDisablePrepConfirmBtn,
        removeDisablePrepConfirmBtn,
    };
};

export default domDisplay;
