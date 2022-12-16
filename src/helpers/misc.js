const isObjectEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object;

const warn = msg => {
	console.warn(msg);
	return null;
};

const convertVNodeArray = (h, wrapperTag, nodes) => {
	if (nodes.length > 1 || !nodes[0].tag) {
		return h(wrapperTag, {}, nodes);
	}

	return nodes[0];
};

export {
	isObjectEmpty,
	warn,
	convertVNodeArray
};
