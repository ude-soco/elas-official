import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloud = ({ keywords }) => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const temp = [];
    keywords.forEach((keyword) => {
      temp.push({
        ...keyword,
        value: keyword.value * 1000,
      });
    });
    setData(temp);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      renderWordCloud();
    }
  }, [data]);

  const renderWordCloud = () => {
    const width = 700;
    const height = 400;

    const layout = cloud()
      .size([width, height])
      .words(data)
      .padding(3)
      .rotate(() => 0) // Set rotation angle to 0 for all words
      .font("Helvetica")
      .fontSize((d) => d.value)
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1]);

      svg
        .append("g")
        .attr(
          "transform",
          `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.value}px`)
        .style("font-family", "Helvetica")
        .style("fill", (d, i) => {
          const baseColor = d3.hsl(200, 1, 0.5); // Base color in HSL format
          const saturationFactor = 0.8 * (i / data.length) + 0.2; // Scale saturation from 0.2 to 1 based on word index
          return d3.interpolateHsl(
            baseColor,
            baseColor.brighter(saturationFactor)
          )(1);
        })
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  };

  return <div ref={chartRef} />;
};

export default WordCloud;

// import { useEffect, useState } from "react";
// import ReactWordcloud from "react-wordcloud";
// import "tippy.js/dist/tippy.css";
// import "tippy.js/animations/scale.css";
// import { loading } from "../StudyCompass";

// const WordCloud = ({ keywords }) => {
//   const [show, setShow] = useState(false);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const temp = [];
//     keywords.forEach((keyword) => {
//       temp.push({
//         ...keyword,
//         value: keyword.value * 1000,
//       });
//     });
//     setData(temp);
//     setTimeout(() => {
//       setShow((prevState) => !prevState);
//     }, 200);
//   }, []);

//   const openModal = (word) => {
//     console.log(`Word clicked: ${word}`);
//   };

//   return (
//     <>
//       {show ? (
//         <>
//           <ReactWordcloud
//             words={data}
//             options={{
//               colors: [
// "#b39ddb",
// "#7e57c2",
// "#4fc3f7",
// "#03a9f4",
// "#0288d1",
// "#01579b",
//               ],
//               enableTooltip: true,
//               deterministic: true,
//               fontFamily: "helvetica",
//               fontSizes: [14, 64],
//               fontStyle: "normal",
//               fontWeight: "normal",
//               padding: 3,
//               rotations: 1,
//               rotationAngles: [0, 90],
//               scale: "sqrt",
//               spiral: "archimedean",
//               transitionDuration: 1000,
//             }}
//             callbacks={{
//               onWordClick: (word) => openModal(word.text),
//               getWordTooltip: (word) => `Topic: "${word.text}"`,
//             }}
//           />
//         </>
//       ) : (
//         <> {loading} </>
//       )}
//     </>
//   );
// };

// export default WordCloud;
