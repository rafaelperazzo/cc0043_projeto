import React from 'react';
import {FlatList, SafeAreaView, Text} from 'react-native';

function Users(props) {
  return (
    <SafeAreaView>
      <FlatList
        data={props.dados}
        renderItem={({item}) => (
          <Text>
            {item.nome} - {item.email}
          </Text>
        )}></FlatList>
    </SafeAreaView>
  );
}
export default Users;
