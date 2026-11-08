# BookNook – Client Side

BookNook is a small neighbourhood online library application where users can discover, borrow, and contribute books.

- **Live URL**: https://booknook-library.vercel.app
- **Server API**: https://booknook-api.render.com

## Key Features
- **Dynamic New Arrivals**: Real-time descending date-sorted book catalogue loaded directly from MongoDB.
- **Copy Management System**: Automated decrement on borrow and increment on return, preventing zero-copy requests.
- **Safe Single-Borrow Rule**: Prevents users from concurrently taking more than one copy of the same book.
- **Better-Auth & Google OAuth**: Seamless authentication with protected routes for shelf management.
- **Responsive Dark Library Design**: Handcrafted UI consistent with the aesthetic of classic literary shelves.