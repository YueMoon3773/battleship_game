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

    const mapFieldElement = (fieldPos, fieldDisability) => {
        if (fieldPos === '') {
            throw new Error('Cannot add map field without filed position!');
        }
        const mapField = document.createElement('div');
        mapField.classList.add('mapField');
        if (fieldDisability === true) {
            mapField.classList.add('disable');
        }
        mapField.dataset.fieldPos = fieldPos;

        return mapField;
    };

    return {
        mapDot,
        mapCrossHairElement,
        mapWaveGuideElement,
        mapFieldElement,
    };
};

export default htmlElements;
