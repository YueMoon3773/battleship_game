const player = (teamSide, name = '') => {
    if (!name || !teamSide) {
        throw new Error('missing input name or teamSide');
    }
    if (typeof name !== 'string' || typeof teamSide !== 'string') {
        throw new Error('name and teamSide must be a string');
    }
    const info = {
        name,
        isActive: false,
        teamSide,
    };

    const togglePLayerIsActive = () => {
        info.isActive = !info.isActive;
    };

    const getPlayerInfo = () => info;
    const getPlayerActiveState = () => info.isActive;

    return {
        getPlayerInfo,
        getPlayerActiveState,
        togglePLayerIsActive,
    };
};

const playersManage = () => {
    const playerList = [player('enemy', 'Sinksalot')];

    const adUserToPlayerList = (newName = '') => {
        const userPlayer = player('team', newName);
        userPlayer.togglePLayerIsActive();
        playerList.unshift(userPlayer);
    };

    const switchActivePlayer = () => {
        playerList[0].togglePLayerIsActive();
        playerList[1].togglePLayerIsActive();
    };

    const getPlayerList = () => playerList;
    const getActivePlayerInfo = () => {
        if (playerList[0].getPlayerActiveState()) {
            return playerList[0].getPlayerInfo();
        } else {
            return playerList[1].getPlayerInfo();
        }
    };

    return {
        adUserToPlayerList,
        switchActivePlayer,
        getPlayerList,
        getActivePlayerInfo,
    };
};

const players = playersManage();
players.adUserToPlayerList('yue');
console.log(players.getPlayerList()[0].getPlayerInfo());
console.log(players.getPlayerList()[1].getPlayerInfo());
console.log(players.getActivePlayerInfo());
players.switchActivePlayer();
console.log(players.getActivePlayerInfo());
