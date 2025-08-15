import htmlElements from '../elementsToDom/elementAddToHtml';
import shipsSvgOverlay from '../elementsToDom/shipsOverlayElement';
import domDisplay from './domDisplayHandler';

import playersManager from '../factories/players';

const domLogicHelper = () => {
    // Helper for prep screen + placing ships
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

    // helper for game play
    const movesTmpVar = {
        originHitCellId: '',
        allTriedCell: [],
        allDirectionsPossibleCells: [],
        oneDirectionPossibleCells: [],
        oldAttackDirection: '',
        currentAttackDirection: '',
        newPossibleCells: '',
        horizontalOffsetMoves: [
            [0, +1],
            [0, -1],
        ],
        verticalOffsetMoves: [
            [+1, 0],
            [-1, 0],
        ],
    };
    const getMovesTmpVar = () => movesTmpVar;
    const resetAllMovesTmpVar = () => {
        movesTmpVar.originHitCellId = '';
        movesTmpVar.allTriedCell = [];
        movesTmpVar.allDirectionsPossibleCells = [];
        movesTmpVar.oneDirectionPossibleCells = [];
        movesTmpVar.oldAttackDirection = '';
        movesTmpVar.currentAttackDirection = '';
        movesTmpVar.newPossibleCells = '';
    };
    const resetNewMovesVar = () => {
        movesTmpVar.newPossibleCells = '';
    };

    const getPossibleMovesInAllDirections = (firedCellId, playerObj) => {
        const [, row, , col] = firedCellId.split(',');
        const allDirectionOffset = getMovesTmpVar().horizontalOffsetMoves.concat(getMovesTmpVar().verticalOffsetMoves);

        const moves = allDirectionOffset
            .map((move) => {
                return `R,${Number(row) + move[0]},C,${Number(col) + move[1]}`;
            })
            .filter((possibleCellId) => {
                return playerObj.playerMapManager.isCellOnMap(possibleCellId) === true;
            })
            .filter((cellId) => {
                return !Array.from(playerObj.playerMapManager.getFiredCells()).includes(cellId);
            });

        return moves;
    };

    const getPossibleMovesInOneDirection = (firedCellId, direction, playerObj) => {
        const [, row, , col] = firedCellId.split(',');

        const moves = getMovesTmpVar()
            [`${direction}OffsetMoves`].map((move) => {
                return `R,${Number(row) + move[0]},C,${Number(col) + move[1]}`;
            })
            .filter((possibleCellId) => {
                return playerObj.playerMapManager.isCellOnMap(possibleCellId) === true;
            })
            .filter((cellId) => {
                return !Array.from(playerObj.playerMapManager.getFiredCells()).includes(cellId);
            });

        return moves;
    };

    const processingFiredCell = (firedCellId, playerObj) => {
        if (firedCellId === '' || firedCellId === null || !firedCellId || playerObj === null || !playerObj) {
            throw new Error('Missing firedCellId or player object');
        }
        // console.log({ firedCellId });

        if (playerObj.playerMapManager.getFiredCells().has(firedCellId)) {
            // console.log('ALREADY FIRED');
            resetAllMovesTmpVar();
            return;
        }

        if (!playerObj.playerShipsManager.isHitShip(firedCellId)) {
            // console.log('NOT hit ship');

            // No ship! Need to get other random cell
            if (getMovesTmpVar().originHitCellId === '') {
                // console.log('No ship! Need to get other random cell');
                resetAllMovesTmpVar();
            }
            // HIT ship BEFORE but this cell from this direction IS NOT
            // If 2 sides of this direction not hit
            // CHANGE DIRECTION
            else if (
                getMovesTmpVar().originHitCellId !== '' &&
                (getMovesTmpVar().newPossibleCells === getMovesTmpVar().oneDirectionPossibleCells[0] ||
                    getMovesTmpVar().newPossibleCells === getMovesTmpVar().oneDirectionPossibleCells[1]) &&
                !getMovesTmpVar().allDirectionsPossibleCells.every((cell) =>
                    getMovesTmpVar().allTriedCell.includes(cell),
                )
            ) {
                if (
                    getMovesTmpVar().newPossibleCells === getMovesTmpVar().oneDirectionPossibleCells[0] &&
                    getMovesTmpVar().oneDirectionPossibleCells[1] !== undefined
                ) {
                    // console.log('HIT ship BEFORE but this 1st cell from this direction IS NOT');
                    getMovesTmpVar().newPossibleCells = getMovesTmpVar().oneDirectionPossibleCells[1];
                } else {
                    // console.log('HIT ship BEFORE but this 2nd cell from this direction IS NOT');
                    // console.log('CHANGE DIRECTION');
                    getMovesTmpVar().currentAttackDirection =
                        getMovesTmpVar().oldAttackDirection === 'vertical' ? 'horizontal' : 'vertical';
                    getMovesTmpVar().oneDirectionPossibleCells = getPossibleMovesInOneDirection(
                        getMovesTmpVar().originHitCellId,
                        getMovesTmpVar().currentAttackDirection,
                        playerObj,
                    );
                    getMovesTmpVar().newPossibleCells = getMovesTmpVar().oneDirectionPossibleCells[0];
                }
                getMovesTmpVar().allTriedCell.push(firedCellId);
            }
            // HIT ship in this direction but this cell IS NOT
            // CHANGE to the other side of this direction
            else if (
                getMovesTmpVar().originHitCellId !== '' &&
                getMovesTmpVar().allDirectionsPossibleCells.filter(
                    (cell) => !getMovesTmpVar().allTriedCell.includes(cell),
                ).length >= 1
            ) {
                // console.log('HIT ship in this direction but this cell IS NOT');
                // console.log('CHANGE to the other side of this direction');
                getMovesTmpVar().allTriedCell.push(firedCellId);
                getMovesTmpVar().newPossibleCells = getMovesTmpVar().oneDirectionPossibleCells[1];
            }

            playerObj.playerMapManager.updateFiredCellInMap(firedCellId);
            return;
        } else {
            // console.log('HIT ship');

            playerObj.playerMapManager.updateFiredCellInMap(firedCellId);

            if (
                playerObj.playerShipsManager.verifyIfOneShipHitCompletely(
                    firedCellId,
                    Array.from(playerObj.playerMapManager.getFiredCells()),
                ).isShipCompletelyHit === true
            ) {
                // console.log('completely hit one ship');
                resetAllMovesTmpVar();
                return;
            } else {
                // 1st hit
                if (getMovesTmpVar().originHitCellId === '' && getMovesTmpVar().newPossibleCells === '') {
                    // console.log('1st hit');

                    getMovesTmpVar().originHitCellId = firedCellId;
                    getMovesTmpVar().allTriedCell.push(firedCellId);
                    getMovesTmpVar().allDirectionsPossibleCells = getPossibleMovesInAllDirections(
                        firedCellId,
                        playerObj,
                    );

                    if (getMovesTmpVar().allDirectionsPossibleCells.length === 0) {
                        resetAllMovesTmpVar();
                        return;
                    }

                    // getMovesTmpVar().currentAttackDirection = 'vertical';
                    // getMovesTmpVar().currentAttackDirection = 'horizontal';
                    getMovesTmpVar().currentAttackDirection =
                        Math.floor(Math.random() * 2) === 0 ? 'horizontal' : 'vertical';
                    getMovesTmpVar().oldAttackDirection = getMovesTmpVar().currentAttackDirection;

                    getMovesTmpVar().oneDirectionPossibleCells = getPossibleMovesInOneDirection(
                        firedCellId,
                        getMovesTmpVar().currentAttackDirection,
                        playerObj,
                    );

                    if (getMovesTmpVar().oneDirectionPossibleCells.length === 0) {
                        getMovesTmpVar().currentAttackDirection =
                            getMovesTmpVar().oldAttackDirection === 'vertical' ? 'horizontal' : 'vertical';

                        getMovesTmpVar().oneDirectionPossibleCells = getPossibleMovesInOneDirection(
                            getMovesTmpVar().originHitCellId,
                            getMovesTmpVar().currentAttackDirection,
                            playerObj,
                        );
                    } else {
                        getMovesTmpVar().newPossibleCells = getMovesTmpVar().oneDirectionPossibleCells[0];
                    }
                }
                // hit ship and move forward to other cell
                else if (getMovesTmpVar().originHitCellId !== '' && getMovesTmpVar().originHitCellId !== firedCellId) {
                    getMovesTmpVar().newPossibleCells = getPossibleMovesInOneDirection(
                        firedCellId,
                        getMovesTmpVar().currentAttackDirection,
                        playerObj,
                    )[0];
                    getMovesTmpVar().allTriedCell.push(firedCellId);
                }
            }
        }
    };

    return {
        getTmpVar,
        resetTmpVar,
        updateTmpVarValueByKey,
        verifyCanDropShipHandler,
        updatePlayerDropShipInfo,
        getMovesTmpVar,
        resetAllMovesTmpVar,
        processingFiredCell,
    };
};

