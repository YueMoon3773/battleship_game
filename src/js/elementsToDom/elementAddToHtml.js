const htmlElements = () => {
    /**
     *
     * @param {string} dotColor - color of the dot on the map,
     * Only: red / blue
     * @returns svg element to insertAdjacentHTML
     */
    const mapDot = (dotColor = '') => {
        const mapDot = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mapDot ${dotColor}">
            <path
                d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
        </svg>`;

        return mapDot;
    };

    /**
     *
     * @param {string} teamSide - team / enemy
     * @returns
     */
    const mapCrossHairElement = (teamSide) => {
        const mapCrossHair = document.createElement('div');
        mapCrossHair.classList.add('mapCrossHair');
        if (teamSide !== '') {
            mapCrossHair.classList.add(`${teamSide}`);
        }

        return mapCrossHair;
    };

    /**
     *
     * @param {string} teamSide - team / enemy
     * @returns
     */
    const mapWaveGuideElement = (teamSide) => {
        const mapWaveGuide = document.createElement('div');
        mapWaveGuide.classList.add('mapWaveGuide');
        if (teamSide !== '') {
            mapWaveGuide.classList.add(`${teamSide}`);
        }

        return mapWaveGuide;
    };

    const mapCellElement = (cellPos, cellDisability) => {
        if (cellPos === '') {
            throw new Error('Cannot add map cell without filed position!');
        }
        const mapCell = document.createElement('div');
        mapCell.classList.add('mapCell');
        if (cellDisability === true) {
            mapCell.classList.add('disable');
        }
        mapCell.dataset.cellPos = cellPos;

        return mapCell;
    };

    return {
        mapDot,
        mapCrossHairElement,
        mapWaveGuideElement,
        mapCellElement,
    };
};

export default htmlElements;
