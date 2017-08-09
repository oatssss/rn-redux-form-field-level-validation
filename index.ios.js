import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { Field, reduxForm, reducer as formReducer } from 'redux-form';

import {
  TouchableOpacity,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Field-level validators
const validationRequired = value =>
  value
    ? undefined
    : 'Required'
const validationMaxLength = max => value =>
  value && value.length > max
    ? `Must be ${max} characters or less`
    : undefined
const validationEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
const validationPassword = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined

export const styles = StyleSheet.create({
  textField: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 20
  }
});

// Component we'll use as the input field
const InputField = ({
  input: {
    onChange,
    ...restInput
  },
  meta: {
    error,
    warning,
    touched,
    ...restMeta
  },
  ...restProps
}) => (
  <View>
    <TextInput
      style={styles.textField}
      onChangeText={onChange}
      {...restInput}
      {...restProps}
    />
    <Text>{error || warning || 'Message goes here'}</Text>
  </View>
);

// The actual form
let SimpleForm = ({
  handleSubmit
}) => (
  <View>
    <Field
      name="email"
      component={InputField}
      underlineColorAndroid={'transparent'}
      keyboardType={'email-address'}
      placeholder={'E-mail'}
      autoCapitalize={'none'}
      autoCorrect={false}
      validate={[
        validationRequired,
        validationMaxLength(128),
        validationEmail
      ]}
    />
    <Field
      name="pass"
      component={InputField}

      secureTextEntry={true}
      placeholder={'Password'}
      validate={[
        validationRequired,
        validationMaxLength(64),
        validationPassword
      ]}
    />
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handleSubmit(values => console.log(values))}
    >
      <Text>Submit</Text>
    </TouchableOpacity>
  </View>
);

SimpleForm = reduxForm({
  form: 'simple'
})(SimpleForm);

// Create redux-form reducer
const rootReducer = combineReducers({
  form: formReducer
});

// Create redux-form store
const store = createStore(rootReducer);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <SimpleForm/>
      </Provider>
    )
  }
};

AppRegistry.registerComponent('TestReduxForm', () => Root);
