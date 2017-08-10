import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { Field, reduxForm, reducer as formReducer } from 'redux-form';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button
} from 'react-native';

let reqError;
let maxError;
let emailError;

// Field-level validators
const validationRequired = value => {
  let result = reqError = value ? undefined : `This can't be empty`;
  return result;
};

const validationMaxLength = max => value => {
  let result = maxError = value && value.length > max
    ? `Must be ${max} characters or less`
    : undefined;
  return result;
};

const validationEmail = value => {
  let result = emailError = value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;
  return result;
};

export const styles = StyleSheet.create({
  textField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center'
  },
  errorMessage: {
    textAlign: 'right'
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
  <View style={{marginBottom:20}}>
    <TextInput
      style={styles.textField}
      onChangeText={onChange}
      {...restInput}
      {...restProps}
    />
    <View style={{marginBottom:10}}>
      <Text style={styles.errorMessage}>{`Required error: ${reqError}`}</Text>
      <Text style={styles.errorMessage}>{`Max length (8 chars) error: ${maxError}`}</Text>
      <Text style={styles.errorMessage}>{`Email error: ${emailError}`}</Text>
    </View>
    <Text style={styles.errorMessage}>{`Actual received error message: ${error}`}</Text>
  </View>
);

// The actual form
let SimpleForm = ({
  handleSubmit
}) => (
  <View
    style={{
      margin: 10,
      marginTop: 30
    }}
  >
    <Field
      name="email"
      component={InputField}
      keyboardType={'email-address'}
      placeholder={'E-mail'}
      autoCapitalize={'none'}
      autoCorrect={false}
      validate={[
        validationRequired,
        validationMaxLength(8),
        validationEmail
      ]}
    />
    <Button
      title={'Submit'}
      onPress={handleSubmit(values => console.log(values))}
    />
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

export default () => (
  <Provider store={store}>
    <SimpleForm/>
  </Provider>
);
