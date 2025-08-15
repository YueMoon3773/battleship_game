import { mapGrid, mapCell, shipList } from '../factories/mapComponents';

const playerInfo = (playerSide, name = '') => {
    const playerMapManager = mapGrid(playerSide);
    const playerShipsManager = shipList();

    return {
        name,
        isActive: false,
        playerSide: '',
        playerMapManager,
        playerShipsManager,
    };
};
// console.log(playerInfo('enemy', 'Sinksalot'));
// console.log(playerInfo('enemy', 'Sinksalot').playerShipsManager.getShipList());
// console.log(playerInfo('enemy', 'Sinksalot').playerMapManager.getMap());

const player = (playerSide, name = '') => {
    if (name === null || !playerSide) {
        throw new Error('missing input name or playerSide');
    }
    if (typeof name !== 'string' || typeof playerSide !== 'string') {
        throw new Error('name and playerSide must be a string');
    }

    const info = playerInfo(playerSide, name);
    // console.log(typeof info.playerShipsManager.getShipList());

    const togglePlayerIsActive = () => {
        getPlayerInfo().isActive = !info.isActive;
    };

    const getPlayerInfo = () => info;
    const getPlayerActiveState = () => info.isActive;

    return {
        getPlayerInfo,
        getPlayerActiveState,
        togglePlayerIsActive,
    };
};

const playersManager = () => {
    const playerList = [player('enemy', 'Sinksalot')];

    const adUserToPlayerList = (newName = '') => {
        const userPlayer = player('team', newName);
        userPlayer.togglePlayerIsActive();
        playerList.push(userPlayer);
    };

    const switchActivePlayer = () => {
        playerList[0].togglePlayerIsActive();
        playerList[1].togglePlayerIsActive();
    };

    const getPlayerList = () => playerList;
    const getActivePlayerInfo = () => {
        if (playerList[0].getPlayerActiveState()) {
            return playerList[0].getPlayerInfo();
        } else {
            return playerList[1].getPlayerInfo();
        }
    };
    const getTeamInfo = () => {
        return playerList[1].getPlayerInfo();
    };

    const getEnemyInfo = () => {
        return playerList[0].getPlayerInfo();
    };

    return {
        adUserToPlayerList,
        switchActivePlayer,
        getPlayerList,
        getActivePlayerInfo,
        getTeamInfo,
        getEnemyInfo,
    };
};

export default playersManager;

// const players = playersManager();
// players.adUserToPlayerList('yue');
// console.log(players.getPlayerList()[0].getPlayerInfo());
// console.log(players.getPlayerList()[1].getPlayerInfo());
// console.log(players.getActivePlayerInfo());
// players.switchActivePlayer();
// console.log(players.getActivePlayerInfo());
