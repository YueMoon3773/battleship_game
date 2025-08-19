import htmlElements from '../elementsToDom/elementAddToHtml';
import shipsSvgOverlay from '../elementsToDom/shipsOverlayElement';
import domDisplay from './domDisplayHandler';

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
    // moves helper
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

    const resetPrepScreen = (shipCards, prepMapShipsOverlay, prepConfirmBtn, prepVerticalBtn, prepHorizontalBtn) => {
        prepMapShipsOverlay.innerHTML = '';
        prepConfirmBtn.setAttribute('disabled', '');
        domDisplay().addDisablePrepConfirmBtn(prepConfirmBtn);
        domDisplay().changeActivePrepDirectionBtns(prepVerticalBtn, prepHorizontalBtn);
        helper.resetTmpVar();

        shipCards.forEach((shipCard) => {
            shipCard.setAttribute('draggable', 'true');
            domDisplay().removeShipCardDropEffect(shipCard);
        });
    };

    const prepResetBtnHandler = (
        shipCards,
        prepMapShipsOverlay,
        prepConfirmBtn,
        prepVerticalBtn,
        prepHorizontalBtn,
        teamPlayerObj,
    ) => {
        resetPrepScreen(shipCards, prepMapShipsOverlay, prepConfirmBtn, prepVerticalBtn, prepHorizontalBtn);
        teamPlayerObj.playerShipsManager.resetShipList();
    };

    const hidePrepScreenAndGoToGameScreen = (prepScreen, gameScreen) => {
        helper.resetTmpVar();
        domDisplay().hideDomElement(prepScreen);
        domDisplay().unhideDomElement(gameScreen);
    };

    return {
        prepDirectionsBtnsClickHandler,
        isPrepVerticalBtnActive,
        prepShipCardsDragHandler,
        prepMapCellsHandler,
        resetPrepScreen,
        prepResetBtnHandler,
        hidePrepScreenAndGoToGameScreen,
    };
};

