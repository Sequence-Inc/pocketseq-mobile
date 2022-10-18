import React from 'react';
import { Colors, ColorGroups } from './colors';
import { Dimens } from './dimens';
import { Images } from './images';
import { GetString, Strings, StringGroups } from './strings';
type ResourcesProviderProps = {
  colorTheme?: ColorGroups;
  language?: StringGroups;
};
type Resources = {
  colors: Colors;
  dimens: Dimens;
  images: Images;
  strings: GetString<keyof Strings>;
};
export const ResourcesContext: React.Context<Resources>;
export const ResourcesProvider: React.FC<ResourcesProviderProps>;
export const ResourcesConsumer: ResourcesContext.Consumer;
export function resourcesConsumer(render: (resources: Resources) => React.ReactNode): React.ReactNode {}
export function useResources(): Resources {}
export function withResources(Component: React.ComponentType<any>): React.ComponentType<any> {}
