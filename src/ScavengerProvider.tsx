import React, { createContext, useContext, useState } from 'react';

import type { TScavengerProvider } from './types';


interface Schema {
	[key: string]: string[];
}

interface Props {
	initialResources: any[];
	suggestions: any[];
	schema: Schema;
	children: React.ReactNode;
}

const ScavengerContext = createContext<TScavengerProvider>({
	resources: [],
	suggestions: [],
	updateResources: () => {},
	initialResources: [],
	schema: {},
});

const ScavengerProvider = ({ initialResources, suggestions, schema, children }: Props) => {
	const [resources, setResources] = useState(initialResources ? initialResources : []);

	const value: TScavengerProvider = {
		resources,
		suggestions,
		updateResources: (v: any) => setResources(v),
		initialResources,
		schema,
	};

	return (
		<ScavengerContext.Provider value={value}>
			{children}
		</ScavengerContext.Provider>
	);
}

const useScavengerProvider = () => {
	return useContext(ScavengerContext);
}

export default ScavengerProvider;

export {
	useScavengerProvider,
}