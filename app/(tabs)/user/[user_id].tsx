import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import fetchUser from '@/lib/fetchUser';


export default function UserProfile() {
  const local = useLocalSearchParams<{user_id: string}>();
  const user_id:string = local.user_id;
  
  const [ user, setUserData ] = useState<User|undefined>(undefined);
  const [ IsDataFetched, setIsDataFetched ] = useState<boolean>(false);
  useEffect( () => {
    fetchUser({user_id: user_id, setUserData: setUserData})
  }, [])

  console.log(user)

  return (
    <View>
    {
      (!user) ? 
      <Text>User not found</Text>
      // <Redirect href="../../app/+not-found" />
      :
      <div>
        <Text>User_id: {user.user_id}</Text>
        <Text>Name: {user.name}'s Profile</Text>
      </div>
    }
    </View>
  );
}
