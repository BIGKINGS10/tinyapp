# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
- Login Page
!["Login Page"](/images/homepage.png)

- Registration Page
!["Registration Page"](/images/registration.png )

- Create ShortURL 1
!["Create Short Url"](/images/createshorturl.png )

- Create ShortURL 2
!["Create Short Url"](/images/createshorturl2.png )

- Create ShortURL 3
!["Create Short Url"](/images/createshorturl3.png )

- Edit URL
!["Create Short Url"](/images/editurl.png )

- Dashboard
!["Create Short Url"](/images/urllist.png )

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Description
- The tinyapp homepage shows the list of available short URLs currently on the database, the corresponding long URLs, the date the short URL was created, the number of visits which indicate how many times the short URL was visited, the number of unique visits indicating how many unique users have used the short URL, and the creator of the short URL

- Users must log on before being able to add new URLs that can be shorted

- Once a new short URL is created, it is shown both in public in home and the users own private URL database