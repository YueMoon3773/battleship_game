const domHelper = () => {
    const appendDomEle = (parent, childToAdd) => {
        if (childToAdd && parent) {
            parent.appendChild(childToAdd);
        } else if (!childToAdd) {
            throw new Error('missing child element');
        } else {
            throw new Error('missing parent element');
        }
    };

    const insertDomEle = (parent, childToAdd) => {
        if (childToAdd !== '' && parent) {
            parent.insertAdjacentHTML('beforeend', childToAdd);
        } else if (!childToAdd || childToAdd === '') {
            throw new Error('missing child element');
        } else {
            throw new Error('missing parent element');
        }
    };

    const renderMapCellGrid = () => {};

    return { appendDomEle, insertDomEle };
};

export default domHelper;
