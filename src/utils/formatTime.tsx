import React from 'react'

export const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    
    const today = new Date();

    if (year == 1970) return null

    const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    if(isToday) return `${hours}:${minutes}`
    return `${day}/${month}/${year}`;
  };



  export const getTimeStamp = (formattedDate) => {
    if (!formattedDate) return null;
  
    if (/^\d{2}:\d{2}$/.test(formattedDate)) {
      const [hours, minutes] = formattedDate.split(':');
      const today = new Date();
      today.setHours(hours);
      today.setMinutes(minutes);
      today.setSeconds(0);
      today.setMilliseconds(0);
      return today.getTime();
    }
  
    
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formattedDate)) {
      const [day, month, year] = formattedDate.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date.getTime(); 
    }
  
    return null;
  };
