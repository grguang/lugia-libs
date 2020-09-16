/**
 * 用于进行原始配置的组件
 * create by ligx
 *
 * @flow
 */
import { ThemeComponentConfig } from '@lugia/theme-core/lib/type';
import { getConfig, ThemeContext } from '@lugia/theme-core';

import { ThemeConfigProps } from './type';

import * as React from 'react';

type StateType = {};

export type ContextType = {
  config: ThemeComponentConfig;
  globalTheme: ThemeComponentConfig;
  svThemeConfigTree: ThemeComponentConfig;
};

class Theme extends React.Component<Partial<ThemeConfigProps>, StateType> {
  static defaultProps = {
    config: {},
  };
  static contextType = ThemeContext;
  static displayName = 'lugia_theme_wrap';
  svThemeConfigTree: object;
  globalTheme: object;
  context: ContextType;

  constructor(props: ThemeConfigProps, context: ContextType) {
    super(props);
    this.svThemeConfigTree = {};
    this.globalTheme = {};
    this.context = { config: {}, svThemeConfigTree: {}, globalTheme: {} };
    this.updateTreeConfig(props, context);
  }

  componentWillReceiveProps(nextProps: ThemeConfigProps, context: ContextType) {
    const nowContext = this.context;
    if (
      nextProps.config !== this.props.config ||
      nowContext.config !== context.config ||
      nowContext.svThemeConfigTree !== context.svThemeConfigTree
    ) {
      this.updateTreeConfig(nextProps, context);
    }
  }

  updateTreeConfig(props: ThemeConfigProps, context: ContextType) {
    const { globalTheme: propsGlobal } = props;
    const { config, svThemeConfigTree, globalTheme } = context;
    this.svThemeConfigTree = getConfig(svThemeConfigTree, config, props.config);
    this.globalTheme = globalTheme || propsGlobal;
  }

  getContextValue(): object {
    const { props } = this;
    const { config } = props;
    return {
      config,
      globalTheme: this.globalTheme,
      svThemeConfigTree: this.svThemeConfigTree,
    };
  }

  render() {
    const { children } = this.props;
    return (
      <ThemeContext.Provider value={this.getContextValue()}>
        {children}
      </ThemeContext.Provider>
    );
  }
}

export default Theme;
