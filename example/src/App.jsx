import { useState } from 'react';
import useScavenger, { ScavengerProvider } from '@infinium/scavenger';

// Define some example data
const resources = [
	{
		type: 'Language',
		name: 'TypeScript',
	},
	{
		type: 'Language',
		name: 'Python',
	},
	{
		type: 'Language',
		name: 'Go',
	},
	{
		type: 'Language',
		name: 'Perl',
	},
	{
		type: 'Language',
		name: 'Swift',
	},
];

const OSResources = [
	{
		type: 'OperatingSystem',
		name: 'MacOS',
		ratings: ['1', '2', '3', '4', '5'],
	},
	{
		type: 'OperatingSystem',
		name: 'GNU/Linux',
		ratings: ['6', '7', '8', '9', '10'],
	},
	{
		type: 'OperatingSystem',
		name: 'Windows',
		ratings: ['-10', '-20', '-30', '-40', '-50'],
	},
]

// Define some suggestions (when the query is empty)
const suggestions = [
	resources[0],
];


// 1. Declare a Schema to map your data

/// Schemas declare entity types within your whole
/// selection of searchable data. For instance, you
/// may want to separate searchable pages on your site
/// from searchable blog posts.
///
/// Each Schema value is an array of string values
/// that are keys you want to search.
const Schema = {
	Language: ['name', 'type'],
	OperatingSystem: ['name', 'type', 'ratings'],
};

// 2. Wrap your App in the ScavengerProvider
//    and load the initial resources and suggestions.
const App = () => {
	return (
		<ScavengerProvider
			schema={Schema}
			initialResources={resources}
			suggestions={suggestions}
		>
			<MyComponent />
		</ScavengerProvider>
	)
};


const MyComponent = () => {
	// 3. Create a state object to hold the query.
	//    It must be a state object because the
	//    useScavenger hook requires a re-render
	//    to update the results.
	const [query, setQuery] = useState('');

	// This isn't required, but here we give the 
	// option to dynamically change the scope.
	const [scope, setScope] = useState('root');

	// 4. Invoke the useScavenger hook.
	const scavenger = useScavenger(query, {
		sortBy: 'name',
		scope,
		id: 'type'
	});

	return (
		<section className='section'>
			<div className='container flex-c'>
				<div className='mw-40r flex-c text-c'>
					<h1>Search</h1>

					<p>
						{scavenger.results?.length} out of{' '}
						{scavenger.resources?.length}
					</p>

					<input
						type='text'
						className='j-input thin no-shadow'
						placeholder='Start typing...'
						autoFocus

						// 5. Update the query state
						onChange={ev => setQuery(ev.target.value)}
						value={query}
					/>

					<button className='j-button' onClick={() => scavenger.loadResources(OSResources)}>
						Add new OS resources
					</button>
					<button className='j-button mt-1r' onClick={() => setScope('OperatingSystem')}>
						Change scope to OS only
					</button>
				</div>

				<div className="mt-3r">
					{/* 5. Render the results */}
					{scavenger.results.map(result => (
						<p key={result.name}>{result.name} ({result.type})</p>
					))}
				</div>
			</div>
		</section>
	);
}


export default App;