// const players = playersManager();
// const enemy = players.getEnemyInfo();
// console.log(enemy);
//horizontal ship
// enemy.playerShipsManager.updateShipCellsListByShipType('carrier', [
//     'R,1,C,4',
//     'R,1,C,5',
//     'R,1,C,6',
//     'R,1,C,7',
//     'R,1,C,8',
// ]);

// vertical ship
// enemy.playerShipsManager.updateShipCellsListByShipType('battleship', ['R,1,C,10', 'R,2,C,10', 'R,3,C,10', 'R,4,C,10']);
// enemy.playerShipsManager.updateShipCellsListByShipType('destroyer', ['R,2,C,5', 'R,2,C,6', 'R,2,C,7']);
// enemy.playerShipsManager.updateShipCellsListByShipType('submarine', ['R,6,C,6', 'R,6,C,7', 'R,6,C,8']);
// enemy.playerShipsManager.updateShipCellsListByShipType('cruiser', ['R,9,C,4', 'R,9,C,5']);

// horizontal fired cell
// enemy.playerMapManager.updateFiredCellInMap('R,6,C,5');
// enemy.playerMapManager.updateFiredCellInMap('R,6,C,7');
// vertical fired cell
// enemy.playerMapManager.updateFiredCellInMap('R,5,C,6');
// enemy.playerMapManager.updateFiredCellInMap('R,7,C,6');

