// screens/MemberDetail/index.tsx
import { View, TextInput, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { MemberDetailRouteProp } from '../../types/navigation';
import { styles } from './styles';

export const MemberDetailScreen = () => {
  const route = useRoute<MemberDetailRouteProp>();
  const { member } = route.params;
  const [date, setDate] = useState(member.presentationDate ?? '');

  const handleSubmit = () => {
    // 後でAsyncStorage等に繋ぐ
    console.log({ id: member.id, date });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="発表日を入力 (例: 2025-04-01)"
      />
      <Button title="保存" onPress={handleSubmit} />
    </View>
  );
};