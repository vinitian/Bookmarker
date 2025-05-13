import {
  View,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppContext } from "@/app/_layout";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import fetchBook from "@/lib/fetchBook";
import StarRating from "react-native-star-rating-widget";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import CustomView2 from "@/components/CustomView2";
import fetchUser from "@/lib/fetchUser";
import rateBook from "@/lib/rateBook";
import addToTopTen from "@/lib/addToTopTen";

export default function BookInfoPage() {
  const router = useRouter();
  const { bookId, setBookId } = useAppContext();
  const local = useLocalSearchParams<{ book_id: string }>();
  const book_id: string = local.book_id;
  const [book, setBookData] = useState<Book | undefined>(undefined);
  useEffect(() => {
    fetchBook({ book_id: book_id, setBookData: setBookData });
  }, [book_id]);

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

  const fullAuthorList = book?.author_list
    .join(", ")
    .replace(new RegExp(",(?=[^,]*$)"), " and");
  const [rating, setRating] = useState(0);
  const [IsRated, setIsRated] = useState(false);
  const [isfullDescription, setIsFullDescription] = useState<boolean>(false);
  const CHARACTER_LIMIT = 400;
  const isShortText = book ? book.description.length < CHARACTER_LIMIT : false;
  const cutDescription = book
    ? book.description.slice(0, CHARACTER_LIMIT) + (isShortText ? "" : "...")
    : "";
  useEffect(() => {
    setIsFullDescription(isShortText);
  }, []);

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
        setBookId(book_id);
        router.navigate("../../profile/logBookmark");
      }}
      style={{
        backgroundColor: "#79AB57",
        height: 50,
        width: 200,
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
        Bookmark!
      </Text>
    </TouchableOpacity>
  );

  const AddToTopTenButton = () =>
    userId ? (
      <TouchableOpacity
        onPress={() => addToTopTen({ book_id: book_id, user_id: userId })}
        style={{
          backgroundColor: "#3C5433",
          height: 50,
          width: 200,
          marginTop: 10,
          padding: 5,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          Add to My Top Ten
        </Text>
      </TouchableOpacity>
    ) : (
      <></>
    );

  const ShowMoreButton = () => (
    <TouchableOpacity
      onPress={() => setIsFullDescription(!isfullDescription)}
      style={{
        backgroundColor: "#EBDF94",
        height: 40,
        width: 120,
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
    >
      <Text style={{ color: "#3C5433", fontSize: 16 }}>
        {isfullDescription ? "Collapse" : "Show more"}
      </Text>
    </TouchableOpacity>
  );

  const renderGenre = (genre: string) => (
    <TouchableOpacity
      onPress={() => {
        router.navigate(`../../search?genre=${genre}`);
      }}
      style={{
        backgroundColor: "#79AB57",
        height: 40,
        padding: 10,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
      key={genre}
    >
      <Text style={{ color: "#F7F0DD", fontSize: 16 }}>{genre}</Text>
    </TouchableOpacity>
  );

  const DetailedStarRating = ({ rating }: { rating: number }) => {
    const numberOfUsers = book
      ? book.rating_list.filter((obj) => obj.rating == rating).length
      : 0;
    const percentOfUsers = book
      ? (numberOfUsers * 100) / book.rating_list.length
      : 0;

    return (
      <View
        style={{
          marginLeft: -5,
          width: width > 900 ? "80%" : "100%",
          gap: 10,
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          flexShrink: 1,
        }}
      >
        <StarRatingDisplay
          rating={rating}
          color="#e2bd04"
          starSize={width <= 750 && width > 600 ? 18 : 24}
          starStyle={{ alignSelf: "center" }}
        />
        {/* Grey bar */}
        <View
          style={{
            backgroundColor: "#D2D2D2",
            height: 5,
            flexDirection: "row",
            flexGrow: 1,
            flexShrink: 1,
            paddingVertical: 5,
            alignSelf: "center",
            borderRadius: 50,
            justifyContent: "flex-start",
          }}
        >
          {/* Green bar */}
          <View
            style={{
              backgroundColor: "#79AB57",
              width: `${percentOfUsers}%`,
              flexDirection: "row",
              marginLeft: 0,
              padding: 5,
              alignSelf: "center",
              borderRadius: 50,
            }}
          />
        </View>
        <Text style={{ fontSize: 20, color: "#3C5433" }}>
          {Intl.NumberFormat("en-US").format(numberOfUsers)}
        </Text>
      </View>
    );
  };

  const UserReview = ({
    user_id,
    rating,
  }: {
    user_id: string;
    rating: number;
  }) => {
    const [userData, setUserData] = useState<User | undefined>(undefined);
    fetchUser({ user_id: user_id, setUserData: setUserData });

    return userData ? (
      <View
        style={{
          gap: 10,
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.navigate(`../../profile/user/${user_id}`);
          }}
        >
          <Image
            source={{
              uri: userData.image,
            }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <Text style={{ color: "#3C5433", fontSize: 20, alignSelf: "center" }}>
          <Text
            style={{
              color: "#3C5433",
              fontSize: 20,
              fontWeight: "bold",
              // top: 6,
            }}
            onPress={() => {
              router.navigate(`../../profile/user/${user_id}`);
            }}
          >
            {userData.name}
          </Text>{" "}
          gave this book <Text style={{ fontWeight: "bold" }}>{rating}</Text>{" "}
          {rating > 1 ? "stars" : "star"}!
        </Text>
      </View>
    ) : (
      <></>
    );
  };

  const LatestReviews = ({ reviews }: { reviews: number }) => {
    const len = book ? book.rating_list.length : 0;

    return len > 0 ? (
      <View
        style={{
          marginTop: 10,
          gap: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {book?.rating_list
          .slice(len - 3 > 0 ? len - 3 : 0, len)
          .reverse()
          .map((obj) => (
            <UserReview
              user_id={obj.user_id}
              rating={obj.rating}
              key={obj.user_id}
            />
          ))}
      </View>
    ) : (
      <Text style={{ color: "#3C5433", marginTop: 10, fontSize: 20 }}>
        This book has no reviews yet.
      </Text>
    );
  };

  return book ? (
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
            {/* Book title, authors, and average rating for small screen */}
            {width <= 600 ? (
              <View
                style={{
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 36,
                    lineHeight: 36,
                    marginTop: 5,
                    paddingTop: 30,
                    fontFamily: "Trirong_700Bold",
                  }}
                >
                  {book.title}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 20,
                    marginTop: Platform.OS !== "web" ? -10 : 0,
                  }}
                >
                  by {fullAuthorList}
                </ThemedText>

                {/* Average rating */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginLeft: -5,
                  }}
                >
                  <StarRatingDisplay
                    rating={book.avg_rating}
                    color="#e2bd04"
                    starSize={width <= 750 && width > 600 ? 18 : 32}
                    starStyle={{ alignSelf: "center" }}
                  />
                  <ThemedText
                    style={{
                      alignSelf: "center",
                      fontWeight: "bold",
                      fontSize: width <= 750 && width > 600 ? 16 : 32,
                      lineHeight: width <= 750 && width > 600 ? 16 : 32,
                    }}
                  >
                    {/* Round avg_rating to 2 decimal places */}
                    {+book.avg_rating.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            ) : (
              <></>
            )}

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 200,
                }}
              >
                <Image
                  source={{
                    uri: book.img_url,
                  }}
                  style={{
                    width: 200,
                    height: 300,
                    borderRadius: 8,
                  }}
                />
              </View>
              <AddBookmarkButton />
              <AddToTopTenButton />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3C5433",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
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
                    rateBook({
                      book_id: book_id,
                      user_id: userId,
                      rating: rating,
                    });
                  setIsRated(true);
                }}
              />
              {IsRated ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#3C5433",
                    fontSize: 16,
                  }}
                >
                  You rated this book{" "}
                  <Text style={{ fontWeight: "bold" }}>{rating}</Text> stars
                  {userId ? "" : "Please sign in to save your rating."}
                </Text>
              ) : (
                <></>
              )}
            </View>
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
              {/* Book title, authors, and average rating for large screen */}
              {width > 600 ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
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
                  <ThemedText style={{ fontSize: 20 }}>
                    by {fullAuthorList}
                  </ThemedText>

                  {/* Average rating */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginLeft: -5,
                    }}
                  >
                    <StarRatingDisplay
                      rating={book.avg_rating}
                      color="#e2bd04"
                      starSize={width <= 750 && width > 600 ? 18 : 32}
                      starStyle={{ alignSelf: "center" }}
                    />
                    <ThemedText
                      style={{
                        alignSelf: "center",
                        fontWeight: "bold",
                        fontSize: width <= 750 && width > 600 ? 16 : 32,
                      }}
                    >
                      {/* Round avg_rating to 2 decimal places */}
                      {+book.avg_rating.toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <></>
              )}

              {/* Book description */}
              <View>
                <ThemedText
                  style={{ fontSize: 20, lineHeight: 28, color: "#3C5433" }}
                >
                  {isfullDescription ? book.description : cutDescription}
                </ThemedText>
                {isShortText ? <></> : <ShowMoreButton />}

                {/* Genres */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 5,
                    alignContent: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#3C5433",
                      alignSelf: "center",
                      fontSize: 16,
                    }}
                  >
                    Genres:{" "}
                  </Text>
                  {book.genre_list.map((genre) => renderGenre(genre))}
                </View>
              </View>
            </View>

            {/* Ratings */}
            <View>
              <ThemedText
                style={{
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                  fontSize: 32,
                  lineHeight: 40,
                }}
              >
                Ratings
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 20,
                }}
              >
                {Intl.NumberFormat("en-US").format(book.rating_list.length)}{" "}
                total ratings
              </ThemedText>
              {[5, 4, 3, 2, 1].map((rating: number) => (
                <DetailedStarRating rating={rating} key={rating} />
              ))}
            </View>

            {/* Lastest Reviews */}
            <View>
              <ThemedText
                style={{
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                  fontSize: 32,
                  lineHeight: 40,
                }}
              >
                Latest Reviews
              </ThemedText>
              <LatestReviews reviews={5} />
            </View>
          </View>
        </CustomView2>
      </ThemedView>
    </ScrollView>
  ) : (
    <></>
  );
}
