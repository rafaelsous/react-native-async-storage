import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card, CardProps } from '../../components/Card';
import { HeaderHome } from '../../components/HeaderHome';
import { styles } from './styles';


export function Home() {
  const [data, setData] = useState<CardProps[]>([]);

  const { getItem, removeItem, setItem } = useAsyncStorage('@savepass:passwords');

  async function handleFetchData() {
    const response = await getItem();
    const responseData = response ? JSON.parse(response) : [];

    setData(responseData);
  }

  async function handleCleanData() {
    await removeItem();
    setData([]);
  }

  async function handleRemoveItem(id: string) {
    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];

    const data = previousData.filter(item => item.id !== id)

    await setItem(JSON.stringify(data));
    setData(data);
  }

  useFocusEffect(useCallback(() => {
    handleFetchData();
  }, []));

  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>
          Suas senhas
        </Text>

        <Text style={styles.listCount}>
          {`${data.length} ao total`}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          <Card
            data={item}
            onPress={() => handleRemoveItem(item.id)}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          onPress={handleCleanData}
          title="Limpar lista"
        />
      </View>
    </View>
  );
}