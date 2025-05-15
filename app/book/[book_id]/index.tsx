import {
  View,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
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
import { ThemedText } from "@/components/ThemedText";

// for formatting published_date
const dateFormat: { day: "numeric"; month: "long"; year: "numeric" } = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export default function BookInfoPage() {
  const router = useRouter();
  const query = useLocalSearchParams<{ book_id: string }>();
  const [book_id, setBookId] = useState(query.book_id ? query.book_id : "");
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

  const AddBookmarkButton = () => (
    <TouchableOpacity
      onPress={() => {
        setBookId(book_id);
        router.navigate(`../../../logBookmark?id=${book_id}`);
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
      <ThemedText type="bold" style={{ color: "#fff", fontSize: 18 }}>
        Bookmark!
      </ThemedText>
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
        <ThemedText type="bold" style={{ color: "#fff", fontSize: 18 }}>
          Add to My Top Ten
        </ThemedText>
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
      <ThemedText style={{ fontSize: 16 }}>
        {isfullDescription ? "Collapse" : "Show more"}
      </ThemedText>
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
      <ThemedText style={{ color: "#F7F0DD", fontSize: 16 }}>
        {genre}
      </ThemedText>
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
        <ThemedText style={{ fontSize: 20 }}>
          {Intl.NumberFormat("en-US").format(numberOfUsers)}
        </ThemedText>
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
        <ThemedText style={{ fontSize: 20, alignSelf: "center" }}>
          <ThemedText
            type="bold"
            style={{ fontSize: 20 }}
            onPress={() => {
              router.navigate(`../../profile/user/${user_id}`);
            }}
          >
            {userData.name}
          </ThemedText>{" "}
          gave this book <ThemedText type="bold">{rating}</ThemedText>{" "}
          {rating > 1 ? "stars" : "star"}!
        </ThemedText>
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
      <ThemedText style={{ marginTop: 10, fontSize: 20 }}>
        This book has no reviews yet.
      </ThemedText>
    );
  };

  return book ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView
        style={{
          paddingBottom: 20,
          paddingTop: 10,
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
                  type="title"
                  style={{
                    fontSize: 36,
                    lineHeight: 36,
                    paddingTop: 25,
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
                      fontSize: 18,
                      color: "rgba(60,84,51,0.7)",
                    }}
                  >
                    {/* Round avg_rating to 2 decimal places */}
                    <ThemedText type="bold">
                      {+book.avg_rating.toFixed(2)}{" "}
                    </ThemedText>
                    ({book.rating_list.length} rating
                    {book.rating_list.length > 1 ? "s" : ""})
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
              <ThemedText
                type="bold"
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Rate this book
              </ThemedText>
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
                <ThemedText
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  You rated this book{" "}
                  <ThemedText type="bold">{rating}</ThemedText> stars
                  {userId ? "" : "Please sign in to save your rating."}
                </ThemedText>
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
                    type="title"
                    style={{
                      fontSize: 36,
                      lineHeight: 36,
                      marginTop: 5,
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
                      marginLeft: 3,
                    }}
                  >
                    <StarRatingDisplay
                      rating={book.avg_rating}
                      color="#e2bd04"
                      starSize={32}
                      starStyle={{ alignSelf: "center", marginLeft: -5 }}
                    />
                    <ThemedText
                      style={{
                        alignSelf: "center",
                        fontSize: 18,
                        color: "rgba(60,84,51,0.7)",
                      }}
                    >
                      {/* Round avg_rating to 2 decimal places */}
                      <ThemedText type="bold">
                        {+book.avg_rating.toFixed(2)}{" "}
                      </ThemedText>
                      ({book.rating_list.length} rating
                      {book.rating_list.length > 1 ? "s" : ""})
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <></>
              )}

              {/* Book description */}
              <View>
                <ThemedText style={{ fontSize: 20, lineHeight: 28 }}>
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
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <ThemedText style={styles.otherInfo}>
                    <ThemedText style={styles.underline}>Genres</ThemedText>:{" "}
                  </ThemedText>
                  {book.genre_list.map((genre) => renderGenre(genre))}
                </View>

                {/* Other info: publisher, published date, number of pages, and ISBN*/}
                <ThemedText style={styles.otherInfo}>
                  <ThemedText style={styles.underline}>Publisher</ThemedText>:{" "}
                  {book.publisher}
                </ThemedText>
                <ThemedText style={styles.otherInfo}>
                  <ThemedText style={styles.underline}>
                    Published date
                  </ThemedText>
                  :{" "}
                  {new Date(book.published_date).toLocaleDateString(
                    "en-UK",
                    dateFormat
                  )}
                </ThemedText>
                <ThemedText style={styles.otherInfo}>
                  <ThemedText style={styles.underline}>Pages</ThemedText>:{" "}
                  {book.total_page}
                </ThemedText>
                <ThemedText style={styles.otherInfo}>
                  <ThemedText style={styles.underline}>ISBN</ThemedText>:{" "}
                  {book_id}
                </ThemedText>
              </View>
            </View>

            {/* Ratings */}
            <View>
              <ThemedText
                type="title"
                style={{
                  marginTop: 5,
                  fontSize: 32,
                  lineHeight: 40,
                }}
              >
                Ratings
              </ThemedText>
              <ThemedText style={{ fontSize: 20 }}>
                {Intl.NumberFormat("en-US").format(book.rating_list.length)}{" "}
                total rating{book.rating_list.length > 1 ? "s" : ""}
              </ThemedText>
              {[5, 4, 3, 2, 1].map((rating: number) => (
                <DetailedStarRating rating={rating} key={rating} />
              ))}
            </View>

            {/* Lastest Reviews */}
            <View>
              <ThemedText
                type="title"
                style={{
                  marginTop: 5,
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

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: "underline",
    textDecorationColor: "#79AB57",
    fontFamily: "Kanit_500Medium",
  },
  otherInfo: {
    fontSize: 16,
    lineHeight: 32,
  },
});
