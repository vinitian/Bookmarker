import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import fetchBook from '@/lib/fetchBook';


export default function BookDetail() {
  const local = useLocalSearchParams<{book_id: string}>();
  let book_id:string = local.book_id;

  const [ book, setBookData ] = useState<Book|undefined>(undefined);
  const [ IsDataFetched, setIsDataFetched ] = useState<boolean>(false);
  useEffect( () => {
    fetchBook({book_id: book_id, setBookData: setBookData})
  }, [book_id])

  return (
    <View>
    {
      (!book) ? 
      <Text>Book not found</Text>
      // <Redirect href="../../app/+not-found" />
      :
      <div>
        <Text>{book.title} by {book.author_list[0]}</Text>
      </div>
    }
    </View>
  );
}