// const test = domLogicHelper();
// console.log(enemy.playerMapManager.getFiredCells());

// let i = 1;
// const testProcessingHit = (cellId = '') => {
//     console.log(`${i} shot`);
//     if (cellId !== '') {
//         test.processingFiredCell(cellId, enemy);
//     } else {
//         test.processingFiredCell(test.getMovesTmpVar().newPossibleCells, enemy);
//     }
//     console.table(test.getMovesTmpVar());
//     // console.log(enemy.playerMapManager.getFiredCells());
//     i++;
// };
// console.log(1);

// testProcessingHit('R,9,C,9');
// testProcessingHit('R,4,C,10');
// testProcessingHit();
// testProcessingHit();
// testProcessingHit();
// testProcessingHit();
// testProcessingHit();
// testProcessingHit();
// testProcessingHit();

// ==============================================
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

    const prepareEnemyShipsOverlay = (enemyPlayerObj) => {
        // console.log(enemyPlayerObj);
        // console.log(enemyPlayerObj.playerMapManager);
        // console.log(enemyPlayerObj.playerMapManager.getSafeCells());
        // console.log(enemyPlayerObj.playerShipsManager);
        // console.log(enemyPlayerObj.playerShipsManager.getShipList());
        // console.log(enemyPlayerObj.playerShipsManager.getCellsContainShips());

        enemyPlayerObj.playerShipsManager.getShipList().forEach((ship) => {
            let checkCellsResult;
            const shipType = ship.shipType;
            const shipSize = ship.shipSize;
            // console.log(shipType);

            // Update type and size to helper
            // same as dragstart of shipCard.
            helper.updateTmpVarValueByKey('tmpShipType', ship.shipType);
            helper.updateTmpVarValueByKey('tmpShipSize', ship.shipSize);

            // search for a cell to put ship
            while (helper.getTmpVar().tmpCanDropShip === false) {
                // create a random vertical state for ship
                // if random result = 0 => false. otherwise true
                const shipVerticalState = Math.floor(Math.random() * 2) === 0 ? true : false;

                const randomCellIndex = Math.floor(
                    Math.random() * Array.from(enemyPlayerObj.playerMapManager.getSafeCells()).length,
                );
                const cellId = Array.from(enemyPlayerObj.playerMapManager.getSafeCells())[randomCellIndex];

                // console.log(shipVerticalState);
                // console.log(randomCellIndex);
                // console.log(cellId);

                if (shipVerticalState === true) {
                    checkCellsResult = enemyPlayerObj.playerMapManager.getShipVerticalCells(cellId, shipSize);
                } else {
                    checkCellsResult = enemyPlayerObj.playerMapManager.getShipHorizontalCells(cellId, shipSize);
                }

                helper.verifyCanDropShipHandler(
                    shipVerticalState,
                    checkCellsResult,
                    enemyPlayerObj.playerShipsManager.getCellsContainShips(),
                );
            }

            helper.updatePlayerDropShipInfo(enemyPlayerObj);
            helper.resetTmpVar();
        });

        // if (helper.getTmpVar().tmpAreAllShipsOnMap === true) {
        // }
        // console.log(helper.getTmpVar());

        console.log(enemyPlayerObj.playerShipsManager.getShipList());
    };

    const getPossibleMovesInOneDirectionAfterFirstHit = (firedCellId) => {};

    return {
        prepareEnemyShipsOverlay,
    };
};

export { startScreenLogic, prepScreenLogic, gameScreenLogic };
