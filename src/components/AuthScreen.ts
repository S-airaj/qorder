import * as React from 'react';
import { StyleSheet } from 'react-native';
import store from '../storeData/AuthStore';

interface Props {}

interface State {
  Token: string;
  isLoading: boolean;
}

export default class AuthScreen extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      Token: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    store.getData('Token')
      .then((res) => {
        this.setState({ Token: res, isLoading: true });
        console.log(this.state);
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    return null;
  }
}

const styles = StyleSheet.create({});
