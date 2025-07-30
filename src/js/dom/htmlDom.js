// START SCREEN ELEMENTS
export const startScreen = document.getElementById('.startScreen');
export const startHelpBtn = document.querySelector('.startHelpBtnWrapper');
export const startInp = document.querySelector('.startInp');
export const startBtn = document.querySelector('.startBtn');

// PREPARATION ELEMENTS
export const prepScreen = document.querySelector('.prepScreen');
export const prepUserNameText = document.querySelector('.userName');
export const prepHorizontalBtn = document.querySelector('.gameBtn[data-prepBtnDirection="horizontal"]');
export const prepVerticalBtn = document.querySelector('.gameBtn[data-prepBtnDirection="vertical"]');
export const prepMapGrid = document.querySelector('.prepScreen .mapGrid');
export const prepMapShipsOverlay = document.querySelector('.prepScreen .mapShipsOverlay');

export const prepCarrierShipCard = document.querySelector('.shipCard[data-shipCardType="carrier"]');
export const prepCarrierShipCardText = document.querySelector('.shipCard[data-shipCardType="carrier"] .cardText');
export const prepBattleshipShipCard = document.querySelector('.shipCard[data-shipCardType="battleship"]');
export const prepBattleshipShipCardText = document.querySelector('.shipCard[data-shipCardType="battleship"] .cardText');
export const prepDestroyerShipCard = document.querySelector('.shipCard[data-shipCardType="destroyer"]');
export const prepDestroyerShipCardText = document.querySelector('.shipCard[data-shipCardType="destroyer"] .cardText');
export const prepSubmarineShipCard = document.querySelector('.shipCard[data-shipCardType="submarine"]');
export const prepSubmarineShipCardText = document.querySelector('.shipCard[data-shipCardType="submarine"] .cardText');
export const prepCruiserShipCard = document.querySelector('.shipCard[data-shipCardType="cruiser"]');
export const prepCruiserShipCardText = document.querySelector('.shipCard[data-shipCardType="cruiser"] .cardText');

export const prepResetBtn = document.querySelector('.gameBtn[data-prepBtnDirection="reset"]');
export const prepConfirmBtn = document.querySelector('.gameBtn[data-prepBtnDirection="confirm"]');

// GAME PLAY ELEMENTS
export const gameScreen = document.querySelector('.gameScreen');

export const gameTeamMapGrid = document.querySelector('.mapGrid.team');
export const gameTeamMapShipsOverlay = document.querySelector('.mapShipsOverlay.team');
export const gameEnemyMapGrid = document.querySelector('.mapGrid.enemy');
export const gameEnemyMapShipsOverlay = document.querySelector('.mapShipsOverlay.enemy');

export const gameTeamChatContent = document.querySelector('.chatContent.teamText');
export const gameEnemyChatContent = document.querySelector('.chatContent.enemyText');

// START HELPER SCREEN ELEMENTS
export const helperScreenWrapper = document.querySelector('.helperScreenWrapper');
export const startHelpBox = document.querySelector('.startHelpBox');
export const startHelpBoxCloseBtn = document.querySelector('.startHelpBoxCloseWrapper');

// RESULT SCREEN ELEMENTS
export const resultBox = document.querySelector('.resultBox');
export const resultHeading = document.querySelector('.resultHeading');
export const resultTeamCharImg = document.querySelector('.teamCharImg');
export const resultEnemyCharImg = document.querySelector('.enemyCharImg');
export const resultText = document.querySelector('.resultText');
export const resultBtn = document.querySelector('.gameBtn[data-resultBtn="replay"]');
