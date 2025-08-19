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
     * @param {string} cell_pos - cell position id
     * @param {boolean} cellDisability - true: add disable class- red/blue
     * @returns
     */
    const mapCellElement = (cell_pos, cellDisability = false) => {
        if (cell_pos === '') {
            throw new Error('Cannot add map cell without filed position!');
        }

        const mapCell = document.createElement('div');
        mapCell.classList.add('mapCell');
        if (cellDisability === true) {
            mapCell.classList.add('disable');
            mapCell.setAttribute('disabled', '');
        }
        mapCell.dataset.cell_pos = cell_pos;

        return mapCell;
    };

    return {
        mapDot,
        mapCellElement,
    };
};

export default htmlElements;
