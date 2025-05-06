export const getFirstImage = (imagesString) => {
    try {
        const imagesArray = JSON.parse(imagesString);
        return imagesArray.length > 0 ? imagesArray[0] : null;
    } catch (error) {
        console.error("Invalid images format", error);
        return null;
    }
};

export const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix(day)} ${month} ${year}`;
  };
  