import React, { useState, useEffect, useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import Plot from 'react-plotly.js'
import createPlotlyComponent from 'react-plotly.js/factory'
import { getRandomColor } from './utils/functions'

const CoursePath = ({
  lableList,
  sourceList,
  targetList,
  valueList,
  width,
  height,
}) => {
  // let colorList = sourceList?.map(() => useMemo(() => getRandomColor(), []))
  const data = [
    {
      type: 'sankey',
      orientation: 'h',
      node: {
        pad: 10,
        thickness: 15,
        line: {
          color: 'black',
          width: 0.5,
        },
        label: lableList,
      },
      link: {
        // arrowlen: 20,
        source: sourceList,
        target: targetList,
        value: valueList,
        // hovertemplate: 'good',
      },
    },
  ]
  return (
    <>
      <Grid container justifyContent="center">
        <Grid item>
          <Plot
            data={data}
            layout={{ width: width, height: height }}
            config={{ responsive: true }}
            // style={}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default CoursePath
