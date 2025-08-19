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

import '../css/style.css';

import playersManager from './factories/players';
import domDisplay from './dom/domDisplayHandler';
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
    prepMapGrid,
    prepMapShipsOverlay,
    prepShipCards,
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
    gameTeamChatWrapper,
    gameEnemyChatWrapper,
    teamResultText,
    enemyResultText,
    resultBtn,
} from './dom/htmlDom';

const players = playersManager();
let team;
let enemy;
enemy = players.getEnemyInfo();

// set up game logic
const domStartScreenLogic = startScreenLogic();
const domPrepScreenLogic = prepScreenLogic();
const domGameScreenLogic = gameScreenLogic();

// START SCREEN
domStartScreenLogic.startHelpBtnClickHandler(startHelpBtn, helperScreenWrapper, startHelpBox);
domStartScreenLogic.closeHelpBoxBtnHandler(startHelpBoxCloseBtn, helperScreenWrapper, startHelpBox);

// start game btn => change to prep screen + set up prep screen
startBtn.addEventListener('click', () => {
    // set up ships for enemy
    domGameScreenLogic.setUpEnemyFleet(enemy);

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
    domPrepScreenLogic.prepResetBtnHandler(
        prepShipCards,
        prepMapShipsOverlay,
        prepConfirmBtn,
        prepVerticalBtn,
        prepHorizontalBtn,
        team,
    );
});

prepConfirmBtn.addEventListener('click', () => {
    console.log(team.playerShipsManager.getShipList());
    // console.log(team.playerShipsManager.getCellsContainShips());
    console.log(enemy.playerShipsManager.getShipList());
    // console.log(team.playerShipsManager.getCellsContainShips());

    // hide prep screen and go to game screen.
    domPrepScreenLogic.hidePrepScreenAndGoToGameScreen(prepScreen, gameScreen);
    domGameScreenLogic.setUpGameScreenMaps(
        enemy,
        team,
        gameTeamMapGrid,
        gameEnemyMapGrid,
        gameTeamMapShipsOverlay,
        gameEnemyMapShipsOverlay,
    );

    // display greeting message for both players
    domGameScreenLogic.playerChatContentAndEffectHandler(
        gameTeamChatWrapper,
        gameTeamChatContent,
        team.playerSide,
        team.playerChatManager.getRandomChatByCategory(team.playerSide, 'greeting'),
        true,
    );
    domGameScreenLogic.playerChatContentAndEffectHandler(
        gameEnemyChatWrapper,
        gameEnemyChatContent,
        enemy.playerSide,
        enemy.playerChatManager.getRandomChatByCategory(enemy.playerSide, 'greeting'),
        true,
    );

    // Handle game play
    const gameEnemyMapCells = document.querySelectorAll('.gameScreen .mapGrid.enemy .mapCell');
    domGameScreenLogic.gamePlayHandler(
        players,
        team,
        enemy,
        gameEnemyMapCells,
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
});

resultBtn.addEventListener('click', () => {
    domPrepScreenLogic.resetPrepScreen(
        prepShipCards,
        prepMapShipsOverlay,
        prepConfirmBtn,
        prepVerticalBtn,
        prepHorizontalBtn,
    );
    domGameScreenLogic.hideResultBox(helperScreenWrapper, resultBox);
    domDisplay().hideDomElement(gameScreen);
    domDisplay().unhideDomElement(startScreen);

    team = null;
    enemy = null;
    players.resetPlayerList();
    enemy = players.getEnemyInfo();
});
