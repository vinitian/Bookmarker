
//TODO: decide whether to keep book_id, user_id

interface Book {
    book_id: string,
    isbn: string,
    title: string,
    author: string,
    genre: string[],
    avg_rating: number,
    total_page: number,
    img_url: string,
    rating: {
        user_id: string,
        rating: number
    }
}

interface User {
    user_id: string,
    email: string,
    name: string,
    fav_list: string[10],
    books: PersonalBook,
}

interface PersonalBook {
    book_id: string,
    rating: number,
    cumul_time: number,
    pages_read: number,
    reading_sessions: ReadingSession[],
}

interface ReadingSession {
    start_time: Date,
    end_time: Date,
    total_time: number,
    start_page: number,
    end_page: number, 
    total_page: number
}
