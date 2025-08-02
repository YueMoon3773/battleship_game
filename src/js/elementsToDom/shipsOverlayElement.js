const svgAttributesHandler = (shipSize, shipColPos = 0, shipRowPos = 0, shipIsVertical = false) => {
    let verticalClass = '';
    let gridRow = `${shipRowPos} / ${shipRowPos + 1}`;
    let gridCol = `${shipColPos} / ${shipColPos + shipSize}`;

    if (shipIsVertical === true) {
        verticalClass = 'vertical';
        gridRow = `${shipRowPos} / ${shipRowPos + shipSize}`;
        gridCol = `${shipColPos} / ${shipColPos + 1}`;
    }

    return {
        verticalClass,
        gridCol,
        gridRow,
    };
};

// const { verticalClass, gridCol, gridRow } = svgAttributesHandler(5, 1, 1, false);
// const { verticalClass, gridCol, gridRow } = svgAttributesHandler(5, 10, 2, true);
// console.log(verticalClass);
// console.log(gridCol);
// console.log(gridRow);

const shipsSvgOverlay = () => {
    /**
     *
     * @param {number} shipColPos - grid column, Ex: 3; 4
     * @param {number} shipRowPos - grid row, Ex: 3; 8
     * @param {boolean} shipIsVertical - is ship in vertical state
     * @returns svg element to insertAdjacentHTML
     */
    const carrierImg = (shipColPos = 0, shipRowPos = 0, shipIsVertical = false) => {
        const shipSize = 5;
        const { verticalClass, gridCol, gridRow } = svgAttributesHandler(
            shipSize,
            shipColPos,
            shipRowPos,
            shipIsVertical,
        );
        console.log(verticalClass);
        console.log(gridCol);
        console.log(gridRow);

        const svgElement = `
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="299.000000pt"
            height="95.000000pt"
            viewBox="0 0 299.000000 95.000000"
            preserveAspectRatio="none"
            class="shipOverlay carrierImg ${verticalClass}"
            style="grid-column: ${gridCol}; grid-row: ${gridRow};"
        >
            <metadata>
                Created by potrace 1.16, written by Peter Selinger 2001-2019
            </metadata>
            <g
                transform="translate(0.000000,95.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
            >
                <path
                    d="M2139 875 c0 -11 0 -41 1 -68 1 -35 -3 -49 -14 -53 -9 -3 -13 -10 -10 -15 3 -5 -2 -12 -10 -15 -9 -3 -16 -14 -16 -24 0 -32 -42 -130 -56 -130 -9 0 -14 17 -16 53 l-3 52 -65 0 -65 0 3 -51 c3 -40 0 -53 -12 -57 -10 -4 -16 -19 -16 -42 l0 -35 -115 0 -115 0 0 -70 0 -70 -660 0 -660 0 0 -25 c0 -20 5 -25 25 -25 16 0 25 -6 25 -15 0 -13 -23 -15 -145 -15 -164 0 -159 3 -130 -79 21 -61 51 -98 98 -124 l42 -22 1282 -3 1283 -2 6 27 c14 64 39 132 73 198 20 39 37 73 39 77 2 4 -113 9 -255 10 l-258 3 -2 40 c-6 97 -15 145 -26 145 -9 0 -11 13 -9 40 l4 40 -50 0 c-30 0 -54 -5 -59 -13 -4 -7 -20 -18 -35 -24 -16 -7 -28 -19 -28 -28 0 -8 -5 -15 -11 -15 -7 0 -10 33 -10 98 1 123 -8 234 -20 247 -6 5 -9 2 -10 -10z"
                />
            </g>
        </svg>`;

        return svgElement;
    };

    const battleshipImg = (shipColPos = 0, shipRowPos = 0, shipIsVertical = false) => {
        const shipSize = 4;
        const { verticalClass, gridCol, gridRow } = svgAttributesHandler(
            shipSize,
            shipColPos,
            shipRowPos,
            shipIsVertical,
        );
        const svgElement = `
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="299.000000pt"
            height="95.000000pt"
            viewBox="0 0 299.000000 95.000000"
            preserveAspectRatio="none"
            class="shipOverlay battleshipImg ${verticalClass}"
            style="grid-column: ${gridCol}; grid-row: ${gridRow};"
        >
            <metadata>
                Created by potrace 1.16, written by Peter Selinger 2001-2019
            </metadata>
            <path
                transform=""
                d="M215 6.5c-.2 1.1-.2 2.3-.1 2.7 0 .4.3 2.5.7 4.7.6 3.4.4 4.1-1 4.1-1.3 0-1.6.5-1.1 2 .4 1.4.2 2-.8 2s-1.5 1.1-1.5 3.2c-.1 1.8-.9 5.8-2 8.8-1.8 5.2-2.1 5.5-5.5 5.8-2.8.2-3.6.8-3.9 2.5-.2 1.2-1 2.3-1.9 2.5-1.2.2-2.4-2.6-5.5-13.3L188.5 18h-4.2c-6.1 0-6.9 1.4-7.8 12.7-1 14.8-.8 14.3-7 14.3-4.8 0-5.4.3-5.8 2.2-.4 2-.4 1.9-.6-.5-.1-2-.6-2.7-2.1-2.7-1.4 0-2-.7-2-2.1 0-1.5-.5-2-2.2-1.7-1.6.2-2.2.9-2 2 .2 1-.2 1.8-.8 1.8-.5 0-1 1.1-1 2.5 0 2.4-.3 2.5-5.4 2.5-4.9 0-5.5.2-5.8 2.2-.2 1.5-1.1 2.4-2.5 2.6-1.5.2-2.3 1-2.3 2.3 0 1.8-.9 1.9-23.2 1.9-12.8 0-23.9-.4-24.7-.9-2.2-1.4 2-4.7 7.4-5.7 5-.9 6.9-2.9 4-4-.9-.4-2.1 0-2.8 1-.9 1.3-2.4 1.7-5.7 1.4-6.5-.5-6.4-2.8.2-2.9 8.1-.2 2-1.7-6.7-1.7-8.4 0-14.9 1.5-7.2 1.7 5.4.1 6 1.2 1.7 2.8-1.9.7-3 1.8-3 3.1 0 2.1 2.2 4.5 3.4 3.7.3-.3.2 0-.3.6-.5.7-5 .9-12.7.6-6.6-.3-13.5-.6-15.4-.6-2.7-.1-3.1-.3-2-1.1.8-.5 2.7-1 4.2-1 1.7 0 3.1-.8 3.8-2 .8-1.5 2.1-2 5.5-2 4.6 0 6.5-1.4 4.6-3.3-.9-.9-1.6-.8-3.1.1-2.4 1.4-11 1.6-11 .2 0-.6 2-1 4.5-1s4.5-.5 4.5-1c0-1.3-20.7-1.3-21.5-.1-.3.6 1.6 1.1 4.2 1.3 4.7.3 4.7.4 2 1.6-1.5.6-3 1.9-3.4 2.8-.7 2 1 5 2.7 4.6.6-.1.9.2.5.8-.3.5-3.7 1-7.6 1H33v2.9c0 2.4.5 3 2.5 3.3 1.4.2 2.5.7 2.5 1.3 0 .6-5.7 1.1-14.5 1.3-8 .1-14.5.6-14.5 1 0 .5.7 3.1 1.5 6 1.9 6.3 5.7 10.9 11 13.3 3.8 1.8 9.9 1.9 131 1.9h127l1.7-6.4c1.7-6.5 8.3-21.1 9.9-22.2 2.9-1.8-.5-2.4-13-2.4-11.7 0-14-.2-14.5-1.6-.9-2.4-.9-2.4 4.2-2.5l4.7-.2-6-.8c-10.6-1.6-13-1.7-15.2-1.2-2.2.5-3.3 3.3-1.3 3.3.6 0 1 .7 1 1.5 0 1.2-1.3 1.5-5.5 1.5H240v-5.3c0-7.3-1-12.7-2.4-12.7-.7 0-1-1.4-.8-4l.4-4h-4.6c-4.7 0-8.1 1.3-10.2 3.9-.9 1.2-1.3.5-1.9-3.6-.4-2.9-.4-6.1 0-7.2.4-1.4-.1-3.1-1.4-5-1.3-1.8-2.1-4.6-2.2-7.3 0-2.3-.4-5.2-.9-6.3l-.9-2-.1 2z"
            />
        </svg>`;

        return svgElement;
    };

    const destroyerImg = (shipColPos = 0, shipRowPos = 0, shipIsVertical = false) => {
        const shipSize = 3;
        const { verticalClass, gridCol, gridRow } = svgAttributesHandler(
            shipSize,
            shipColPos,
            shipRowPos,
            shipIsVertical,
        );
        const svgElement = `
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="153.000000pt"
            height="69.000000pt"
            viewBox="0 0 153.000000 69.000000"
            preserveAspectRatio="none"
            class="shipOverlay destroyerImg ${verticalClass}"
            style="grid-column: ${gridCol}; grid-row: ${gridRow};"
        >
            <metadata>
                Created by potrace 1.16, written by Peter Selinger 2001-2019
            </metadata>
            <g
                transform="translate(0.000000,69.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
            >
                <path
                    d="M536 486 c-5 -20 -13 -25 -44 -28 l-37 -3 -10 -92 c-5 -50 -13 -95 -17 -98 -4 -4 -25 -4 -47 0 -39 6 -41 9 -41 41 0 28 -4 35 -26 40 -14 4 -30 2 -37 -5 -6 -6 -25 -11 -42 -12 l-30 -1 33 -9 c19 -6 32 -16 32 -26 0 -14 -12 -15 -105 -9 -58 4 -105 5 -105 2 0 -3 28 -41 62 -86 l61 -80 582 0 c321 0 597 3 614 6 27 6 31 11 31 38 0 26 5 34 27 42 25 9 26 10 9 26 -11 12 -33 18 -62 18 -42 0 -59 12 -31 23 6 3 3 6 -8 7 -17 2 -16 3 5 9 21 7 17 9 -27 15 -61 9 -73 4 -73 -30 0 -23 -2 -24 -75 -24 -73 0 -75 1 -75 25 0 20 5 25 26 25 46 0 20 25 -29 28 -44 3 -47 5 -47 31 0 17 -7 31 -16 35 -25 10 -62 7 -70 -5 -3 -6 -19 -9 -35 -7 -15 3 -26 1 -23 -4 3 -4 13 -8 22 -9 14 0 13 -2 -3 -9 -17 -7 -17 -9 -2 -9 9 -1 17 -6 17 -11 0 -7 -22 -10 -57 -8 l-58 3 -7 44 c-4 24 -9 45 -11 47 -1 2 -22 4 -46 6 l-43 3 -17 -53 c-9 -30 -20 -53 -25 -53 -5 0 -20 37 -33 82 -13 45 -26 86 -29 91 -3 4 -20 8 -39 8 -26 0 -34 -5 -39 -24z"
                />
            </g>
        </svg>`;

        return svgElement;
    };

    const submarineImg = (shipColPos = 0, shipRowPos = 0, shipIsVertical = false) => {
        const shipSize = 3;
        const { verticalClass, gridCol, gridRow } = svgAttributesHandler(
            shipSize,
            shipColPos,
            shipRowPos,
            shipIsVertical,
        );
        const svgElement = `
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="302.000000pt"
            height="98.000000pt"
            viewBox="0 0 302.000000 98.000000"
            preserveAspectRatio="none"
            class="shipOverlay submarineImg ${verticalClass}"
            style="grid-column: ${gridCol}; grid-row: ${gridRow};"
        >
            <metadata>
                Created by potrace 1.16, written by Peter Selinger 2001-2019
            </metadata>
            <g
                transform="translate(0.000000,98.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
            >
                <path
                    d="M1473 773 l2 -48 -51 3 c-61 4 -69 -4 -78 -78 -4 -30 -9 -70 -12 -87 l-6 -33 -119 0 c-74 0 -120 4 -125 11 -4 7 -22 9 -48 5 -22 -3 -49 -6 -58 -5 -27 1 -106 0 -125 -1 -10 0 -33 2 -51 6 -19 4 -43 2 -55 -4 -12 -6 -48 -13 -80 -16 -77 -6 -138 -42 -165 -97 -12 -23 -19 -46 -16 -51 3 -4 498 -8 1101 -8 l1095 0 -6 27 c-5 17 -3 29 6 35 11 6 10 10 -1 17 -9 6 -11 18 -7 35 6 25 5 26 -39 26 l-45 0 0 85 0 85 -89 0 -90 0 -15 -52 c-8 -29 -21 -74 -28 -100 -13 -52 -17 -54 -90 -42 -28 5 -38 11 -38 25 0 16 -8 19 -51 19 -35 0 -55 -5 -63 -15 -10 -14 -24 -14 -101 -6 -50 5 -154 13 -232 16 l-142 7 -62 94 c-41 63 -68 94 -80 94 -16 0 -19 8 -19 50 0 28 -4 50 -10 50 -5 0 -9 -21 -7 -47z"
                />
            </g>
        </svg>`;

        return svgElement;
    };

    const cruiserImg = (shipColPos = 0, shipRowPos = 0, shipIsVertical = false) => {
        const shipSize = 2;
        const { verticalClass, gridCol, gridRow } = svgAttributesHandler(
            shipSize,
            shipColPos,
            shipRowPos,
            shipIsVertical,
        );
        const svgElement = `
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="112.000000pt"
            height="60.000000pt"
            viewBox="0 0 112.000000 60.000000"
            preserveAspectRatio="none"
            class="shipOverlay cruiserImg ${verticalClass}"
            style="grid-column: ${gridCol}; grid-row: ${gridRow};"
        >
            <metadata>
                Created by potrace 1.16, written by Peter Selinger 2001-2019
            </metadata>
            <g
                transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
            >
                <path
                    d="M599 533 c0 -4 0 -59 1 -120 1 -93 -1 -113 -13 -113 -8 0 -17 7 -21 15 -9 25 -80 19 -110 -9 -15 -13 -26 -28 -26 -35 0 -8 -49 -11 -165 -11 l-165 0 1 -42 c0 -24 8 -72 17 -108 l17 -65 389 -3 c287 -2 392 1 403 10 14 11 87 132 99 162 5 13 -4 16 -55 16 l-60 0 -11 41 c-7 23 -9 51 -6 62 3 13 -1 21 -15 24 -10 3 -19 13 -19 22 -1 14 -2 14 -14 -1 -17 -23 -96 -25 -96 -3 0 9 -10 15 -27 16 l-28 1 30 7 30 6 -43 13 c-51 16 -62 10 -62 -29 0 -17 -7 -38 -16 -46 -14 -15 -15 -7 -13 87 2 74 0 105 -9 108 -7 2 -12 0 -13 -5z"
                />
            </g>
        </svg>`;

        return svgElement;
    };

    return {
        carrierImg,
        battleshipImg,
        destroyerImg,
        submarineImg,
        cruiserImg,
    };
};

export default shipsSvgOverlay;
