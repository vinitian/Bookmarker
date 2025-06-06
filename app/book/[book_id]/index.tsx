import {
  View,
  Image,
  Pressable,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
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
import { useAppContext } from "@/app/_layout";

// for formatting published_date
const dateFormat: { day: "numeric"; month: "long"; year: "numeric" } = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export default function BookInfoPage() {
  const router = useRouter();
  const { queryText, setQueryText, type, setType } = useAppContext();
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
    <Pressable
      onPress={() => {
        setBookId(book_id);
        router.navigate(`../../../logBookmark?id=${book_id}`);
      }}
      style={({ pressed }: { pressed: boolean }) => ({
        backgroundColor: "#79AB57",
        height: 50,
        width: 200,
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <ThemedText
        type="bold"
        style={{
          color: "#fff",
          fontSize: 18,
          marginTop: Platform.OS === "web" ? 0 : 5,
        }}
      >
        Bookmark!
      </ThemedText>
    </Pressable>
  );

  const AddToTopTenButton = () =>
    userId ? (
      <Pressable
        onPress={() => addToTopTen({ book_id: book_id, user_id: userId })}
        style={({ pressed }: { pressed: boolean }) => ({
          backgroundColor: "#3C5433",
          height: 50,
          width: 200,
          marginTop: 10,
          padding: 5,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <ThemedText
          type="bold"
          style={{
            color: "#fff",
            fontSize: 18,
            marginTop: Platform.OS === "web" ? 0 : 5,
          }}
        >
          Add to My Top Ten
        </ThemedText>
      </Pressable>
    ) : (
      <></>
    );

  const ShowMoreButton = () => (
    <Pressable
      onPress={() => setIsFullDescription(!isfullDescription)}
      style={({ pressed }: { pressed: boolean }) => ({
        backgroundColor: "#EBDF94",
        height: 40,
        width: 120,
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <ThemedText style={{ fontSize: 16 }}>
        {isfullDescription ? "Collapse" : "Show more"}
      </ThemedText>
    </Pressable>
  );

  const renderGenre = (genre: string) => {
    return (
      <Pressable
        onPress={() => {
          setQueryText(genre);
          setType("genre");
          router.navigate(
            `../../search?type=genre&q=${encodeURIComponent(genre)}`
          );
        }}
        style={({ pressed }: { pressed: boolean }) => ({
          backgroundColor: "#79AB57",
          height: 40,
          padding: 10,
          paddingHorizontal: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          opacity: pressed ? 0.5 : 1,
        })}
        key={genre}
      >
        <ThemedText style={{ color: "#F7F0DD", fontSize: 16 }}>
          {genre}
        </ThemedText>
      </Pressable>
    );
  };

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
        <ThemedText style={{ fontSize: 20, lineHeight: 32, minWidth: 15 }}>
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
          minHeight: 40,
        }}
      >
        <Pressable
          onPress={() => {
            router.navigate(`../../profile/user/${user_id}`);
          }}
          style={({ pressed }: { pressed: boolean }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Image
            source={{
              uri: userData.image,
            }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
        </Pressable>
        <ThemedText style={{ fontSize: 20, alignSelf: "center" }}>
          <ThemedText
            type="bold"
            style={{ fontSize: 20, lineHeight: 28 }}
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
    const bookReviews = book?.rating_list
      .slice(len - reviews > 0 ? len - reviews : 0, len)
      .reverse();

    return len > 0 ? (
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={{
          marginTop: 10,
          gap: 10,
          display: "flex",
          flexDirection: "column",
        }}
        data={bookReviews}
        keyExtractor={(review: Rating) => review.user_id}
        renderItem={({ item }: { item: Rating }) => (
          <UserReview
            user_id={item.user_id}
            rating={item.rating}
            key={item.user_id}
          />
        )}
      />
    ) : (
      <ThemedText style={{ marginTop: 10, fontSize: 20, paddingTop: 3 }}>
        This book has no reviews yet.
      </ThemedText>
    );
  };

  return book ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView
        style={{
          paddingBottom: 150,
          paddingTop: 10,
          paddingHorizontal: 10,
          minHeight: height,
        }}
      >
        <CustomView2 width={width} breakPoint={700}>
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
                    lineHeight: 28,
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
                    justifyContent: "center",
                    marginLeft: -5,
                  }}
                >
                  <StarRatingDisplay
                    rating={book.avg_rating}
                    color="#e2bd04"
                    starSize={width <= 750 && width > 600 ? 18 : 32}
                    starStyle={{
                      alignSelf: "center",
                    }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: Platform.OS === "web" ? 0 : 15,
                    }}
                  >
                    {/* Round avg_rating to 2 decimal places */}
                    <ThemedText
                      type="bold"
                      style={{
                        fontSize: 28,
                        lineHeight: 30,
                      }}
                    >
                      {+book.avg_rating.toFixed(2)}{" "}
                    </ThemedText>
                    <ThemedText
                      style={{
                        alignSelf: "center",
                        fontSize: 18,
                        color: "rgba(60,84,51,0.7)",
                        marginTop: Platform.OS === "web" ? 0 : -5,
                        lineHeight: 24,
                      }}
                    >
                      ({book.rating_list.length} rating
                      {book.rating_list.length > 1 ? "s" : ""})
                    </ThemedText>
                  </View>
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
                  {userId ? "" : "\nPlease sign in to save your rating."}
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
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {/* Round avg_rating to 2 decimal places */}
                      <ThemedText
                        type="bold"
                        style={{
                          fontSize: 28,
                          lineHeight: 30,
                        }}
                      >
                        {+book.avg_rating.toFixed(2)}{" "}
                      </ThemedText>
                      <ThemedText
                        style={{
                          alignSelf: "center",
                          fontSize: 18,
                          color: "rgba(60,84,51,0.7)",
                        }}
                      >
                        ({book.rating_list.length} rating
                        {book.rating_list.length > 1 ? "s" : ""})
                      </ThemedText>
                    </View>
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
                <View style={{ gap: 10 }}>
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
                      <ThemedText style={styles.underline}>
                        Genre{book.genre_list.length > 1 ? "s" : ""}
                      </ThemedText>
                      :{" "}
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
                    {new Date(
                      book.published_date.seconds * 1000
                    ).toLocaleDateString("en-UK", dateFormat)}
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
              <ThemedText style={{ fontSize: 20, lineHeight: 24 }}>
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
  },
});
