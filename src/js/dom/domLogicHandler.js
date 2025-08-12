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
        tmpAreAllShipsOnMap: false,
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
        tmpVar.tmpAreAllShipsOnMap = false;
    };

    const updateTmpVarValueByKey = (varKey, value) => {
        getTmpVar()[varKey] = value;
    };

    /**
     *
     * @param {boolean} isVerticalActive - vertical state of ship
     * @param {object} checkCellsResult - check result of getShipHorizontalCells or getShipVerticalCells
     * @param {Array} cellsContainShipsList - cells that have ships (result from getCellsContainShips)
     */
    const verifyCanDropShipHandler = (isVerticalActive, checkCellsResult, cellsContainShipsList) => {
        if (checkCellsResult === null) {
            throw new Error('Cannot find cell index');
        }

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
            cellsContainShipsList.includes(cell),
        );
        getTmpVar().tmpIsEffectCellsOverlapCellsHaveShip = isEffectCellsOverlapCellsHaveShip;

        if (checkCellsResult.length === 0) {
            getTmpVar().tmpCanDropShip = getTmpVar().tmpIsDraggingShipOnMap;
        } else {
            getTmpVar().tmpCanDropShip =
                getTmpVar().tmpIsDraggingShipOnMap && !getTmpVar().tmpIsEffectCellsOverlapCellsHaveShip;
        }
        // console.log(getTmpVar().tmpCheckCellsResult);
        // console.log(getTmpVar().tmpEffectCellsList);
        // console.log(getTmpVar().tmpIsDraggingShipOnMap);
        // console.log({ isEffectCellsOverlapCellsHaveShip });
        // console.log(getTmpVar().tmpCanDropShip);
    };

    const updatePlayerDropShipInfo = (playerObj) => {
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
        if (getTmpVar().tmpIsDraggingShipVertical === true) {
            playerObj.playerShipsManager.toggleShipIsVerticalByShipType(getTmpVar().tmpShipType);
        }
        playerObj.playerShipsManager.updateShipStartColByShipType(
            getTmpVar().tmpShipType,
            getTmpVar().tmpCheckCellsResult.shipColStartPos,
        );
        playerObj.playerShipsManager.updateShipStartRowByShipType(
            getTmpVar().tmpShipType,
            getTmpVar().tmpCheckCellsResult.shipRowStartPos,
        );
        playerObj.playerShipsManager.updateShipCellsListByShipType(
            getTmpVar().tmpShipType,
            getTmpVar().tmpEffectCellsList,
        );
        // console.log(teamPlayerObj.playerShipsManager.getShipList());
        // console.log(teamPlayerObj.playerShipsManager.getShipInfoByType(shipType));

        // check if all ships are on map
        if (playerObj.playerShipsManager.checkAllShipIsOnMap() === true) {
            getTmpVar().tmpAreAllShipsOnMap = true;
        }
    };

    return {
        getTmpVar,
        resetTmpVar,
        updateTmpVarValueByKey,
        verifyCanDropShipHandler,
        updatePlayerDropShipInfo,
    };
};

const startScreenLogic = () => {
    const startHelpBtnClickHandler = (startHelpBtn, helperScreenWrapper, startHelpBox) => {
        startHelpBtn.addEventListener('click', () => {
            domDisplay().unhideDomElement(helperScreenWrapper);
            domDisplay().unhideDomElement(startHelpBox);
        });
    };

    const closeHelpBoxBtnHandler = (startHelpBoxCloseBtn, helperScreenWrapper, startHelpBox) => {
        startHelpBoxCloseBtn.addEventListener('click', () => {
            domDisplay().hideDomElement(helperScreenWrapper);
            domDisplay().hideDomElement(startHelpBox);
        });
    };

    const getPlayerNameAndGoToPrepScreen = (startInp, startScreen, prepScreen, prepUserNameText) => {
        const playerName = startInp.value;

        domDisplay().hideDomElement(startScreen);
        domDisplay().unhideDomElement(prepScreen);
        prepUserNameText.textContent = playerName;
        if (playerName !== '') {
            prepUserNameText.style.marginLeft = '0.26em';
        }

        return playerName;
    };

    return {
        startHelpBtnClickHandler,
        closeHelpBoxBtnHandler,
        getPlayerNameAndGoToPrepScreen,
    };
};

