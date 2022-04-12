interface Scavenger {
	results: any[];
	loadResources(v: any[]): void;
	resources: any[];
}

interface TScavengerProvider {
	resources: any[];
	updateResources(v: any): void;
	initialResources: any[];
	suggestions: any[];
	schema: any;
}

export type {
	Scavenger,
	TScavengerProvider,
}