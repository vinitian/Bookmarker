import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import fetchUser from '@/lib/fetchUser';


export default function UserProfile() {
  const local = useLocalSearchParams<{user_id: string}>();
  let user_id:string = local.user_id;

  const [ user, setUserData ] = useState<User|undefined>(undefined);
  const [ IsDataFetched, setIsDataFetched ] = useState<boolean>(false);
  useEffect( () => {
    fetchUser({user_id: user_id, setUserData: setUserData})
  }, [user_id])

  return (
    <View>
    {
      (!user) ? 
      <Text>User not found</Text>
      // <Redirect href="../../app/+not-found" />
      :
      <div>
        <Text>{user.name}'s Profile</Text>
      </div>
    }
    </View>
  );
}
