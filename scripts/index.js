export default function getRandomNumber() {
  return Math.floor(Math.random() * 1000 + 1);
}

const num = getRandomNumber();
console.log(num);