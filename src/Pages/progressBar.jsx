// src/components/ProgressCircle.js

import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel({value = 0}) {
     const safeValue = isNaN(value) ? 0 : Math.round(value); 
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value = {safeValue} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
          {`${safeValue}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

// ✅ Accept `value` from parent instead of having internal state
export default function CircularWithValueLabel({ value = 0  }) {
  return <CircularProgressWithLabel value={value} />;
}

CircularWithValueLabel.propTypes = {
  value: PropTypes.number.isRequired,
};
