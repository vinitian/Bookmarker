import {
  View,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppContext } from "@/app/_layout";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import fetchBook from "@/lib/fetchBook"
import StarRating from 'react-native-star-rating-widget';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import CustomBookView from "@/components/CustomBookView";
import CustomView2 from "@/components/CustomView2";
import fetchUser from "@/lib/fetchUser";
import rateBook from "@/lib/rateBook";
import addToTopTen from "@/lib/addToTopTen";

export default function BookInfoPage() {
  const router = useRouter();
  const { bookId, setBookId } = useAppContext()
  const local = useLocalSearchParams<{ book_id: string }>();
  const book_id: string = local.book_id;
  const [book, setBookData] = useState<Book | undefined>(undefined);
  useEffect(() => {
    fetchBook({ book_id: book_id, setBookData: setBookData })
  }, [book_id])

  const [userId, setUserId] = useState<string | undefined>(undefined);
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        }
      }),
    []
  );

  const fullAuthorList = book?.author_list.join(", ").replace(new RegExp('\,(?=[^,]*$)'), ' and')
  const [rating, setRating] = useState(0);
  const [IsRated, setIsRated] = useState(false);
  const [isfullDescription, setIsFullDescription] = useState<boolean>(false)
  const CHARACTER_LIMIT = 400;
  const isShortText = book ? book.description.length < CHARACTER_LIMIT : false;
  const cutDescription = book ? book.description.slice(0, CHARACTER_LIMIT) + (isShortText ? '' : '...') : '';
  useEffect(() => {
    setIsFullDescription(isShortText)
  }, [])

  const { height, width } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }


  const AddBookmarkButton = () => (
    <TouchableOpacity
      onPress={() => {
        setBookId(book_id)
        router.navigate("../../profile/logSession")

      }}
      style={{
        backgroundColor: "#79AB57",
        height: 30,
        marginTop: 10,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>Bookmark!</Text>
    </TouchableOpacity>
  );

  const AddToTopTenButton = () => (
    userId ?
      <TouchableOpacity
        //TODO: ADD FUNCTION HERE
        onPress={() => addToTopTen({ book_id: book_id, user_id: userId })}
        style={{
          backgroundColor: "#3C5433",
          height: 30,
          marginTop: 10,
          padding: 5,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Add to My Top Ten</Text>
      </TouchableOpacity>
      : <></>
  );

  const ShowMoreButton = () => (
    <TouchableOpacity
      onPress={() => setIsFullDescription(!isfullDescription)}
      style={{
        backgroundColor: "#EBDF94",
        height: 30,
        marginTop: 10,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        width: 100,
      }}
    >
      <Text style={{ color: "#3C5433" }}>
        {isfullDescription ? "Collapse" : "Show more"}
      </Text>
    </TouchableOpacity>
  );

  const renderGenre = (genre: string) => (
    <TouchableOpacity
      onPress={() => { router.navigate(`../../search?genre=${genre}`) }}
      style={{
        backgroundColor: "#79AB57",
        height: 30,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
      key={genre}
    >
      <Text style={{ color: "#F7F0DD" }}>
        {genre}
      </Text>
    </TouchableOpacity>
  )

  const DetailedStarRating = ({ rating }: { rating: number }) => {

    const numberOfUsers = book ? (book.rating_list.filter((obj) => obj.rating == rating).length) : 0
    const percentOfUsers = book ? numberOfUsers * 100 / book.rating_list.length : 0

    return (
      <View style={{
        marginLeft: -5,
        width: width > 900 ? "80%" : "100%",
        gap: 10,
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        flexShrink: 1,
      }}>
        <StarRatingDisplay
          rating={rating}
          color="#e2bd04"
          starSize={width <= 750 && width > 600 ? 18 : 24}
          starStyle={{ alignSelf: "center" }}
        />
        {/* Grey bar */}
        <View style={{
          backgroundColor: "#D2D2D2",
          height: 5,
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          flexShrink: 1,
          padding: 5,
          alignSelf: "center",
          borderRadius: 50,
        }} >
          {/* Green bar */}
          <View style={{
            backgroundColor: "#79AB57",
            width: `${percentOfUsers + 5}%`, // add 5 to cover for marginLeft
            display: "flex",
            flexDirection: "row",
            marginLeft: -5,
            padding: 5,
            alignSelf: "center",
            borderRadius: 50,
          }} />
        </View>
        <Text style={{ fontSize: 20, color: "#3C5433" }}>{Intl.NumberFormat("en-US").format(numberOfUsers)}</Text>
      </View >
    );
  };

  const UserReview = ({ user_id, rating }: { user_id: string, rating: number }) => {
    const [userData, setUserData] = useState<User | undefined>(undefined);
    fetchUser({ user_id: user_id, setUserData: setUserData });

    return (
      userData ?
        <View style={{
          gap: 10,
          display: "flex",
          flexDirection: "row",
        }}>
          <Image
            source={{
              uri: userData.image,
            }}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <Text style={{ color: "#3C5433" }}><Text style={{ fontWeight: "bold" }}>{userData.name}</Text> gave this book <Text style={{ fontWeight: "bold" }}>{rating}</Text> {rating > 1 ? "stars" : "star"}!</Text>
        </View>
        : <></>
    )
  }

  const LatestReviews = ({ reviews }: { reviews: number }) => {
    const len = book ? book.rating_list.length : 0

    return (
      <View style={{
        marginTop: 10,
        gap: 10,
        display: "flex",
        flexDirection: "column",
      }}>
        {book?.rating_list.slice(len - 3 > 0 ? len - 3 : 0, len).reverse().map((obj) => (
          <UserReview
            user_id={obj.user_id}
            rating={obj.rating}
            key={obj.user_id}
          />
        ))}
      </View>
    )
  }

  return (
    book ?
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView
          style={{
            paddingVertical: 20,
            paddingHorizontal: 10,
            minHeight: height,
          }}
        >
          <CustomView2 width={width}>
            {/* Book info part */}
            <View
              style={{
                marginHorizontal: 40,
                alignSelf: width > 600 ? "auto" : "center",
              }}
            >
              <CustomBookView width={width} image={book.img_url}>
                <View
                  style={{
                    maxWidth: 200,
                  }}
                >


                </View>
              </CustomBookView>
              <AddBookmarkButton />
              <AddToTopTenButton />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3C5433",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Rate this book
              </Text>
              <StarRating
                rating={rating}
                color="#e2bd04"
                enableHalfStar={false}
                onChange={(rating) => {
                  setRating(rating);
                  if (userId)
                    rateBook({ book_id: book_id, user_id: userId, rating: rating })
                  setIsRated(true)
                }}
              />
              {
                IsRated ?
                  <Text style={{
                    textAlign: "center",
                    color: "#3C5433",
                  }}>
                    You rated this book <Text style={{ fontWeight: "bold" }}>{rating}</Text> stars
                    {userId ? '' : "Please sign in to save your rating."}
                  </Text>
                  :
                  <></>
              }

            </View>
            <View
              style={{
                marginHorizontal: 10,
                gap: 20,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                flexShrink: 1,
              }}
            >
              <View style={{ flexGrow: 1, gap: 20 }}>
                <View style={{
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <ThemedText
                    style={{
                      fontSize: 36,
                      lineHeight: 36,
                      marginTop: 5,
                      fontFamily: "Trirong_700Bold",
                    }}
                  >
                    {book.title}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 20, lineHeight: 28 }}>
                    by {fullAuthorList}
                  </ThemedText>

                  {/* Average rating */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginLeft: -5
                    }}
                  >
                    <StarRatingDisplay
                      rating={book.avg_rating}
                      color="#e2bd04"
                      starSize={width <= 750 && width > 600 ? 18 : 32}
                      starStyle={{ alignSelf: "center" }}
                    />
                    <ThemedText style={{
                      alignSelf: "center",
                      fontWeight: "bold",
                      fontSize: width > 750 ? 28 : 16
                    }}>
                      {/* Round avg_rating to 2 decimal places */}
                      {+book.avg_rating.toFixed(2)}
                    </ThemedText>
                  </View>
                </View>

                {/* Book description */}
                <View>
                  <ThemedText
                    style={{ fontSize: 20, lineHeight: 28, color: "#3C5433" }}
                  >
                    {isfullDescription ? book.description : cutDescription}
                  </ThemedText>
                  {isShortText ? <></> :
                    <ShowMoreButton />}




                  {/* Genres */}
                  <View style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 5,
                    alignContent: "center",
                    marginTop: 10
                  }}>
                    <Text style={{ color: "#3C5433", alignSelf: "center" }}>Genres: </Text>
                    {
                      book.genre_list.map((genre) => renderGenre(genre))
                    }
                  </View>
                </View>
              </View>

              {/* Ratings */}
              <View>
                <ThemedText
                  style={{
                    marginTop: 5,
                    fontFamily: "Trirong_700Bold",
                    fontSize: 32
                  }}
                >
                  Ratings
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 20
                  }}
                >
                  {Intl.NumberFormat("en-US").format(book.rating_list.length)} ratings
                </ThemedText>
                {[5, 4, 3, 2, 1].map((rating: number) => (
                  <DetailedStarRating
                    rating={rating}
                    key={rating}
                  />))}
              </View>

              {/* Lastest Reviews */}
              <View>
                <ThemedText
                  style={{
                    marginTop: 5,
                    fontFamily: "Trirong_700Bold",
                    fontSize: 32
                  }}
                >
                  Latest Reviews
                </ThemedText>
                <LatestReviews reviews={3} />
              </View>


            </View>
          </CustomView2>
        </ThemedView>
      </ScrollView>
      : <></>
  );
}