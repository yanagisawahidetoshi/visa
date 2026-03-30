// types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Member } from '../data/members';

export type RootStackParamList = {
  MemberList: undefined;
  MemberDetail: { member: Member };
};

export type MemberListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MemberList'>;
export type MemberDetailRouteProp = RouteProp<RootStackParamList, 'MemberDetail'>;