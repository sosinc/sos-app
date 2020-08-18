export default (name: string) => {
  const randomBgColor = '#' + Math.random().toString(16).substr(-6);
  const textColor = '#f7f8f8';

  return `
  <svg width="100" height="100" viewBox="0 0 87 85" fill="none" xmlns="http://www.w3.org/2000/svg">

    <style>
      .text { font: bold 45px sans-serif; fill: ${textColor}; text-shadow: .1em .1em .2em rgba(0, 0, 0, 0.6) }
    </style>
    <rect width="86.0494" height="85" fill="${randomBgColor}"/>
    <text class="text" x="25" y="58" > ${name[0]} </text>

</svg>`;
};
