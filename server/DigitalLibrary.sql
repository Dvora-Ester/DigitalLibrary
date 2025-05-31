CREATE DATABASE DigitalLibrary;
USE DigitalLibrary;

 -- טבלת משתמשים
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Is_Manager BOOLEAN DEFAULT FALSE
);

-- טבלת סיסמאות (קשר 1 ל-1 עם User)
CREATE TABLE Passwords (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    User_Id INT UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE
);

-- טבלת ספרים
CREATE TABLE Books (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Book_Name VARCHAR(200) NOT NULL,
    author varchar(30),
    number_Of_Page INT,
    Price DECIMAL(10,2),
    Category VARCHAR(100),
    Note TEXT,
    Status ENUM('offered', 'approved', 'available', 'sold') DEFAULT 'offered',
    Seller_Id INT,
    Editing_Date Date,
    FOREIGN KEY (seller_Id) REFERENCES Users(Id) 
);

-- טבלת ספריה אישית של משתמש
CREATE TABLE Library_Of_User (
    User_Id INT,
    Book_Id INT,
    Purchase_Date DATE,
    Bookmark_On_Page INT,
    PRIMARY KEY (User_Id, Book_Id),
    FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (Book_Id) REFERENCES Books(Id) ON DELETE CASCADE
);
-- טבלת הזמנות
CREATE TABLE Orders (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    User_Id INT,
    cc_Last_Four_Diggits VARCHAR(4),
    date DATE,
    FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE
);

-- טבלת פרטי הזמנה
CREATE TABLE Order_Details (
    Order_Id INT,
    Book_Id INT,
    PRIMARY KEY (Order_Id, Book_Id),
    FOREIGN KEY (Order_Id) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (Book_Id) REFERENCES Books(Id) 
);
-- טבלת חוות דעת
CREATE TABLE Comments (
Id INT PRIMARY KEY AUTO_INCREMENT,
Book_Id INT,
User_Id INT,
title VARCHAR(100),
content VARCHAR(1000),
Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE,
FOREIGN KEY (Book_Id) REFERENCES Books(Id) ON DELETE CASCADE
);