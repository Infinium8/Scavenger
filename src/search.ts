// These values were bundled into Payload
// because they are used frequently throughout
// the functions below.
interface Payload {
	result: any;
	query: string;
}

// Define some searchInX functions that
// accept a resource and query, and determine
// if the query is relevant to the resource.

const searchInString = (resource: string, query: string) => {
	return resource.toLowerCase().includes(query);
};

const searchInStringArray = (resource: string[], query: string) => {
	return resource.some((e: string) => e.toLowerCase().includes(query));
};

const searchInNumber = (resource: number, query: string) => {
	return resource.toString().includes(query);
};

// This is essentially just merging
// the `array` type into the `typeof`
// syntax.
const getPropertyType = (v: any) => {
	return Array.isArray(v) ? 'array' : typeof v;
};

// If the query is found within the value found
// at `key`, returns true.
const isQueryWithinResourceProperty = (payload: Payload, key: string) => {
	const resourceProperty = payload.result[key];
	const query = payload.query.trim().toLowerCase();
	const type = getPropertyType(resourceProperty);

	switch (type) {
		case 'string':
			return searchInString(resourceProperty, query);
		case 'array':
			return searchInStringArray(resourceProperty, query);
		case 'number':
			return searchInNumber(resourceProperty, query);
		default:
			if (type === 'undefined') {
				throw new Error(
					`Scavenger: Found an empty resource value (${type}). Either it's empty within your data or you didn't add this property to your Schema.`
				);
			} else {
				throw new Error(
					`Scavenger doesn't support searching in ${type} just yet. If you need this support, please open an issue.`
				);
			}
	}
};

// Returns an array of boolean values indicating
// whether or not any of the properties (specified
// by Schema) within the current resource had the
// query within them.
const isQueryWithinResource = (payload: Payload, key: string, Schema: any) => {
	if (!Schema[key]) {
		throw new Error(`Invalid Schema key. Got: ${Schema[key]}`);
	}

	// @ts-ignore
	return Schema[key].map((e: any, i: number) =>
		isQueryWithinResourceProperty(payload, Schema[key][i])
	);
};

// Returns an array of filtered results.
// If any value in the array returned by
// the above function contains `true`, they
// are included in the return value of this
// function.
const getFilteredResults = (
	results: any[],
	query: string,
	Schema: any,
	id: string
) => {
	return results.filter((result) => {
		const payload = {
			result,
			query,
		};

		for (let key in Schema) {
			if (Schema.hasOwnProperty(key) && result[id] === key) {
				return isQueryWithinResource(payload, key, Schema).includes(
					true
				);
			}
		}

		return 0;
	});
};

// Filters the results by type
const filterResults = (
	results: any[],
	scope: string | string[],
	id: string
) => {
	if (scope === 'root') {
		return results;
	}

	return results.filter((result) => scope.includes(result[id]));
};

// Sorts the results array by a property
// sortBy
const sortResultsByTypeProperty = (results: any[], sortBy: string) => {
	return results.length === 0
		? []
		: [...results].sort((a, b) => {
			let fa = a[sortBy].toLowerCase(),
				fb = b[sortBy].toLowerCase();

			if (fa > fb) {
				return 1;
			}
			if (fa < fb) {
				return -1;
			}

			return 0;
		});
};

// Although not integrated into the useScavenger
// hook, you can use this function to sort result
// objects into a specific order, as specified by
// the string[] `order`.
const sortObjectsInSpecificOrder = (array: any[], order: string[], key: string) => {
	array.sort(function (a: any, b: any) {
		const cA = a[key];
		const cB = b[key];

		if (order.indexOf(cA) > order.indexOf(cB)) {
			return 1;
		} else {
			return -1;
		}
	});

	return array;
};

export {
	getFilteredResults,
	filterResults,
	sortResultsByTypeProperty,
	sortObjectsInSpecificOrder,
};
