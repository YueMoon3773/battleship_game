/* PROJECT PLAN:
* DONE Get all interactive html DOM elements 
* Create element to add or inject to web
* Create game board function that would do (1)
    - DONE control row column of game board
    - DONE create board grid based on row and column
    - DONE return board
    - DONE mark cell grid 
    - check is on board
    - DONE get selected cell info (cell address)
    - DONE get empty cells to arr
    - DONE get fired cells list
    - get one random empty cell from the cell list
    
    - change/get states

* Create cell grid fac func that do:
    - DONE state: cell address (row + col) in board
    - DONE state: isFired => disable
    - DONE state: isDisabled
    - DONE state: isHasShip => if fired add red dot otherwise blue dot
    - DONE state: ship type
    - DONE state: teamSide: team/enemy
    - DONE change/get states

* Ships fac func:
    - DONE state: ship name/type
    - DONE state: isVertical
    - DONE state: size (how much grid)
    - DONE state: position => calculate grid
    - Maybe store address?

* Player fac func:
    - DONE state: name
    - DONE state: isActive
    - DONE state: teamSide: team/enemy
    - DONE change/get states

* Prep game controller:
    - Create board game by (1)
    - handle drag drop to set ship position
    - all ships must be on board
    - reset all ship pos

* game play controller
    - Create 2 boards game by (1)
    - create 2 plyers
    - get active Player

*/

/*
Write func to trans form cell col grid in svg func
change svg vertical by checking true false and add 'vertical'
*/

import '../css/style.css';

// import shipsOverlay from './dom/shipsOverlayElement';

import { prepMapGrid, prepMapShipsOverlay } from './dom/htmlDom';
import htmlElements from './elementsToDom/elementAddToHtml';
import shipsSvgOverlay from './elementsToDom/shipsOverlayElement';
import domHelper from './dom/domHelper';

for (let row = 1; row < 11; row++) {
    for (let col = 1; col < 11; col++) {
        let gridID = `R,${row},C,${col}`;
        const mapCell = htmlElements().mapCellElement(gridID, false);
        domHelper().appendDomEle(prepMapGrid, mapCell);
    }
}

// const prepCarrierImg = shipsSvgOverlay().carrierImg(10, 2, true);
// const prepCarrierImg = shipsSvgOverlay().carrierImg(1, 1, false);
// domHelper().insertDomEle(prepMapShipsOverlay, prepCarrierImg);

// ==============================
import { mapGrid, mapCell, shipOverlayHelper } from './factories/mapComponents';

const grid = mapGrid('prep', 'team');
grid.buildMapGrid();
const map = grid.getMapGrid();
// console.log('map: ', map);
// console.log('map cell: ', map[0][0].getCell());

// console.log('safe cells list before: ', grid.getSafeCells());
// console.log('fired cells list before: ', grid.getFiredCells());
// grid.updateFiredCellInMap('R,1,C,2');
// console.log('safe cells list after: ', grid.getSafeCells());
// console.log('fired cells list after: ', grid.getFiredCells());

// console.log('cell info at: ', grid.getCellInfoById('R,1,C,2'));
// console.log('is cell on map: ', grid.isCellOnMap('R,1,C,11'));

// console.log('horizontal test1');
// console.log('ship cell on map?: ', grid.getShipHorizontalCells('R,10,C,4', 5));
// console.log('horizontal test2');
// console.log('ship cell on map?: ', grid.getShipHorizontalCells('R,1,C,10', 2));

// console.log('vertical test1');
// console.log('ship cell on map?: ', grid.getShipVerticalCells('R,10,C,4', 5));
// console.log('vertical test2');
// console.log('ship cell on map?: ', grid.getShipVerticalCells('R,1,C,6', 5));

// ===============================
// 1) when drag starts you can stash which ship was picked up
// document.querySelectorAll('.shipCard').forEach((card) => {
//     card.addEventListener('dragstart', (e) => {
//         e.dataTransfer.setData('text/plain', card.id);
//     });
// });

// // 2) on every grid cell, listen for dragover / drop
// document.querySelectorAll('.prepScreen .mapCell').forEach((cell) => {
//     cell.addEventListener('dragenter', (e) => {
//         e.preventDefault(); // allow drop
//         cell.classList.add('red'); // highlight
//         // e.target is your cell
//         console.log('on cell', cell.dataset.cellPos);
//     });
//     cell.addEventListener('dragleave', () => {
//         cell.classList.remove('red');
//     });
//     cell.addEventListener('drop', (e) => {
//         e.preventDefault();
//         cell.classList.remove('red');
//         const shipId = e.dataTransfer.getData('text/plain');
//         console.log('Dropped ship', shipId, 'on cell', cell.dataset.cellPos);
//         // do your placement logic…
//     });
// });
