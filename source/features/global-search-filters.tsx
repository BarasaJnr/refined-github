import React from 'dom-chef';
import {XIcon} from '@primer/octicons-react';
import elementReady from 'element-ready';
import * as pageDetect from 'github-url-detection';

import features from '../feature-manager';
import SearchQuery from '../github-helpers/search-query';
import {getUsername} from '../github-helpers';

async function init(): Promise<void> {
	const filters = [
		['Forks', 'fork:true'],
		['Private', 'is:private'],
		['Yours', 'user:' + getUsername()!],
		['Authored', 'author:@me'],
	];
	const items = [];
	for (const [name, filter] of filters) {
		const item = <a className="filter-item" href={location.href}>{name}</a> as unknown as HTMLAnchorElement;
		const query = SearchQuery.from(item);

		if (query.includes(filter)) {
			query.remove(filter);
			item.classList.add('selected');
			item.prepend(<XIcon className="float-right"/>);
		} else {
			query.add(filter);
		}

		item.href = query.href;
		items.push(<li>{item}</li>);
	}

	const links = await elementReady('#js-pjax-container .menu ~ .mt-3');
	links!.before(
		<div className="border rounded-1 p-3 mb-3 d-none d-md-block">
			<h2 className="d-inline-block f5 mb-2">
				Filters
			</h2>
			<ul data-pjax className="filter-list small">
				{items}
			</ul>
		</div>,
	);
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isGlobalSearchResults,
	],
	awaitDomReady: false,
	deduplicate: 'has-rgh',
	init,
});
