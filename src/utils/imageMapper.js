import australiaImg from "../assets/images/australia.jpg";
import chinaImg from "../assets/images/china.jpg";
import ethiopiaImg from "../assets/images/ethiopia.jpg";
import germanyImg from "../assets/images/germany.jpg";
import ghanaImg from "../assets/images/ghana.jpg";
import japanImg from "../assets/images/japan.jpg";
import southAfricaImg from "../assets/images/southAfrica.jpg";
import tanzaniaImg from "../assets/images/tanzania.jpg";
import heroBgImg from "../assets/images/hero_bg.jpg";

export const imageMap = {
  australia: australiaImg,
  china: chinaImg,
  ethiopia: ethiopiaImg,
  germany: germanyImg,
  ghana: ghanaImg,
  japan: japanImg,
  southafrica: southAfricaImg,
  "south-africa": southAfricaImg,
  south_africa: southAfricaImg,
  tanzania: tanzaniaImg,
};

/**
 * Returns the corresponding image asset for a destination's imageKey.
 * Falls back to hero_bg.jpg if the imageKey is not recognized.
 *
 * @param {string} imageKey
 * @returns {string} Image source URL/path
 */
export const getDestinationImage = (imageKey) => {
  if (!imageKey) {
    return heroBgImg;
  }

  // If the imageKey is already an HTTP URL or absolute path, return it directly
  if (imageKey.startsWith("http://") || imageKey.startsWith("https://") || imageKey.startsWith("data:")) {
    return imageKey;
  }

  // Normalize key by lowercasing and removing extensions/hyphens/spaces
  const normalizedKey = imageKey.toLowerCase().replace(/\.(jpg|jpeg|png|webp|svg)$/i, "").trim();

  return imageMap[normalizedKey] || heroBgImg;
};

export default getDestinationImage;
