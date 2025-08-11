import htmlElements from '../elementsToDom/elementAddToHtml';
import shipsSvgOverlay from '../elementsToDom/shipsOverlayElement';
import domDisplay from './domDisplayHandler';

const domLogicHelper = () => {
    const tmpVar = {
        tmpShipType: '',
        tmpShipSize: 0,
        tmpEffectCellsList: [],
        tmpCheckCellsResult: null,
        tmpIsDraggingShipOnMap: false,
        tmpIsDraggingShipVertical: false,
        tmpIsEffectCellsOverlapCellsHaveShip: false,
        tmpCanDropShip: false,
    };
    const getTmpVar = () => tmpVar;
    const resetTmpVar = () => {
        tmpVar.tmpShipType = '';
        tmpVar.tmpShipSize = 0;
        tmpVar.tmpEffectCellsList = [];
        tmpVar.tmpCheckCellsResult = null;
        tmpVar.tmpIsDraggingShipOnMap = false;
        tmpVar.tmpIsDraggingShipVertical = false;
        tmpVar.tmpIsEffectCellsOverlapCellsHaveShip = false;
        tmpVar.tmpCanDropShip = false;
    };

    const updateTmpVarValueByKey = (varKey, value) => {
        getTmpVar()[varKey] = value;
    };

    const verifyCanDropShipHandle = (cellId, isVerticalActive, checkCellsResult, cellsContainShipsList) => {
        if (checkCellsResult === null) {
            throw new Error('Cannot find cell index');
        }

        const shipSize = getTmpVar().tmpShipType;

        if (isVerticalActive) {
            getTmpVar().tmpIsDraggingShipVertical = true;
            getTmpVar().tmpEffectCellsList = checkCellsResult.verticalCellList;
        } else {
            getTmpVar().tmpIsDraggingShipVertical = false;
            getTmpVar().tmpEffectCellsList = checkCellsResult.horizontalCellList;
        }
        getTmpVar().tmpCheckCellsResult = checkCellsResult;
        getTmpVar().tmpIsDraggingShipOnMap = checkCellsResult.isShipOnMap;

        const isEffectCellsOverlapCellsHaveShip = getTmpVar().tmpEffectCellsList.some((cell) =>
            checkCellsResult.includes(cell),
        );
        getTmpVar().tmpIsEffectCellsOverlapCellsHaveShip = isEffectCellsOverlapCellsHaveShip;

        if (checkCellsResult.length === 0) {
            getTmpVar().tmpCanDropShip = getTmpVar().tmpIsDraggingShipOnMap;
        } else {
            getTmpVar().tmpCanDropShip =
                getTmpVar().tmpIsDraggingShipOnMap && !getTmpVar().tmpIsEffectCellsOverlapCellsHaveShip;
        }
    };

    const updatePlayerDropShipInfo = (teamPlayerObj) => {
        if (getTmpVar().tmpIsDraggingShipOnMap) {
            if (
                !getTmpVar().tmpCheckCellsResult ||
                getTmpVar().tmpCheckCellsResult === null ||
                getTmpVar().tmpEffectCellsList.length === 0
            ) {
                throw new Error('Cannot update ship list due to missing checking ship card result');
            }
        }

        // Update shipList in team obj
        if (getTmpVar().isDraggingShipVertical === true) {
            teamPlayerObj.teamShipsManager.toggleShipIsVerticalByShipType(getTmpVar().tmpShipType);
        }
        teamPlayerObj.teamShipsManager.updateShipStartColByShipType(
            getTmpVar().tmpShipType,
            getTmpVar().tmpCheckCellsResult.shipColStartPos,
        );
        teamPlayerObj.teamShipsManager.updateShipStartRowByShipType(
            getTmpVar().tmpShipType,
            getTmpVar().tmpCheckCellsResult.shipRowStartPos,
        );
        teamPlayerObj.teamShipsManager.updateShipCellsListByShipType(
            getTmpVar().tmpShipType,
            getTmpVar().tmpEffectCellsList,
        );
        // console.log(teamPlayerObj.teamShipsManager.getShipList());
        // console.log(teamPlayerObj.teamShipsManager.getShipInfoByType(shipType));
        // console.log(`${shipType} drop on cell ${cell.dataset.cell_pos}`);
    };

    return {
        getTmpVar,
        resetTmpVar,
        updateTmpVarValueByKey,
        verifyCanDropShipHandle,
        updatePlayerDropShipInfo,
    };
};

