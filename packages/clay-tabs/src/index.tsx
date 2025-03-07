/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {InternalDispatch, useId, useInternalState} from '@clayui/shared';
import React from 'react';

import Content from './Content';
import Item from './Item';
import {List} from './List';
import TabPane from './TabPane';

export type DisplayType = null | 'basic' | 'underline';

export interface IProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * Flag to indicate the navigation behavior in the tab.
	 *
	 * - manual - it will just move the focus and tab activation is done just
	 * by pressing space or enter.
	 * - automatic - moves the focus to the tab and activates the tab.
	 */
	activation?: 'manual' | 'automatic';

	/**
	 * The current tab active (controlled).
	 */
	active?: number;

	/**
	 * Initial active tab when rendering component (uncontrolled).
	 */
	defaultActive?: number;

	/**
	 * Determines how tab is displayed.
	 */
	displayType?: DisplayType;

	/**
	 * Flag to indicate if `fade` classname that applies an fading animation
	 * should be applied.
	 */
	fade?: boolean;

	/**
	 * Justify the nav items according the tab content.
	 */
	justified?: boolean;

	/**
	 * Applies a modern style to the tab.
	 */
	modern?: boolean;

	/**
	 * Callback is called when the active tab changes (controlled).
	 */
	onActiveChange?: InternalDispatch<number>;
}

function ClayTabs(props: IProps): JSX.Element & {
	Content: typeof Content;
	Item: typeof Item;
	List: typeof List;
	Panels: typeof Content;
	TabPane: typeof TabPane;
	TabPanel: typeof TabPane;
};

function ClayTabs({
	activation = 'manual',
	active: externalActive,
	children,
	className,
	defaultActive = 0,
	displayType,
	fade = false,
	justified,
	modern = true,
	onActiveChange,
	...otherProps
}: IProps) {
	const [active, setActive, isUncontrolled] = useInternalState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'active',
		onChange: onActiveChange,
		value: externalActive,
	});

	const [left, right] = React.Children.toArray(children);

	const tabsId = useId();

	// @ts-ignore
	if (left?.type?.displayName === 'ClayTabsList') {
		return (
			<>
				{React.cloneElement(left as React.ReactElement, {
					activation,
					active,
					displayType,
					justified,
					modern,
					onActiveChange: setActive,
					shouldUseActive: isUncontrolled,
					tabsId,
				})}

				{React.isValidElement(right) &&
					React.cloneElement(right as React.ReactElement, {
						active,
						fade,
						tabsId,
					})}
			</>
		);
	}

	return (
		<List
			{...otherProps}
			activation={activation}
			active={active}
			className={className}
			displayType={displayType}
			justified={justified}
			modern={modern}
			onActiveChange={setActive}
		>
			{children}
		</List>
	);
}

/**
 * @deprecated since v3.78.2 - Use new composition with Tabs.List and Tabs.Panels.
 */
ClayTabs.Content = Content;

ClayTabs.Panels = Content;
ClayTabs.Item = Item;
ClayTabs.List = List;
ClayTabs.TabPane = TabPane;
ClayTabs.TabPanel = TabPane;

export default ClayTabs;
