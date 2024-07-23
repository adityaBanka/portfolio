import React from 'react';

function HoverWords({ text }) {
  // Split the text into words and wrap each word with a span that inverts color on hover
  const words = text.split(' ').map((word, index) => (
    <span key={index} className="hover:text-white mx-1 transition-colors duration-300 ">
      {word}
    </span>
  ));

  return <div>{words}</div>;
}

export default HoverWords;
