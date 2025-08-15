import React from 'react';
import { Skeleton, Box } from '@mui/material';

const SkeletonLoader = () => (
  <Box sx={{ width: '100%', p: 2 }}>
    <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
    <Skeleton variant="text" height={30} />
    <Skeleton variant="text" height={30} />
    <Skeleton variant="text" height={30} />
  </Box>
);

export default SkeletonLoader;
