import { useEffect, useState } from "react";

import { useScavengerProvider } from "./ScavengerProvider";

import { sortResultsByTypeProperty, getFilteredResults, filterResults } from "./search";

import type { Scavenger } from "./types";


interface Options {
	sortBy?: string;
	id?: string;
}

const defaultOptions = {
	sortBy: 'name',
	id: 'type',
}

const useScavenger = (
	query: string,
	scope: string = 'root',
	_options: Options = defaultOptions,
): Scavenger => {
	const options = {
		...defaultOptions,
		..._options,
	}

	const [results, setResults] = useState<any>([]);
	const {
		resources,
		updateResources,
		schema,
		suggestions,
	} = useScavengerProvider();

	const search = (query: any) => {
		return getFilteredResults(resources, query, schema, options.id);
	}

	useEffect(() => {
		if (query.trim() === '') {
			setResults(scope === 'root' ? suggestions : resources.filter((e: any) => e.type === scope));
		} else {
			setResults(filterResults(
				sortResultsByTypeProperty(search(query), options.sortBy),
				scope,
				options.id
			));
		}
	}, [query, scope]);

	const loadResources = (resources: any[], merge: boolean = true) => {
		updateResources((r: any[]) => {
			if (merge) {
				return [
					...r,
					...resources
				];
			} else {
				return resources;
			}
		})
	}

	return {
		results,
		loadResources,
		resources,
	};
}

export default useScavenger;