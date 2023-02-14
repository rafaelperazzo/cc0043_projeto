import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Users from './Users';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [dados,setDados] = useState([]);
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }
  function autenticar(user, pass) {
    auth()
      .signInWithEmailAndPassword(email, senha)
      .then(() => {
        console.log('Sucesso');
      })
      .catch(error => {
        console.log('Erro!');
      });
  }
  if (!user) {
    return (
      <View>
        <TextInput
          placeholder={'Seu e-mail'}
          defaultValue={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder={'Sua senha'}
          defaultValue={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />
        <Button title={'Autenticar'} onPress={() => autenticar(email, senha)} />
      </View>
    );
  }

  return (
    <View>
      <Text>Bem vindo {user.email}</Text>
      <ActivityIndicator
        animating={false}
      ></ActivityIndicator>
      <Button
        title={'Logout'}
        onPress={() => {
          auth()
            .signOut()
            .then(() => console.log('Usuário saiu...'));
        }}
      />
      <Button
        title={'Mostrar'}
        onPress={async () => {
          setOcupado(true);
          let idToken = await auth().currentUser.getIdToken(true);
          let result = await database().ref('/usuarios').once('value');
          //console.log(result.toJSON());
          setOcupado(false);
          let json = [];
          result.forEach(key => {
            let linha = key.toJSON();
            //linha['id'] = key.key;
            json.push(linha);
          });
          setDados(json);
          //console.log(json);
        }}></Button>
      <Button title={'Limpar'} onPress={() => setDados([])}></Button>

      <ActivityIndicator animating={ocupado}></ActivityIndicator>

      <Users dados={dados}></Users>
    </View>
  );
}
export default App;
