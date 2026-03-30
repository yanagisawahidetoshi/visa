// screens/MemberList/index.tsx
import { FlatList, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { members, Member } from '../../data/members';
import { MemberListItem } from '../../components/MemberListItem';
import { RootStackParamList } from '../../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MemberList'>;
};

export const MemberListScreen = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: Member }) => (
    <MemberListItem
      member={item}
      // コレは後で良い
      // onPress={() => navigation.navigate('MemberDetail', { member: item })}
    />
  );

  return (
    <View>
      <FlatList
        data={members}
        // keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </View>
  );
};
