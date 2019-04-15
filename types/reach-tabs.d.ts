/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// from https://github.com/reach/reach-ui/pull/105

declare module '@reach/tabs' {
  import { ComponentType } from 'react'

  export interface BaseTabProps<A> {
    children?: React.ReactNode
    as?: ComponentType
    rest?: A
  }

  export interface TabsProps<A = React.HTMLAttributes<HTMLDivElement>>
    extends BaseTabProps<A> {
    children: React.ReactNode

    defaultIndex?: number
    index?: number
    onChange?(index: number): void
  }
  export class Tabs extends React.Component<TabsProps> {}

  export type TabListProps<
    A = React.HTMLAttributes<HTMLDivElement>
  > = BaseTabProps<A>
  export class TabList extends React.Component<TabListProps> {}

  export type TabPanelsProps<
    A = React.HTMLAttributes<HTMLDivElement>
  > = BaseTabProps<A>
  export class TabPanels extends React.Component<TabPanelsProps> {}

  export type TabPanelProps<
    A = React.HTMLAttributes<HTMLDivElement>
  > = BaseTabProps<A>
  export class TabPanel extends React.Component<TabPanelProps> {}

  export interface TabProps<A = React.HTMLAttributes<HTMLDivElement>>
    extends BaseTabProps<A> {
    disabled?: boolean
  }
  export class Tab extends React.Component<TabProps> {}
}
