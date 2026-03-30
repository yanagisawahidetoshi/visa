// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MemberListScreen } from './screens/MemberList';
import { MemberDetailScreen } from './screens/MemberDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MemberList"
          component={MemberListScreen}
          options={{ title: 'メンバー一覧' }}
        />
        {/*後で良い
        <Stack.Screen
          name="MemberDetail"
          component={MemberDetailScreen}
          options={({ route }) => ({ title: route.params.member.name })}
        />
*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}