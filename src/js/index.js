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
    - DONE state: playerSide: team/enemy
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
    - DONE state: playerSide: team/enemy
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
rerender map when 
*/

import '../css/style.css';

// ==============================
// import { mapGrid, mapCell } from './factories/mapComponents';

// const grid = mapGrid('team');
// grid.buildMapGrid();
// const map = grid.getMapGrid();
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

// ===========================
import playersManager from './factories/players';
import { mapGrid, mapCell, shipList } from './factories/mapComponents';
import domDisplay from './dom/domDisplayHandler';
// import { prepShipCardsDragHandler, prepMapCellsHandler, prepDirectionsBtnsClickHandler } from './dom/domLogicHandler';
import { startScreenLogic, prepScreenLogic, gameScreenLogic } from './dom/domLogicHandler';

import {
    startScreen,
    startHelpBtn,
    startInp,
    startBtn,
    prepScreen,
    prepUserNameText,
    prepHorizontalBtn,
    prepVerticalBtn,
    mapVisualEffect,
    prepMapGrid,
    prepMapShipsOverlay,
    prepShipCards,
    prepCarrierShipCard,
    prepCarrierShipCardText,
    prepBattleshipShipCard,
    prepBattleshipShipCardText,
    prepDestroyerShipCard,
    prepDestroyerShipCardText,
    prepSubmarineShipCard,
    prepSubmarineShipCardText,
    prepCruiserShipCard,
    prepCruiserShipCardText,
    prepResetBtn,
    prepConfirmBtn,
    gameScreen,
    gameTeamMapGrid,
    gameTeamMapShipsOverlay,
    gameEnemyMapGrid,
    gameEnemyMapShipsOverlay,
    gameTeamChatContent,
    gameEnemyChatContent,
    helperScreenWrapper,
    startHelpBox,
    startHelpBoxCloseBtn,
    resultBox,
    resultHeading,
    resultTeamCharImg,
    resultEnemyCharImg,
    resultText,
    resultBtn,
} from './dom/htmlDom';

import shipsOverlay from './elementsToDom/shipsOverlayElement';

import htmlElements from './elementsToDom/elementAddToHtml';
import shipsSvgOverlay from './elementsToDom/shipsOverlayElement';

const players = playersManager();
let team;
const enemy = players.getEnemyInfo();

// ===========================
players.adUserToPlayerList('Yue');
team = players.getTeamInfo();
// ===========================

// set up game logic
const domStartScreenLogic = startScreenLogic();
const domPrepScreenLogic = prepScreenLogic();
const domGameScreenLogic = gameScreenLogic();

// set up ships for enemy
// ===========================
domGameScreenLogic.setUpEnemyFleet(team);
// ===========================
domGameScreenLogic.setUpEnemyFleet(enemy);
// console.log(enemy);
// console.log(enemy.playerChatManager.getRandomChatByCategory(enemy.playerSide, 'hitShot'));

// console.log(enemy.playerShipsManager.getShipList());

// START SCREEN
domStartScreenLogic.startHelpBtnClickHandler(startHelpBtn, helperScreenWrapper, startHelpBox);
domStartScreenLogic.closeHelpBoxBtnHandler(startHelpBoxCloseBtn, helperScreenWrapper, startHelpBox);

// start game btn => change to prep screen + set up prep screen
startBtn.addEventListener('click', () => {
    const playerName = domStartScreenLogic.getPlayerNameAndGoToPrepScreen(
        startInp,
        startScreen,
        prepScreen,
        prepUserNameText,
    );

    players.adUserToPlayerList(playerName);
    team = players.getTeamInfo();
    // console.log(team);
    // console.log(team.playerShipsManager.getShipList());

    // CHANGE TO PREP SCREEN
    // initialize prep map cell
    domDisplay().renderMapCells(prepMapGrid, team.playerMapManager.getMapGrid());

    // change vertical state of dragging ship and btns styles
    domPrepScreenLogic.prepDirectionsBtnsClickHandler(prepHorizontalBtn, prepVerticalBtn);

    //handle dragging ship card and cells when drag and drop ship
    domPrepScreenLogic.prepShipCardsDragHandler(prepShipCards);

    const prepMapCells = document.querySelectorAll('.prepScreen .mapCell');
    domPrepScreenLogic.prepMapCellsHandler(prepVerticalBtn, prepMapCells, prepMapShipsOverlay, prepConfirmBtn, team);

    // console.log(team.playerShipsManager.getShipList());
    // console.log(team.playerShipsManager.getCellsContainShips());
});

prepResetBtn.addEventListener('click', () => {
    domPrepScreenLogic.prepResetBtnHandler(prepShipCards, prepMapShipsOverlay, prepConfirmBtn, team);
});

prepConfirmBtn.addEventListener('click', () => {
    // console.log(team.playerShipsManager.getShipList());
    // console.log(team.playerShipsManager.getCellsContainShips());

    domPrepScreenLogic.hidePrepScreenAndGoToGameScreen(prepScreen, gameScreen);
    domGameScreenLogic.setUpGameScreenMaps(
        enemy,
        team,
        gameTeamMapGrid,
        gameEnemyMapGrid,
        gameTeamMapShipsOverlay,
        gameEnemyMapShipsOverlay,
    );
});

// ===========================
// console.table(players.getActivePlayerInfo());
// console.table(team);
// players.switchActivePlayer();
// console.table(team);

domPrepScreenLogic.hidePrepScreenAndGoToGameScreen(prepScreen, gameScreen);
domGameScreenLogic.setUpGameScreenMaps(
    enemy,
    team,
    gameTeamMapGrid,
    gameEnemyMapGrid,
    gameTeamMapShipsOverlay,
    gameEnemyMapShipsOverlay,
);

const gameEnemyMapCells = document.querySelectorAll('.gameScreen .mapGrid.enemy .mapCell');
domGameScreenLogic.gamePlayHandler(players, team, enemy, gameEnemyMapCells, gameTeamChatContent, gameEnemyChatContent);

domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
domGameScreenLogic.enemyPlayLogic(team);
