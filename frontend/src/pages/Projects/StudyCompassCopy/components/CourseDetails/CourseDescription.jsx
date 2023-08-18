import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import WordCloud from '../Wordcloud'
import SchoolIcon from '@mui/icons-material/School'

const CourseDescription = ({
  description,
  url,
  keywords,
  studyPrograms,
  expand,
}) => {
  const removeFirstWord = (str) => {
    const indexOfSpace = str.indexOf(' ')
    if (indexOfSpace === -1) {
      return ''
    }
    return str.substring(indexOfSpace + 1)
  }

  return (
    <>
      {/*<Grid container>*/}
      <Grid container>
        {keywords.length !== 0 && expand ? (
          <>
            <Typography gutterBottom style={{ fontWeight: 'bold' }}>
              Topics
            </Typography>
            <WordCloud keywords={keywords} />
          </>
        ) : (
          <></>
        )}
      </Grid>

      <Grid container>
        {description ? (
          <>
            <Typography gutterBottom style={{ fontWeight: 'bold' }}>
              Description
            </Typography>
            <Typography variant="body2" style={{ paddingBottom: 24 }}>
              {removeFirstWord(description)}
            </Typography>
          </>
        ) : (
          <></>
        )}

        {studyPrograms.length !== 0 ? (
          <>
            <Grid item xs={12} style={{ paddingBottom: 24 }}>
              <Typography style={{ fontWeight: 'bold' }} gutterBottom>
                Assigned study programs
              </Typography>

              <Box style={{ marginLeft: 16 }}>
                <ul>
                  {studyPrograms.map((studyProgram, index) => {
                    return (
                      <li key={index}>
                        <Typography variant="body2" gutterBottom>
                          {studyProgram.name}
                        </Typography>
                      </li>
                    )
                  })}
                </ul>
              </Box>
            </Grid>

            <Button
              variant="outlined"
              startIcon={<SchoolIcon />}
              style={{
                borderColor: '#FB9B0E',
                backgroundColor: '#FFFFFF',
                color: '#FB9B0E',
              }}
              onClick={() => window.open(url, '_blank')}>
              LSF
            </Button>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  )
}

export default CourseDescription