const prepScreenLogic = () => {
    const helper = domLogicHelper();

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

                helper.updateTmpVarValueByKey('tmpShipType', card.dataset.ship_type);
                helper.updateTmpVarValueByKey('tmpShipSize', Number(card.dataset.ship_size));
            });
            card.addEventListener('dragend', (e) => {
                domDisplay().removeCellColorEffect(helper.getTmpVar().tmpEffectCellsList);
                domDisplay().addShipCardDragEndEffect(card);
            });
        });
    };

    const prepMapCellsHandler = (prepVerticalBtn, mapCells, prepMapShipsOverlay, prepConfirmBtn, teamPlayerObj) => {
        if (!prepVerticalBtn || !mapCells || !prepMapShipsOverlay || !teamPlayerObj) {
            throw new Error('missing input parameters');
        }

        mapCells.forEach((cell) => {
            cell.addEventListener('dragover', (e) => {
                e.preventDefault(); // allow drop here”
            });

            cell.addEventListener('dragenter', (e) => {
                const shipSize = helper.getTmpVar().tmpShipSize;
                const cellId = cell.dataset.cell_pos;
                let checkCellsResult;
                // console.log(`on cell ${cellId}`);

                // setup variable to prepare for dropping ship by domLogicHelper
                if (isPrepVerticalBtnActive(prepVerticalBtn)) {
                    checkCellsResult = teamPlayerObj.playerMapManager.getShipVerticalCells(cellId, shipSize);
                } else {
                    checkCellsResult = teamPlayerObj.playerMapManager.getShipHorizontalCells(cellId, shipSize);
                }

                helper.verifyCanDropShipHandler(
                    isPrepVerticalBtnActive(prepVerticalBtn),
                    checkCellsResult,
                    teamPlayerObj.playerShipsManager.getCellsContainShips(),
                );

                //set styles for hover cells
                domDisplay().addCellColorEffectWhileDraggingShipCard(
                    Array.from(teamPlayerObj.playerMapManager.getSafeCells()),
                    helper.getTmpVar().tmpEffectCellsList,
                    helper.getTmpVar().tmpIsDraggingShipOnMap,
                    helper.getTmpVar().tmpIsEffectCellsOverlapCellsHaveShip,
                );
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                const shipType = helper.getTmpVar().tmpShipType;
                const domShipCard = document.querySelector(`.shipCard[data-ship_type="${shipType}"]`);

                if (helper.getTmpVar().tmpCanDropShip) {
                    // Update shipList in team obj
                    helper.updatePlayerDropShipInfo(teamPlayerObj);

                    // console.log(`${shipType} drop on cell ${cell.dataset.cell_pos}`);

                    // setup and display ship overlay img
                    const shipOverlaySvg = shipsSvgOverlay()[`${shipType}Img`](
                        teamPlayerObj.playerShipsManager.getShipInfoByType(shipType).shipColStartPos,
                        teamPlayerObj.playerShipsManager.getShipInfoByType(shipType).shipRowStartPos,
                        teamPlayerObj.playerShipsManager.getShipInfoByType(shipType).isVertical,
                    );
                    domDisplay().insertDomEle(prepMapShipsOverlay, shipOverlaySvg);

                    // if all ships are on map => allow confirm button
                    if (helper.getTmpVar().tmpAreAllShipsOnMap === true) {
                        prepConfirmBtn.removeAttribute('disabled');
                        domDisplay().removeDisablePrepConfirmBtn(prepConfirmBtn);
                    }

                    //reset tmp variables + set styles effect after drop ship
                    domShipCard.toggleAttribute('draggable');
                    domDisplay().addShipCardDropEffect(domShipCard);
                    domDisplay().removeCellColorEffect(helper.getTmpVar().tmpEffectCellsList);
                    helper.resetTmpVar();
                }
            });
        });
    };

    const prepResetBtnHandler = (shipCards, prepMapShipsOverlay, prepConfirmBtn, teamPlayerObj) => {
        prepMapShipsOverlay.innerHTML = '';
        prepConfirmBtn.setAttribute('disabled', '');
        domDisplay().addDisablePrepConfirmBtn(prepConfirmBtn);
        helper.resetTmpVar();
        teamPlayerObj.playerShipsManager.resetShipList();

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
        prepResetBtnHandler,
    };
};

const gameScreenLogic = () => {
    const helper = domLogicHelper();
};

export { startScreenLogic, prepScreenLogic };