const gameScreenLogic = () => {
    const helper = domLogicHelper();

    const setUpEnemyFleet = (enemyPlayerObj) => {
        // console.log(enemyPlayerObj.playerMapManager.getSafeCells());
        // console.log(enemyPlayerObj.playerShipsManager.getShipList());

        enemyPlayerObj.playerShipsManager.getShipList().forEach((ship) => {
            let checkCellsResult;

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
                    checkCellsResult = enemyPlayerObj.playerMapManager.getShipVerticalCells(cellId, ship.shipSize);
                } else {
                    checkCellsResult = enemyPlayerObj.playerMapManager.getShipHorizontalCells(cellId, ship.shipSize);
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
    };

    const setUpMapCellsAndShipsOverlay = (playerObj, mapGrid, mapShipsOverlay) => {
        if (playerObj.playerSide === 'team') {
            domDisplay().renderMapCells(mapGrid, playerObj.playerMapManager.getMapGrid(), true);

            mapShipsOverlay.innerHTML = '';
            playerObj.playerShipsManager.getShipList().forEach((ship) => {
                const shipType = ship.shipType;

                const shipOverlaySvg = shipsSvgOverlay()[`${shipType}Img`](
                    playerObj.playerShipsManager.getShipInfoByType(shipType).shipColStartPos,
                    playerObj.playerShipsManager.getShipInfoByType(shipType).shipRowStartPos,
                    playerObj.playerShipsManager.getShipInfoByType(shipType).isVertical,
                );

                domDisplay().insertDomEle(mapShipsOverlay, shipOverlaySvg);
            });
        } else {
            domDisplay().renderMapCells(mapGrid, playerObj.playerMapManager.getMapGrid());

            mapShipsOverlay.innerHTML = '';
            playerObj.playerShipsManager.getShipList().forEach((ship) => {
                const shipType = ship.shipType;

                const shipOverlaySvg = shipsSvgOverlay()[`${shipType}Img`](
                    playerObj.playerShipsManager.getShipInfoByType(shipType).shipColStartPos,
                    playerObj.playerShipsManager.getShipInfoByType(shipType).shipRowStartPos,
                    playerObj.playerShipsManager.getShipInfoByType(shipType).isVertical,
                    true,
                );

                domDisplay().insertDomEle(mapShipsOverlay, shipOverlaySvg);
            });
        }
    };

    const setUpGameScreenMaps = (
        enemyPlayerObj,
        teamPlayerObj,
        gameTeamMapGrid,
        gameEnemyMapGrid,
        gameTeamMapShipsOverlay,
        gameEnemyMapShipsOverlay,
    ) => {
        setUpMapCellsAndShipsOverlay(teamPlayerObj, gameTeamMapGrid, gameTeamMapShipsOverlay);
        setUpMapCellsAndShipsOverlay(enemyPlayerObj, gameEnemyMapGrid, gameEnemyMapShipsOverlay);
    };

    const addDotToFiredCell = (cellId, playerSide, cellHasShip = false) => {
        const domCell = document.querySelector(`.mapGrid.${playerSide} .mapCell[data-cell_pos="${cellId}"]`);
        let dot = htmlElements().mapDot('blue');
        if (cellHasShip === true) {
            dot = htmlElements().mapDot('red');
        }
        domDisplay().insertDomEle(domCell, dot);
    };

    const displayResultBox = (helperScreenWrapper, resultBox) => {
        helper.resetAllMovesTmpVar();
        helper.resetTmpVar();
        domDisplay().unhideDomElement(helperScreenWrapper);
        domDisplay().unhideDomElement(resultBox);
    };

    const hideResultBox = (helperScreenWrapper, resultBox) => {
        domDisplay().hideDomElement(helperScreenWrapper);
        domDisplay().hideDomElement(resultBox);
    };

    const attackCellHandler = (cellId, playerObj) => {
        const isCellHasShip = playerObj.playerShipsManager.isHitShip(cellId);

        addDotToFiredCell(cellId, playerObj.playerSide, isCellHasShip);

        // console.log(isCellHasShip);

        if (isCellHasShip === true) {
            const checkOneShipHitCompletely = playerObj.playerShipsManager.verifyIfOneShipHitCompletely(
                cellId,
                Array.from(playerObj.playerMapManager.getFiredCells()),
            );
            // console.log(checkOneShipHitCompletely);

            if (checkOneShipHitCompletely.isShipCompletelyHit === true) {
                const shipSvg = document.querySelector(
                    `.gameScreen .mapShipsOverlay.${playerObj.playerSide} .${checkOneShipHitCompletely.shipType}Img`,
                );

                shipSvg.classList.remove('hide');
            }
        }
    };

    const enemyPlayLogic = (
        playersObj,
        teamPlayerObj,
        enemyPlayerObj,
        gameTeamChatWrapper,
        gameTeamChatContent,
        gameEnemyChatWrapper,
        gameEnemyChatContent,
        helperScreenWrapper,
        resultBox,
        resultHeading,
        teamResultText,
        enemyResultText,
    ) => {
        if (enemyPlayerObj.isActive === false) {
            return;
        }
        const randomCellIndex = Math.floor(
            Math.random() * Array.from(teamPlayerObj.playerMapManager.getSafeCells()).length,
        );

        let attackCellId = Array.from(teamPlayerObj.playerMapManager.getSafeCells())[randomCellIndex];

        if (helper.getMovesTmpVar().newPossibleCells !== '' && helper.getMovesTmpVar().newPossibleCells !== undefined) {
            attackCellId = helper.getMovesTmpVar().newPossibleCells;
        }
        // console.log(attackCellId);
        const isCellHasShip = teamPlayerObj.playerShipsManager.isHitShip(attackCellId);
        // console.log({ attackCellId, teamPlayerObj });

        helper.processingFiredCell(attackCellId, teamPlayerObj);

        attackCellHandler(attackCellId, teamPlayerObj);

        playerChatContentAndEffectHandler(gameTeamChatWrapper, gameTeamChatContent, 'team', '......', false);

        if (isCellHasShip === true) {
            playerChatContentAndEffectHandler(
                gameEnemyChatWrapper,
                gameEnemyChatContent,
                'enemy',
                enemyPlayerObj.playerChatManager.getRandomChatByCategory('enemy', 'hitShot'),
                true,
            );
        } else {
            playerChatContentAndEffectHandler(
                gameEnemyChatWrapper,
                gameEnemyChatContent,
                'enemy',
                enemyPlayerObj.playerChatManager.getRandomChatByCategory('enemy', 'missedShot'),
                true,
            );
        }

        if (teamPlayerObj.playerShipsManager.verifyIfAllShipsHitCompletely() === true) {
            resultHeading.innerText = 'YOU LOST';
            teamResultText.innerText = teamPlayerObj.playerChatManager.getRandomChatByCategory('team', 'lost');
            enemyResultText.innerText = enemyPlayerObj.playerChatManager.getRandomChatByCategory('enemy', 'win');
            displayResultBox(helperScreenWrapper, resultBox);
            return;
        } else {
            playersObj.switchActivePlayer();
        }
    };

    const gamePlayOnEnemyMapCellHandler = (
        playersObj,
        enemyPlayerObj,
        teamPlayerObj,
        mapCells,
        gameTeamChatWrapper,
        gameTeamChatContent,
        gameEnemyChatWrapper,
        gameEnemyChatContent,
        helperScreenWrapper,
        resultBox,
        resultHeading,
        teamResultText,
        enemyResultText,
    ) => {
        if (!mapCells) {
            throw new Error('missing input parameters');
        }

        mapCells.forEach((cell) => {
            cell.addEventListener('click', (e) => {
                if (e.target.hasAttribute('disabled') || teamPlayerObj.isActive === false) {
                    return;
                }
                const cellId = cell.dataset.cell_pos;
                const isCellHasShip = enemyPlayerObj.playerShipsManager.isHitShip(cellId);
                enemyPlayerObj.playerMapManager.updateFiredCellInMap(cellId);
                // console.log(cellId);

                attackCellHandler(cellId, enemyPlayerObj);

                playerChatContentAndEffectHandler(gameEnemyChatWrapper, gameEnemyChatContent, 'enemy', '......', false);

                if (isCellHasShip === true) {
                    playerChatContentAndEffectHandler(
                        gameTeamChatWrapper,
                        gameTeamChatContent,
                        'team',
                        teamPlayerObj.playerChatManager.getRandomChatByCategory('team', 'hitShot'),
                        true,
                    );
                } else {
                    playerChatContentAndEffectHandler(
                        gameTeamChatWrapper,
                        gameTeamChatContent,
                        'team',
                        teamPlayerObj.playerChatManager.getRandomChatByCategory('team', 'missedShot'),
                        true,
                    );
                }

                cell.classList.add('disable');
                cell.setAttribute('disabled', '');

                if (enemyPlayerObj.playerShipsManager.verifyIfAllShipsHitCompletely() === true) {
                    resultHeading.innerText = 'YOU WIN';
                    teamResultText.innerText = teamPlayerObj.playerChatManager.getRandomChatByCategory('team', 'win');
                    enemyResultText.innerText = enemyPlayerObj.playerChatManager.getRandomChatByCategory(
                        'enemy',
                        'lost',
                    );
                    displayResultBox(helperScreenWrapper, resultBox);
                    return;
                } else {
                    playersObj.switchActivePlayer();
                    setTimeout(() => {
                        enemyPlayLogic(
                            playersObj,
                            teamPlayerObj,
                            enemyPlayerObj,
                            gameTeamChatWrapper,
                            gameTeamChatContent,
                            gameEnemyChatWrapper,
                            gameEnemyChatContent,
                            helperScreenWrapper,
                            resultBox,
                            resultHeading,
                            teamResultText,
                            enemyResultText,
                        );
                    }, 5600);
                }
            });
        });
    };

    const playerChatContentAndEffectHandler = (
        chatWrapperElement,
        chatContentElement,
        playerSide,
        chatContent,
        isPlayerActive,
    ) => {
        if (isPlayerActive === false) {
            domDisplay().removeEffectFromInactivePlayerChat(chatWrapperElement);
        } else {
            domDisplay().addEffectToActivePlayerChat(chatWrapperElement);
        }
        chatContentElement.innerText = '';
        chatContentElement.innerText = chatContent;
        chatContentElement.style.animation = `typing 2s steps(30, end), ${playerSide}BlinkCaret 1600ms step-end infinite`;
    };

    const gamePlayHandler = (
        players,
        team,
        enemy,
        enemyMapCells,
        gameTeamChatWrapper,
        gameTeamChatContent,
        gameEnemyChatWrapper,
        gameEnemyChatContent,
        helperScreenWrapper,
        resultBox,
        resultHeading,
        teamResultText,
        enemyResultText,
    ) => {
        gamePlayOnEnemyMapCellHandler(
            players,
            enemy,
            team,
            enemyMapCells,
            gameTeamChatWrapper,
            gameTeamChatContent,
            gameEnemyChatWrapper,
            gameEnemyChatContent,
            helperScreenWrapper,
            resultBox,
            resultHeading,
            teamResultText,
            enemyResultText,
        );
    };

    return {
        setUpEnemyFleet,
        setUpGameScreenMaps,
        gamePlayHandler,
        playerChatContentAndEffectHandler,
        hideResultBox,
    };
};

export { startScreenLogic, prepScreenLogic, gameScreenLogic };
