const React = require('react');
const { colors } = require('./colors');
const { dimens } = require('./dimens');
const { images } = require('./images');
const { changeLanguage, strings } = require('./strings');
const defaultResources = {
  colors: colors['default'],
  dimens: dimens,
  images: images,
  strings: strings,
};
const ResourcesContext = React.createContext(defaultResources);
const ResourcesProvider = ({ colorTheme ,language, ...props }) => {
  const [state, setState] = React.useState({ language: 'en' });
  const _colors = React.useMemo(() => colors[colorTheme || 'default'], [colorTheme]);
  React.useEffect(() => { language !== state.language && changeLanguage(language, () => setState({ ...state, language: language })) }, [language]);
  return (
    <ResourcesContext.Provider value={{ ...defaultResources, colors: _colors }} ref={props.ref} >
      {props.children}
    </ResourcesContext.Provider>
  );
}
const ResourcesConsumer = (props) => {
  return <ResourcesContext.Consumer {...props} />;
}
function resourcesConsumer(render) {
  return <ResourcesConsumer>{render}</ResourcesConsumer>;
}
function useResources() {
  return React.useContext(ResourcesContext);
}
function withResources(Component) {
  return (props) => resourcesConsumer((resources) => <Component {...props} resources={resources} />);
}
module.exports = { ResourcesContext, ResourcesProvider, ResourcesConsumer, resourcesConsumer, useResources, withResources };
