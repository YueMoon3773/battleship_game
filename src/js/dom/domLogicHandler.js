import htmlElements from '../elementsToDom/elementAddToHtml';
import shipsOverlay from '../elementsToDom/shipsOverlayElement';
import domDisplay from './domDisplayHandler';

const domLogic = () => {
    const prepTmpVar = {
        prepShipType: '',
        prepShipSize: '',
        oldEffectCellsList: [],
        effectCellsList: [],
        checkCellsResult: null,
        isDraggingShipOnMap: false,
        dropSuccessfully: false,
    };
    const getPrepTmpVar = () => prepTmpVar;
    const resetPrepTmpVar = () => {
        prepTmpVar.prepShipType = '';
        prepTmpVar.prepShipSize = '';
        prepTmpVar.oldEffectCellsList = [];
        prepTmpVar.effectCellsList = [];
        prepTmpVar.checkCellsResult = null;
        prepTmpVar.isDraggingShipOnMap = false;
        prepTmpVar.dropSuccessfully = false;
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
                domDisplay().shipCardDraggingEffect(card);
                // prepShipType = card.dataset.ship_type;
                getPrepTmpVar().prepShipType = card.dataset.ship_type;
                getPrepTmpVar().prepShipSize = Number(card.dataset.ship_size);
            });
            card.addEventListener('dragend', (e) => {
                domDisplay().shipCardDragEndEffect(card);
            });
        });

        // console.log(prepShipType);
    };

    const prepMapCellsHandler = (prepMapGrid, mapCells, prepVerticalBtn, teamPlayerObj) => {
        if (!mapCells) {
            throw new Error('missing input parameters');
        }

        mapCells.forEach((cell) => {
            cell.addEventListener('dragover', (e) => {
                // only allow the drop if the check said so
                e.preventDefault(); // allow drop here”
                // if (lastDropAllowed) {
                //   e.dataTransfer.dropEffect = 'move';
                // } else {
                //   e.dataTransfer.dropEffect = 'none';
                // }
            });

            cell.addEventListener('dragenter', (e) => {
                const shipType = getPrepTmpVar().prepShipType;
                const shipSize = getPrepTmpVar().prepShipSize;
                const cellId = cell.dataset.cell_pos;

                // console.log(`${shipType} on cell ${cell.dataset.cell_pos}`);
                // console.log(shipSize);

                if (isPrepVerticalBtnActive(prepVerticalBtn)) {
                    // console.log('is vertical');
                } else {
                    // console.log('NOT vertical');
                    getPrepTmpVar().checkCellsResult = teamPlayerObj.teamMapManager.getShipHorizontalCells(
                        cellId,
                        shipSize,
                    );
                    // const checkedCellRet = getPrepTmpVar().checkCellsResult;
                    // console.log(checkedCellRet);
                    getPrepTmpVar().effectCellsList = getPrepTmpVar().checkCellsResult.horizontalCellList;
                    getPrepTmpVar().isDraggingShipOnMap = getPrepTmpVar().checkCellsResult.isShipOnMap;
                    // console.log(getPrepTmpVar().checkCellsResult);
                    // console.log(getPrepTmpVar().effectCellsList);
                    // console.log(getPrepTmpVar().isDraggingShipOnMap);

                    domDisplay().addCellColorEffectWhileDraggingShipCard(
                        Array.from(teamPlayerObj.teamMapManager.getSafeCells()),
                        teamPlayerObj.teamShipsManager.getCellsContainShips(),
                        getPrepTmpVar().effectCellsList,
                        getPrepTmpVar().isDraggingShipOnMap,
                    );
                    // getPrepTmpVar().oldEffectCellsList = getPrepTmpVar().effectCellsList;
                }
            });

            // cell.addEventListener('dragleave', () => {
            //     // clear the hover/valid classes
            //     // lastDropAllowed = false;
            //     // cell.classList.remove('can-drop', 'cannot-drop');
            // });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();

                const shipType = getPrepTmpVar().prepShipType;
                const domShipCard = document.querySelector(`.shipCard[data-ship_type="${shipType}"]`);

                console.log(`${shipType} drop on cell ${cell.dataset.cell_pos}`);
                // your placement logic…

                e.dataTransfer.clearData('text/plain');
                getPrepTmpVar().prepShipType = '';
                getPrepTmpVar().prepShipType = '';
                domDisplay().shipCardDropEffect(domShipCard);
            });
        });
    };

    const prepShipCardsResetDraggableAttr = (shipCards) => {
        shipCards.forEach((shipCard) => {
            shipCard.setAttribute('draggable', 'true');
        });
    };

    return {
        prepDirectionsBtnsClickHandler,
        isPrepVerticalBtnActive,
        prepShipCardsDragHandler,
        prepMapCellsHandler,
    };
};

// export { prepShipCardsDragHandler, prepMapCellsHandler, prepDirectionsBtnsClickHandler };
export default domLogic;
