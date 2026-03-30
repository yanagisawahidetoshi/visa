// components/MemberListItem/index.tsx
import { Pressable, Text } from 'react-native';
import { Member } from '../../data/members';
import { styles } from './styles';

type Props = {
  member: Member;
  onPress: () => void;
};

export const MemberListItem = ({ member, onPress }: Props) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.name}>{member.name}</Text>
    </Pressable>
  );
};