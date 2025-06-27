import React  from "react";


function isValidEmail(email) {
  // regex פשוט לבדיקה בסיסית של מייל תקין
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPassword(password) {
    if(password === null || password.length<8) {return false;}
    //check if pasword include at least one lowercase letter, one uppercase letter, one number and one special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
  

}