const domLogic = () => {
    const prepScreenLogic = () => {
        const prepTmpVar = {
            prepShipType: '',
            prepShipSize: '',
            effectCellsList: [],
            checkCellsResult: null,
            isDraggingShipOnMap: false,
            isDraggingShipVertical: false,
            canDropShipSuccessfully: false,
        };
        const getPrepTmpVar = () => prepTmpVar;
        const resetPrepTmpVar = () => {
            prepTmpVar.prepShipType = '';
            prepTmpVar.prepShipSize = '';
            prepTmpVar.effectCellsList = [];
            prepTmpVar.checkCellsResult = null;
            prepTmpVar.isDraggingShipOnMap = false;
            prepTmpVar.isDraggingShipVertical = false;
            prepTmpVar.canDropShipSuccessfully = false;
        };

        const prepDirectionsBtnsClickHandler = (prepHorizontalBtn, prepVerticalBtn) => {
            if (!prepHorizontalBtn || !prepVerticalBtn) {
                throw new Error('missing input parameter');
            }

            prepHorizontalBtn.addEventListener('click', () => {
                domDisplay().changeActivePrepDirectionBtns(prepVerticalBtn, prepHorizontalBtn);
            });

            prepVerticalBtn.addEventListener('click', () => {
                domDisplay().changeActivePrepDirectionBtns(prepHorizontalBtn, prepVerticalBtn);
            });
        };

        const isPrepVerticalBtnActive = (prepVerticalBtn) => {
            if (!prepVerticalBtn) {
                throw new Error('missing input parameter');
            }
            return prepVerticalBtn.classList.contains('active') ? true : false;
        };

        const prepShipCardsDragHandler = (shipCards) => {
            if (!shipCards) {
                throw new Error('missing input parameter');
            }

            shipCards.forEach((card) => {
                card.addEventListener('dragstart', (e) => {
                    domDisplay().addShipCardDraggingEffect(card);
                    // prepShipType = card.dataset.ship_type;
                    getPrepTmpVar().prepShipType = card.dataset.ship_type;
                    getPrepTmpVar().prepShipSize = Number(card.dataset.ship_size);
                });
                card.addEventListener('dragend', (e) => {
                    // console.log(getPrepTmpVar().effectCellsList);
                    domDisplay().removeCellColorEffect(getPrepTmpVar().effectCellsList);
                    domDisplay().addShipCardDragEndEffect(card);
                });
            });

            // console.log(prepShipType);
        };

        const prepMapCellsHandler = (prepVerticalBtn, mapCells, prepMapShipsOverlay, teamPlayerObj) => {
            if (!prepVerticalBtn || !mapCells || !prepMapShipsOverlay || !teamPlayerObj) {
                throw new Error('missing input parameters');
            }

            mapCells.forEach((cell) => {
                cell.addEventListener('dragover', (e) => {
                    e.preventDefault(); // allow drop here”
                });

                cell.addEventListener('dragenter', (e) => {
                    const shipSize = getPrepTmpVar().prepShipSize;
                    const cellId = cell.dataset.cell_pos;

                    // console.log(`${shipType} on cell ${cell.dataset.cell_pos}`);

                    if (isPrepVerticalBtnActive(prepVerticalBtn)) {
                        // console.log('is vertical');
                        getPrepTmpVar().isDraggingShipVertical = true;
                        getPrepTmpVar().checkCellsResult = teamPlayerObj.teamMapManager.getShipVerticalCells(
                            cellId,
                            shipSize,
                        );
                        getPrepTmpVar().effectCellsList = getPrepTmpVar().checkCellsResult.verticalCellList;
                    } else {
                        // console.log('NOT vertical');
                        getPrepTmpVar().isDraggingShipVertical = false;
                        getPrepTmpVar().checkCellsResult = teamPlayerObj.teamMapManager.getShipHorizontalCells(
                            cellId,
                            shipSize,
                        );
                        getPrepTmpVar().effectCellsList = getPrepTmpVar().checkCellsResult.horizontalCellList;
                    }
                    getPrepTmpVar().isDraggingShipOnMap = getPrepTmpVar().checkCellsResult.isShipOnMap;

                    const isEffectCellsOverlapCellsHaveShip = getPrepTmpVar().effectCellsList.some((cell) =>
                        teamPlayerObj.teamShipsManager.getCellsContainShips().includes(cell),
                    );

                    if (teamPlayerObj.teamShipsManager.getCellsContainShips().length === 0) {
                        getPrepTmpVar().canDropShipSuccessfully = getPrepTmpVar().isDraggingShipOnMap;
                    } else {
                        getPrepTmpVar().canDropShipSuccessfully =
                            getPrepTmpVar().isDraggingShipOnMap && !isEffectCellsOverlapCellsHaveShip;
                    }
                    // console.log(getPrepTmpVar().checkCellsResult);
                    // console.log(getPrepTmpVar().effectCellsList);
                    // console.log(getPrepTmpVar().isDraggingShipOnMap);
                    // console.log({ isEffectCellsOverlapCellsHaveShip });
                    // console.log(getPrepTmpVar().canDropShipSuccessfully);

                    //set styles for hover cells
                    domDisplay().addCellColorEffectWhileDraggingShipCard(
                        Array.from(teamPlayerObj.teamMapManager.getSafeCells()),
                        teamPlayerObj.teamShipsManager.getCellsContainShips(),
                        getPrepTmpVar().effectCellsList,
                        getPrepTmpVar().isDraggingShipOnMap,
                        isEffectCellsOverlapCellsHaveShip,
                    );
                });

                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const shipType = getPrepTmpVar().prepShipType;
                    const domShipCard = document.querySelector(`.shipCard[data-ship_type="${shipType}"]`);

                    if (getPrepTmpVar().canDropShipSuccessfully) {
                        if (
                            !getPrepTmpVar().checkCellsResult ||
                            getPrepTmpVar().checkCellsResult === null ||
                            getPrepTmpVar().effectCellsList.length === 0
                        ) {
                            throw new Error('Cannot update ship list due to missing checking ship card result');
                        }

                        // Update shipList in team obj
                        if (getPrepTmpVar().isDraggingShipVertical === true) {
                            teamPlayerObj.teamShipsManager.toggleShipIsVerticalByShipType(shipType);
                        }
                        teamPlayerObj.teamShipsManager.updateShipStartColByShipType(
                            shipType,
                            getPrepTmpVar().checkCellsResult.shipColStartPos,
                        );
                        teamPlayerObj.teamShipsManager.updateShipStartRowByShipType(
                            shipType,
                            getPrepTmpVar().checkCellsResult.shipRowStartPos,
                        );
                        teamPlayerObj.teamShipsManager.updateShipCellsListByShipType(
                            shipType,
                            getPrepTmpVar().effectCellsList,
                        );
                        // console.log(teamPlayerObj.teamShipsManager.getShipList());
                        // console.log(teamPlayerObj.teamShipsManager.getShipInfoByType(shipType));
                        // console.log(`${shipType} drop on cell ${cell.dataset.cell_pos}`);

                        // setup and display ship overlay img
                        const shipOverlaySvg = shipsSvgOverlay()[`${shipType}Img`](
                            teamPlayerObj.teamShipsManager.getShipInfoByType(shipType).shipColStartPos,
                            teamPlayerObj.teamShipsManager.getShipInfoByType(shipType).shipRowStartPos,
                            teamPlayerObj.teamShipsManager.getShipInfoByType(shipType).isVertical,
                        );
                        domDisplay().insertDomEle(prepMapShipsOverlay, shipOverlaySvg);

                        //reset tmp variables + set styles effect after drop ship
                        domShipCard.toggleAttribute('draggable');
                        domDisplay().addShipCardDropEffect(domShipCard);
                        domDisplay().removeCellColorEffect(getPrepTmpVar().effectCellsList);
                        resetPrepTmpVar();
                    }
                });
            });
        };

        const prepShipCardsResetDraggableAttr = (shipCards, prepMapShipsOverlay, teamPlayerObj) => {
            prepMapShipsOverlay.innerHTML = '';
            resetPrepTmpVar();
            teamPlayerObj.teamShipsManager.resetShipList();

            shipCards.forEach((shipCard) => {
                shipCard.setAttribute('draggable', 'true');
                domDisplay().removeShipCardDropEffect(shipCard);
            });
        };

        return {
            prepDirectionsBtnsClickHandler,
            isPrepVerticalBtnActive,
            prepShipCardsDragHandler,
            prepMapCellsHandler,
            prepShipCardsResetDraggableAttr,
        };
    };

    return {
        prepScreenLogic,
    };
};

// export { prepShipCardsDragHandler, prepMapCellsHandler, prepDirectionsBtnsClickHandler };
export default domLogic;
