import { mapGrid, mapCell, shipList } from '../factories/mapComponents';

const teamPlayer = () => {
    const teamMapManager = mapGrid('team');
    teamMapManager.buildMapGrid();
    const teamMap = teamMapManager.getMap();
    
    const teamShipsManager = shipList();
    teamShipsManager.createShipList();
    const teamShipList = teamShipsManager.getShipList();

    return {
        teamMapManager,
        teamMap,
        teamShipsManager,
        teamShipList,
    };
};

export { teamPlayer };
